'use client';

import Link from 'next/link';
import { TrendingUp, MessageCircle } from 'lucide-react';
import { Trend } from '@/lib/types';

interface TrendCardProps {
  trend: Trend;
}

export default function TrendCard({ trend }: TrendCardProps) {
  const categoryColors: Record<string, string> = {
    health: 'bg-red-100 text-red-800',
    tech: 'bg-blue-100 text-blue-800',
    business: 'bg-green-100 text-green-800',
    home: 'bg-orange-100 text-orange-800',
    career: 'bg-purple-100 text-purple-800',
  };

  return (
    <Link href={`/trends/${trend.id}`}>
      <div className="card-hover h-full flex flex-col">
        {/* Image */}
        {trend.image_url && (
          <div className="w-full h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
            <img
              src={trend.image_url}
              alt={trend.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Category Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`badge ${categoryColors[trend.category]}`}>
            {trend.category.charAt(0).toUpperCase() + trend.category.slice(1)}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend.trending_score}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900">
          {trend.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
          {trend.description}
        </p>

        {/* Source */}
        <div className="text-xs text-gray-500 mb-4">
          From{' '}
          <span className="font-medium">
            {trend.source === 'google_trends'
              ? 'Google Trends'
              : trend.source === 'reddit'
              ? 'Reddit'
              : 'News'}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            View Insights
          </span>
          <span className="text-primary font-semibold text-sm">→</span>
        </div>
      </div>
    </Link>
  );
}
