'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Zap, Users, Brain, TrendingUp, ArrowRight } from 'lucide-react';
import TrendCard from '@/components/trends/TrendCard';

export default function Home() {
  const { isSignedIn } = useUser();
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch('/api/trends');
        const data = await response.json();
        setTrends(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container-pulse">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Stay Ahead of <span className="text-gradient">Trends</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Real-time trending insights powered by AI, with insights from a community of informed users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={isSignedIn ? '/explore' : '/sign-up'}
                className="btn-primary text-lg px-8 py-3"
              >
                Get Started {isSignedIn ? '' : 'Free'}
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/explore"
                className="btn-secondary text-lg px-8 py-3"
              >
                Explore Trends
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-pulse">
          <h2 className="text-4xl font-bold mb-12 text-center">Why The Pulse?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Analysis',
                description: 'Automatic summaries, predictions, and persona-based insights for every trend',
              },
              {
                icon: Users,
                title: 'Community Insights',
                description: 'Learn from real experiences and perspectives of other users',
              },
              {
                icon: Zap,
                title: 'Real-Time Updates',
                description: 'Get trending data from Google, Reddit, and news every 2 hours',
              },
              {
                icon: TrendingUp,
                title: 'Actionable Steps',
                description: 'Get personalized recommendations for different roles and situations',
              },
            ].map((feature, i) => (
              <div key={i} className="card hover:shadow-md transition-shadow">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Now Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-pulse">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Trending Now</h2>
            <Link href="/explore" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse h-64 bg-gray-200"></div>
              ))}
            </div>
          ) : trends.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trends.map((trend: any) => (
                <TrendCard key={trend.id} trend={trend} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No trends available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container-pulse text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Informed, Stay Ahead</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community and get personalized trend insights delivered to your inbox
          </p>
          {!isSignedIn && (
            <Link href="/sign-up" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Free Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
