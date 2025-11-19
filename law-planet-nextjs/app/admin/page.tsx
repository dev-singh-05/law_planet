'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Users, Briefcase, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    totalLawyers: 0,
    totalBookings: 0,
    todayBookings: 0,
  });
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lawyers' | 'bookings' | 'news'>('lawyers');
  const supabase = createClient();

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/');
        return;
      }

      setUser(profile);
      fetchDashboardData();
    } catch (error) {
      console.error('Error checking admin access:', error);
      router.push('/');
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const { count: clientCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'client');

      const { count: lawyerCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'lawyer');

      const { count: bookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('scheduled_at', today)
        .lt('scheduled_at', `${today}T23:59:59`);

      setStats({
        totalClients: clientCount || 0,
        totalLawyers: lawyerCount || 0,
        totalBookings: bookingCount || 0,
        todayBookings: todayCount || 0,
      });

      // Fetch lawyers
      const { data: lawyersData } = await supabase
        .from('lawyer_details')
        .select('*, profile:profiles(*)')
        .order('created_at', { ascending: false });

      setLawyers(lawyersData || []);

      // Fetch bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*, client:client_id(full_name), lawyer:lawyer_id(full_name)')
        .order('created_at', { ascending: false })
        .limit(50);

      setBookings(bookingsData || []);

      // Fetch news
      const { data: newsData } = await supabase
        .from('news_articles')
        .select('*')
        .order('created_at', { ascending: false });

      setNews(newsData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLawyerStatus = async (lawyerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('lawyer_details')
        .update({ is_active: !currentStatus })
        .eq('id', lawyerId);

      if (error) throw error;

      fetchDashboardData();
    } catch (error: any) {
      alert('Error updating lawyer status: ' + error.message);
    }
  };

  const toggleLawyerVerification = async (lawyerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('lawyer_details')
        .update({ is_verified: !currentStatus })
        .eq('id', lawyerId);

      if (error) throw error;

      fetchDashboardData();
    } catch (error: any) {
      alert('Error updating verification status: ' + error.message);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      fetchDashboardData();
    } catch (error: any) {
      alert('Error updating booking status: ' + error.message);
    }
  };

  const deleteNews = async (newsId: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    try {
      const { error } = await supabase.from('news_articles').delete().eq('id', newsId);

      if (error) throw error;

      fetchDashboardData();
    } catch (error: any) {
      alert('Error deleting news: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-r from-red-600 to-red-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-red-100">Manage users, bookings, and content</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Clients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalClients}</p>
              </div>
              <Users className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Lawyers</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalLawyers}</p>
              </div>
              <Briefcase className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalBookings}</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Today's Bookings</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.todayBookings}</p>
              </div>
              <FileText className="w-12 h-12 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="border-b border-gray-200">
            <div className="flex gap-4 px-6 py-3">
              <button
                onClick={() => setActiveTab('lawyers')}
                className={`pb-3 px-4 font-medium transition-colors ${
                  activeTab === 'lawyers'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Lawyer Management
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`pb-3 px-4 font-medium transition-colors ${
                  activeTab === 'bookings'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`pb-3 px-4 font-medium transition-colors ${
                  activeTab === 'news'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                News Management
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Lawyers Tab */}
            {activeTab === 'lawyers' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        District
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Specialization
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Experience
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {lawyers.map((lawyer: any) => (
                      <tr key={lawyer.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {lawyer.profile?.full_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {lawyer.district || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {lawyer.specialization || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {lawyer.experience_years} yrs
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {lawyer.is_verified && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                Verified
                              </span>
                            )}
                            {lawyer.is_active && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                Active
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleLawyerVerification(lawyer.id, lawyer.is_verified)}
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              {lawyer.is_verified ? 'Unverify' : 'Verify'}
                            </button>
                            <button
                              onClick={() => toggleLawyerStatus(lawyer.id, lawyer.is_active)}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              {lawyer.is_active ? 'Deactivate' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Client
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Lawyer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Date/Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Mode
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.map((booking: any) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {booking.client?.full_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {booking.lawyer?.full_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(booking.scheduled_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{booking.mode}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
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
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* News Tab */}
            {activeTab === 'news' && (
              <div className="space-y-4">
                {news.map((article) => (
                  <div key={article.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{article.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{article.summary}</p>
                        <div className="flex gap-2 text-xs text-gray-500">
                          <span>{article.category}</span>
                          <span>•</span>
                          <span>{new Date(article.published_on).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteNews(article.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
