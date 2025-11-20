'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, Plus, Search, FileText, Image as ImageIcon, Video, File } from 'lucide-react';

export default function LegalAdvicePage() {
  const [chats, setChats] = useState<any[]>([]);
  const [currentChat, setCurrentChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (currentChat) {
      fetchMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    setUser(authUser);
  };

  const fetchChats = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('ai_chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    setChats(data || []);
  };

  const fetchMessages = async () => {
    if (!currentChat) return;
    const { data } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('chat_id', currentChat.id)
      .order('created_at', { ascending: true });

    setMessages(data || []);
  };

  const createNewChat = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('ai_chats')
      .insert({ user_id: user.id, title: 'New Chat' })
      .select()
      .single();

    if (!error && data) {
      setChats([data, ...chats]);
      setCurrentChat(data);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !currentChat || !user) return;

    setLoading(true);
    const userMessage = { role: 'user', content: input };

    // Add user message to UI immediately
    const tempMessages = [...messages, userMessage];
    setMessages(tempMessages);
    setInput('');

    try {
      // Save user message
      await supabase.from('ai_messages').insert({
        chat_id: currentChat.id,
        role: 'user',
        content: input,
      });

      // Call AI API
      const response = await fetch('/api/legal-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: currentChat.id,
          messages: [...tempMessages, userMessage],
        }),
      });

      const { message } = await response.json();

      // Save assistant message
      await supabase.from('ai_messages').insert({
        chat_id: currentChat.id,
        role: 'assistant',
        content: message,
      });

      // Refresh messages
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const promptTemplates = [
    'Saved Prompts Templates',
    'Media Type Selection',
    'Multilingual Support',
    'Case Law Summaries',
  ];

  const mediaTypes = ['All', 'Text', 'Image', 'Video', 'Document'];

  const sampleChats = [
    'What is the process for filing a consumer complaint?',
    'Steps to file an FIR in India',
    'How do I prepare for a legal consultation?',
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please login to use AI Legal Advisor
          </h2>
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-block"
          >
            Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for Chats..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat Sections */}
        <div className="flex-1 overflow-y-auto">
          {/* Chats */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Chats</h3>
            <div className="space-y-1">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setCurrentChat(chat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentChat?.id === chat.id
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>

          {/* Chat History */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Chat History</h3>
            <div className="space-y-1">
              {sampleChats.map((chat, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors line-clamp-2"
                >
                  {chat}
                </button>
              ))}
            </div>
          </div>

          {/* Pinned */}
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Pinned</h3>
            <div className="space-y-1">
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                How do I prepare for consultation?
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                What are my rights if...?
              </button>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Start new Chat
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Your Personal AI Advisor!
          </h1>
          <p className="text-center text-gray-600">
            Use one of the most common prompts below or type your own to begin
          </p>
        </header>

        {/* Prompt Templates */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-3 justify-center">
            {promptTemplates.map((template) => (
              <button
                key={template}
                className="px-6 py-2 bg-blue-50 text-blue-700 rounded-full font-medium hover:bg-blue-100 transition-colors text-sm"
              >
                {template}
              </button>
            ))}
          </div>
        </div>

        {/* Media Type Filter */}
        <div className="bg-gray-50 border-b border-gray-200 p-3">
          <div className="max-w-4xl mx-auto flex gap-3 items-center">
            <span className="text-sm text-gray-600 font-medium">Media Type:</span>
            {mediaTypes.map((type) => (
              <button
                key={type}
                className="px-3 py-1 text-sm rounded-lg bg-white border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 && !currentChat && (
              <div className="text-center py-20">
                <p className="text-gray-500 mb-4">Start a new chat to get legal advice</p>
                <button
                  onClick={createNewChat}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Chat
                </button>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-2xl rounded-2xl px-6 py-4 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 shadow-md border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-6 py-4 shadow-md border border-gray-200">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 items-center bg-gray-50 rounded-full border border-gray-300 px-6 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask whatever you want..."
                className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
