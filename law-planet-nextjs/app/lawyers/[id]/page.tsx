'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { MapPin, Phone, Mail, GraduationCap, Briefcase, Award, Calendar, X } from 'lucide-react';

export default function LawyerProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [lawyer, setLawyer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    scheduled_at: '',
    mode: 'online',
    case_category: '',
    notes: '',
  });
  const supabase = createClient();

  useEffect(() => {
    fetchLawyer();
  }, [params.id]);

  const fetchLawyer = async () => {
    try {
      const { data, error } = await supabase
        .from('lawyer_details')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setLawyer(data);
    } catch (error) {
      console.error('Error fetching lawyer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const { error } = await supabase.from('bookings').insert({
        client_id: user.id,
        lawyer_id: params.id as string,
        ...bookingData,
      });

      if (error) throw error;

      alert('Booking request sent successfully!');
      setShowBookingModal(false);
      setBookingData({ scheduled_at: '', mode: 'online', case_category: '', notes: '' });
    } catch (error: any) {
      alert('Error creating booking: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lawyer not found</h2>
        <button onClick={() => router.back()} className="text-blue-600 hover:text-blue-700">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center text-blue-600 text-4xl font-bold shadow-lg">
              {lawyer.profile?.full_name?.charAt(0) || 'L'}
            </div>
            <div className="text-white flex-1">
              <h1 className="text-4xl font-bold mb-2">Adv. {lawyer.profile?.full_name}</h1>
              <div className="flex flex-wrap gap-3 text-blue-100">
                {lawyer.court_level && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {lawyer.court_level}
                  </span>
                )}
                {lawyer.specialization && (
                  <span>• {lawyer.specialization}</span>
                )}
                {lawyer.experience_years !== undefined && (
                  <span>• {lawyer.experience_years} years experience</span>
                )}
              </div>
              {lawyer.is_verified && (
                <span className="inline-block mt-3 px-3 py-1 bg-green-500 text-white rounded-full text-sm font-medium">
                  ✓ Verified Lawyer
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {lawyer.bio || 'Experienced legal professional ready to assist with your legal needs.'}
              </p>
            </div>

            {/* Education & Qualifications */}
            {lawyer.education && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6" />
                  Education & Qualifications
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{lawyer.education}</p>
              </div>
            )}

            {/* Languages */}
            {lawyer.languages && lawyer.languages.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {lawyer.languages.map((lang: string) => (
                    <span key={lang} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Booking */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-sm">
                {lawyer.bar_council_id && (
                  <div className="flex items-start gap-2">
                    <Award className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Bar Council ID</p>
                      <p className="font-medium text-gray-900">{lawyer.bar_council_id}</p>
                    </div>
                  </div>
                )}
                {lawyer.district && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">
                        {lawyer.district}, {lawyer.state}
                      </p>
                    </div>
                  </div>
                )}
                {lawyer.profile?.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{lawyer.profile.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Book Consultation */}
            <div className="bg-blue-50 rounded-xl shadow-md p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Book a Consultation</h3>
              <p className="text-gray-600 text-sm mb-4">
                Schedule a consultation to discuss your legal needs
              </p>
              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Book Consultation</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={bookingData.scheduled_at}
                  onChange={(e) => setBookingData({ ...bookingData, scheduled_at: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mode</label>
                <select
                  value={bookingData.mode}
                  onChange={(e) => setBookingData({ ...bookingData, mode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="online">Online</option>
                  <option value="offline">In-Person</option>
                  <option value="phone">Phone Call</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Case Category
                </label>
                <input
                  type="text"
                  value={bookingData.case_category}
                  onChange={(e) => setBookingData({ ...bookingData, case_category: e.target.value })}
                  placeholder="e.g., Criminal, Civil, Family"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                  placeholder="Brief description of your case..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
