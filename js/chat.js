/**
 * Chat Logic
 * Handles real-time messaging between clients and lawyers
 */

import { supabase } from './supabaseClient.js';
import { formatDate, formatRelativeTime, sanitizeHtml } from './utils.js';

let currentUser = null;
let currentConversation = null;
let conversationId = null;
let messagesChannel = null;

// Initialize chat on page load
document.addEventListener('DOMContentLoaded', async () => {
  await initializeChat();
});

/**
 * Initialize chat interface
 */
async function initializeChat() {
  try {
    // Check authentication
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = 'index.html';
      return;
    }

    currentUser = user;

    // Get conversation ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    conversationId = urlParams.get('conversation_id');

    if (!conversationId) {
      // No conversation selected, load all conversations
      await loadConversationsList();
    } else {
      // Load specific conversation
      await loadConversation(conversationId);
      await loadMessages();
      setupRealtimeSubscription();
    }

    // Setup message form
    setupMessageForm();

    // Also load conversations list
    await loadConversationsList();

  } catch (error) {
    console.error('Chat initialization error:', error);
    alert('Failed to load chat. Please try again.');
    window.location.href = 'home.html';
  }
}

/**
 * Load conversations list
 */
async function loadConversationsList() {
  const list = document.getElementById('conversationsList');
  list.innerHTML = '<div class="loading">Loading...</div>';

  try {
    // Get user's profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    let query = supabase
      .from('conversations')
      .select(`
        *,
        client:client_id (full_name),
        lawyer:lawyer_id (full_name)
      `)
      .order('last_message_at', { ascending: false, nullsFirst: false });

    // Filter based on role
    if (profile.role === 'client') {
      query = query.eq('client_id', currentUser.id);
    } else {
      query = query.eq('lawyer_id', currentUser.id);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (data.length === 0) {
      list.innerHTML = '<p style="padding: 1rem; color: var(--text-light);">No conversations yet</p>';
      return;
    }

    list.innerHTML = '';
    for (const conv of data) {
      const item = await createConversationItem(conv, profile.role);
      list.appendChild(item);
    }

  } catch (error) {
    console.error('Error loading conversations:', error);
    list.innerHTML = '<p style="padding: 1rem; color: var(--error-color);">Failed to load</p>';
  }
}

/**
 * Create conversation item element
 */
async function createConversationItem(conversation, userRole) {
  const item = document.createElement('div');
  item.className = 'conversation-item';

  if (conversationId === conversation.id) {
    item.classList.add('active');
  }

  // Get last message
  const { data: lastMessage } = await supabase
    .from('messages')
    .select('body, created_at')
    .eq('conversation_id', conversation.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const otherPartyName = userRole === 'client'
    ? conversation.lawyer?.full_name || 'Lawyer'
    : conversation.client?.full_name || 'Client';

  item.innerHTML = `
    <h4>${otherPartyName}</h4>
    <p>${lastMessage ? sanitizeHtml(lastMessage.body.substring(0, 50)) + (lastMessage.body.length > 50 ? '...' : '') : 'Start conversation'}</p>
  `;

  item.onclick = () => {
    window.location.href = `chat.html?conversation_id=${conversation.id}`;
  };

  return item;
}

/**
 * Load conversation details
 */
async function loadConversation(convId) {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        client:client_id (full_name),
        lawyer:lawyer_id (full_name)
      `)
      .eq('id', convId)
      .single();

    if (error) throw error;

    currentConversation = data;

    // Update chat header
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single();

    const otherPartyName = profile.role === 'client'
      ? data.lawyer?.full_name || 'Lawyer'
      : data.client?.full_name || 'Client';

    document.getElementById('chatHeaderContent').innerHTML = `
      <h3>${otherPartyName}</h3>
    `;

    // Show message input
    document.getElementById('messageInputContainer').style.display = 'block';

  } catch (error) {
    console.error('Error loading conversation:', error);
    alert('Failed to load conversation.');
    window.location.href = 'home.html';
  }
}

/**
 * Load messages
 */
async function loadMessages() {
  const container = document.getElementById('messagesContainer');
  container.innerHTML = '<div class="loading">Loading messages...</div>';

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    container.innerHTML = '';

    if (data.length === 0) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'no-conversation';
      emptyDiv.innerHTML = '<p>No messages yet. Start the conversation!</p>';
      container.appendChild(emptyDiv);
      return;
    }

    data.forEach(message => {
      container.appendChild(createMessageElement(message));
    });

    // Scroll to bottom
    scrollToBottom();

  } catch (error) {
    console.error('Error loading messages:', error);
    container.innerHTML = '<div class="empty-state"><h3>Failed to load messages</h3></div>';
  }
}

/**
 * Create message element
 */
function createMessageElement(message) {
  const div = document.createElement('div');
  div.className = 'message';
  div.className += message.sender_id === currentUser.id ? ' sent' : ' received';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble';
  bubble.textContent = message.body;

  const time = document.createElement('div');
  time.className = 'message-time';
  time.textContent = formatDate(message.created_at);

  div.appendChild(bubble);
  div.appendChild(time);

  return div;
}

/**
 * Setup message form
 */
function setupMessageForm() {
  const form = document.getElementById('messageForm');
  const input = document.getElementById('messageInput');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const body = input.value.trim();
    if (!body) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          sender_id: currentUser.id,
          body: body,
        }]);

      if (error) throw error;

      // Clear input
      input.value = '';

      // Note: Message will be added via realtime subscription

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
  });

  // Submit on Enter (but allow Shift+Enter for new line)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });
}

/**
 * Setup realtime subscription for new messages
 */
function setupRealtimeSubscription() {
  // Subscribe to messages in this conversation
  messagesChannel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        const message = payload.new;
        const container = document.getElementById('messagesContainer');

        // Remove "no messages" placeholder if exists
        const noConv = container.querySelector('.no-conversation');
        if (noConv) {
          noConv.remove();
        }

        // Add new message
        container.appendChild(createMessageElement(message));
        scrollToBottom();
      }
    )
    .subscribe();
}

/**
 * Scroll messages to bottom
 */
function scrollToBottom() {
  const container = document.getElementById('messagesContainer');
  container.scrollTop = container.scrollHeight;
}

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
  if (messagesChannel) {
    supabase.removeChannel(messagesChannel);
  }
});

// Make handleLogout available globally
window.handleLogout = async function() {
  try {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Logout error:', error);
    alert('Failed to logout.');
  }
};
