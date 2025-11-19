'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User, Camera, Save, Lock, Calendar, Clock, MapPin, FileText } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [lawyerDetails, setLawyerDetails] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  const [lawyerForm, setLawyerForm] = useState({
    court_level: '',
    specialization: '',
    experience_years: 0,
    education: '',
    district: '',
    state: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const supabase = createClient();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/login');
        return;
      }

      setUser(authUser);

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      setProfile(profileData);
      setFormData({
        full_name: profileData?.full_name || '',
        phone: profileData?.phone || '',
      });

      // If lawyer, fetch lawyer details
      if (profileData?.role === 'lawyer') {
        const { data: lawyerData } = await supabase
          .from('lawyer_details')
          .select('*')
          .eq('id', authUser.id)
          .single();

        setLawyerDetails(lawyerData);
        if (lawyerData) {
          setLawyerForm({
            court_level: lawyerData.court_level || '',
            specialization: lawyerData.specialization || '',
            experience_years: lawyerData.experience_years || 0,
            education: lawyerData.education || '',
            district: lawyerData.district || '',
            state: lawyerData.state || '',
          });
        }
      }

      // Fetch bookings
      fetchBookings(authUser.id, profileData?.role);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (userId: string, role: string) => {
    try {
      const query = role === 'lawyer'
        ? supabase
            .from('bookings')
            .select('*, client:client_id(full_name), lawyer:lawyer_id(full_name)')
            .eq('lawyer_id', userId)
        : supabase
            .from('bookings')
            .select('*, client:client_id(full_name), lawyer:lawyer_id(full_name)')
            .eq('client_id', userId);

      const { data } = await query.order('scheduled_at', { ascending: false });
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const updateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user.id);

      if (error) throw error;

      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Error updating profile: ' + error.message);
    }
  };

  const updateLawyerDetails = async () => {
    try {
      const { error } = await supabase
        .from('lawyer_details')
        .upsert({
          id: user.id,
          ...lawyerForm,
        });

      if (error) throw error;

      setMessage('Lawyer details updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Error updating lawyer details: ' + error.message);
    }
  };

  const updatePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword,
      });

      if (error) throw error;

      setMessage('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setMessage('Error updating password: ' + error.message);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed'
  );
  const pastBookings = bookings.filter(
    (b) => b.status === 'completed' || b.status === 'cancelled'
  );

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-blue-100">Manage your account and preferences</p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {message && (
          <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4">
                {profile?.full_name?.charAt(0) || 'U'}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{profile?.full_name}</h2>
              <span className="inline-block px-3 py-1 mt-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {profile?.role === 'client' ? 'Client' : profile?.role === 'lawyer' ? 'Lawyer' : 'Admin'}
              </span>
            </div>
          </div>

          {/* Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={updateProfile}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>

            {/* Lawyer Details (only for lawyers) */}
            {profile?.role === 'lawyer' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Lawyer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Court Level
                    </label>
                    <select
                      value={lawyerForm.court_level}
                      onChange={(e) => setLawyerForm({ ...lawyerForm, court_level: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Court</option>
                      <option value="Supreme Court">Supreme Court</option>
                      <option value="High Court">High Court</option>
                      <option value="District Court">District Court</option>
                      <option value="Tribunals">Tribunals</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specialization
                    </label>
                    <input
                      type="text"
                      value={lawyerForm.specialization}
                      onChange={(e) => setLawyerForm({ ...lawyerForm, specialization: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={lawyerForm.experience_years}
                      onChange={(e) => setLawyerForm({ ...lawyerForm, experience_years: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      District
                    </label>
                    <input
                      type="text"
                      value={lawyerForm.district}
                      onChange={(e) => setLawyerForm({ ...lawyerForm, district: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={lawyerForm.state}
                      onChange={(e) => setLawyerForm({ ...lawyerForm, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Education Qualifications
                    </label>
                    <textarea
                      value={lawyerForm.education}
                      onChange={(e) => setLawyerForm({ ...lawyerForm, education: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={updateLawyerDetails}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Lawyer Details
                </button>
              </div>
            )}

            {/* Update Password */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Update Password
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={updatePassword}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* My Bookings */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h2>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              History ({pastBookings.length})
            </button>
          </div>

          {/* Bookings List */}
          {displayedBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">No {activeTab} bookings</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedBookings.map((booking: any) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900">
                          {profile?.role === 'lawyer'
                            ? booking.client?.full_name
                            : booking.lawyer?.full_name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : booking.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(booking.scheduled_at).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(booking.scheduled_at).toLocaleTimeString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {booking.mode}
                        </div>
                        {booking.case_category && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {booking.case_category}
                          </div>
                        )}
                      </div>
                      {booking.notes && (
                        <p className="mt-2 text-sm text-gray-600 italic">
                          Note: {booking.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
