'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import TrendCard from '@/components/trends/TrendCard';
import { Filter } from 'lucide-react';

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory);

  const categories = ['health', 'tech', 'business', 'home', 'career'];

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const url = category
          ? `/api/trends?category=${category}`
          : '/api/trends';
        const response = await fetch(url);
        const data = await response.json();
        setTrends(data);
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, [category]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-pulse">
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4">Explore Trends</h1>
          <p className="text-xl text-gray-600">
            Discover what's trending across different categories
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Category:</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setCategory('')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                category === ''
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  category === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Trends Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse h-80 bg-gray-200"></div>
            ))}
          </div>
        ) : trends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trends.map((trend: any) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">
              No trends found for this category. Try another!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
