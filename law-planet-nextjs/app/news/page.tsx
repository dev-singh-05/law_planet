'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { NewsArticle } from '@/lib/types';
import { Calendar, Tag, Search } from 'lucide-react';

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const supabase = createClient();

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, dateFilter, articles]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_on', { ascending: false });

      if (error) throw error;
      setArticles(data || []);
      setFilteredArticles(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...articles];

    if (searchTerm) {
      result = result.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      result = result.filter((article) => article.published_on === dateFilter);
    }

    setFilteredArticles(result);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Legal News & Updates
          </h1>
          <p className="text-xl text-blue-100">
            Stay updated with the latest judiciary news and legal developments
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search news by keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-64">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={applyFilters}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* News Articles */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading news...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No news articles found.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('');
                }}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-600"
                >
                  <div className="flex items-start gap-4">
                    {/* Tag Badge */}
                    {article.tag && (
                      <div className="flex-shrink-0">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-lg transform -rotate-90 origin-center whitespace-nowrap">
                          {article.tag}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.published_on)}
                        </span>
                        {article.category && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              {article.category}
                            </span>
                          </>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        {article.title}
                      </h2>

                      <p className="text-gray-700 leading-relaxed mb-4">
                        {article.summary}
                      </p>

                      <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                        Read Full Article →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
