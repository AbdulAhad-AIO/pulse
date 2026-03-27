'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams } from 'next/navigation';
import { Heart, MessageCircle, Share2, Bookmark, Brain, Users } from 'lucide-react';
import Link from 'next/link';

export default function TrendDetailPage() {
  const { isSignedIn } = useUser();
  const params = useParams();
  const id = params.id as string;

  const [trend, setTrend] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [qa_threads, setQaThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'insights' | 'thoughts' | 'qa'>('insights');
  const [newThought, setNewThought] = useState('');
  const [thoughtType, setThoughtType] = useState('perspective');

  useEffect(() => {
    const fetchTrendDetails = async () => {
      try {
        const response = await fetch(`/api/trends/${id}`);
        const data = await response.json();
        setTrend(data.trend);
        setInsights(data.insights);
        setThoughts(data.thoughts || []);
        setQaThreads(data.qa_threads || []);
      } catch (error) {
        console.error('Error fetching trend details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendDetails();
  }, [id]);

  const handleCreateThought = async () => {
    if (!newThought.trim() || !isSignedIn) return;

    try {
      const response = await fetch('/api/thoughts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trend_id: id,
          content: newThought,
          type: thoughtType,
        }),
      });

      if (response.ok) {
        const thought = await response.json();
        setThoughts([thought, ...thoughts]);
        setNewThought('');
      }
    } catch (error) {
      console.error('Error creating thought:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-pulse animate-pulse">
          <div className="h-80 bg-gray-200 rounded-lg mb-8"></div>
        </div>
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-pulse text-center">
          <h1 className="text-2xl font-bold text-gray-900">Trend not found</h1>
          <Link href="/explore" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    health: 'bg-red-100 text-red-800',
    tech: 'bg-blue-100 text-blue-800',
    business: 'bg-green-100 text-green-800',
    home: 'bg-orange-100 text-orange-800',
    career: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-pulse">
        {/* Header */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
            <div className="flex-1">
              <span className={`badge ${categoryColors[trend.category]}`}>
                {trend.category}
              </span>
              <h1 className="text-4xl font-bold mt-4 mb-2">{trend.title}</h1>
              <p className="text-gray-600 text-lg mb-4">{trend.description}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <span>From: {trend.source === 'google_trends' ? 'Google Trends' : trend.source === 'reddit' ? 'Reddit' : 'News'}</span>
                <span>Score: {trend.trending_score}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="btn-icon">
                <Bookmark className="w-6 h-6" />
              </button>
              <button className="btn-icon">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          {trend.image_url && (
            <img
              src={trend.image_url}
              alt={trend.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
              {(['insights', 'thoughts', 'qa'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-2 border-b-2 transition-colors font-medium capitalize ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'insights' ? (
                    <>
                      <Brain className="inline mr-2 w-4 h-4" />
                      AI Insights
                    </>
                  ) : tab === 'thoughts' ? (
                    <>
                      <MessageCircle className="inline mr-2 w-4 h-4" />
                      Thoughts ({thoughts.length})
                    </>
                  ) : (
                    <>
                      <Users className="inline mr-2 w-4 h-4" />
                      Q&A ({qa_threads.length})
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Insights Tab */}
            {activeTab === 'insights' && insights && (
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
                <section>
                  <h2 className="text-2xl font-bold mb-4">Summary</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {insights.summary || 'AI summary loading...'}
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold mb-4">Why It's Happening</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {insights.why_happening || 'Analysis loading...'}
                  </p>
                </section>

                {insights.predictions && insights.predictions.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Future Predictions</h2>
                    <div className="space-y-3">
                      {insights.predictions.map((pred: any, i: number) => (
                        <div key={i} className="bg-blue-50 p-4 rounded-lg">
                          <p className="font-semibold text-gray-900">{pred.description}</p>
                          <div className="flex justify-between mt-2">
                            <span className="text-sm text-gray-600">
                              Probability: {Math.round(pred.probability * 100)}%
                            </span>
                            <span className="text-sm text-gray-600">{pred.timeframe}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {insights.actionable_steps && insights.actionable_steps.length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Actionable Steps</h2>
                    <ol className="space-y-2 list-decimal list-inside">
                      {insights.actionable_steps.map((step: string, i: number) => (
                        <li key={i} className="text-gray-700">{step}</li>
                      ))}
                    </ol>
                  </section>
                )}
              </div>
            )}

            {/* Thoughts Tab */}
            {activeTab === 'thoughts' && (
              <div className="space-y-6">
                {isSignedIn && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Share Your Thoughts</h3>
                    <textarea
                      value={newThought}
                      onChange={e => setNewThought(e.target.value)}
                      placeholder="Share your perspective, experience, solution, or warning..."
                      className="input-field mb-4"
                      rows={4}
                    />
                    <div className="flex gap-3">
                      <select
                        value={thoughtType}
                        onChange={e => setThoughtType(e.target.value)}
                        className="input-field"
                      >
                        <option value="perspective">Perspective</option>
                        <option value="experience">Experience</option>
                        <option value="solution">Solution</option>
                        <option value="warning">Warning</option>
                      </select>
                      <button
                        onClick={handleCreateThought}
                        className="btn-primary"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}

                {thoughts.map((thought: any) => (
                  <div key={thought.id} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{thought.user?.name || 'Anonymous'}</p>
                        <span className="badge badge-primary text-xs">{thought.type}</span>
                      </div>
                      <span className="text-sm text-gray-500">{new Date(thought.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 mb-4">{thought.content}</p>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <Heart className="w-4 h-4" />
                        {thought.upvotes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <MessageCircle className="w-4 h-4" />
                        Comment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Q&A Tab */}
            {activeTab === 'qa' && (
              <div className="space-y-6">
                {qa_threads.map((qa: any) => (
                  <div key={qa.id} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="mb-4">
                      <p className="font-semibold text-gray-900 mb-2">Q: {qa.question}</p>
                      <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">
                        <span className="font-semibold block mb-2">AI Answer:</span>
                        {qa.ai_answer}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Asked by {qa.user?.name || 'Anonymous'}</span>
                      <button className="flex items-center gap-1 hover:text-blue-600">
                        <Heart className="w-4 h-4" />
                        {qa.upvotes}
                      </button>
                    </div>
                  </div>
                ))}

                {isSignedIn && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h3 className="font-bold text-lg mb-4">Ask a Question</h3>
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        placeholder="Ask anything about this trend..."
                        className="input-field"
                      />
                      <button className="btn-primary">Ask</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-20">
              <h3 className="font-bold text-lg mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600 text-sm">Trending Score</p>
                  <p className="text-2xl font-bold text-blue-600">{trend.trending_score}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Community Thoughts</p>
                  <p className="text-2xl font-bold text-purple-600">{thoughts.length}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Q&A Threads</p>
                  <p className="text-2xl font-bold text-green-600">{qa_threads.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
