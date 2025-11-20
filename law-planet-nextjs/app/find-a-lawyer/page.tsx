'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { LawyerWithProfile } from '@/lib/types';
import Link from 'next/link';
import { MapPin, Briefcase, GraduationCap, Phone, Eye } from 'lucide-react';

export default function FindLawyerPage() {
  const [lawyers, setLawyers] = useState<LawyerWithProfile[]>([]);
  const [filteredLawyers, setFilteredLawyers] = useState<LawyerWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const [filters, setFilters] = useState({
    district: '',
    courtLevel: '',
    specialization: '',
    experienceMin: '',
  });

  useEffect(() => {
    fetchLawyers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, lawyers]);

  const fetchLawyers = async () => {
    try {
      const { data, error } = await supabase
        .from('lawyer_details')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('is_active', true);

      if (error) throw error;
      setLawyers(data as any || []);
      setFilteredLawyers(data as any || []);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...lawyers];

    if (filters.district) {
      result = result.filter(l => l.district?.toLowerCase().includes(filters.district.toLowerCase()));
    }

    if (filters.courtLevel) {
      result = result.filter(l => l.court_level === filters.courtLevel);
    }

    if (filters.specialization) {
      result = result.filter(l => l.specialization?.toLowerCase().includes(filters.specialization.toLowerCase()));
    }

    if (filters.experienceMin) {
      const minExp = parseInt(filters.experienceMin);
      result = result.filter(l => l.experience_years >= minExp);
    }

    setFilteredLawyers(result);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Search for Lawyers</h1>
          <p className="text-xl text-blue-100">Find qualified legal professionals across India</p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <input
                type="text"
                placeholder="Enter district"
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Court Level</label>
              <select
                value={filters.courtLevel}
                onChange={(e) => handleFilterChange('courtLevel', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Courts</option>
                <option value="Supreme Court">Supreme Court</option>
                <option value="High Court">High Court</option>
                <option value="District Court">District Court</option>
                <option value="Tribunals">Tribunals</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Case Category</label>
              <input
                type="text"
                placeholder="e.g. Criminal, Civil"
                value={filters.specialization}
                onChange={(e) => handleFilterChange('specialization', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Experience (years)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.experienceMin}
                onChange={(e) => handleFilterChange('experienceMin', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-6 text-center">
            <button
              onClick={applyFilters}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading lawyers...</p>
            </div>
          ) : filteredLawyers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No lawyers found matching your criteria.</p>
              <button
                onClick={() => setFilters({ district: '', courtLevel: '', specialization: '', experienceMin: '' })}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-700 font-medium">
                Found {filteredLawyers.length} lawyer{filteredLawyers.length !== 1 ? 's' : ''}
              </p>
              {filteredLawyers.map((lawyer: any) => (
                <div
                  key={lawyer.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Photo */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold">
                        {lawyer.profile?.full_name?.charAt(0) || 'L'}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Adv. {lawyer.profile?.full_name}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                        {lawyer.court_level && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {lawyer.court_level}
                          </span>
                        )}
                        {lawyer.specialization && (
                          <span className="flex items-center gap-1">
                            •
                            {lawyer.specialization}
                          </span>
                        )}
                        {lawyer.experience_years !== undefined && (
                          <span className="flex items-center gap-1">
                            •
                            {lawyer.experience_years} yrs experience
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {lawyer.bio || 'Experienced legal professional ready to assist with your legal needs.'}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {lawyer.district && (
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {lawyer.district}, {lawyer.state}
                          </span>
                        )}
                        {lawyer.is_verified && (
                          <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/lawyers/${lawyer.id}`}
                        className="px-6 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors text-center flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </Link>
                      <Link
                        href={`/lawyers/${lawyer.id}?action=contact`}
                        className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-center flex items-center justify-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
