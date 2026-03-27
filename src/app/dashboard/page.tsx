'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Bookmark, MessageSquare, Award, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [contributions, setContributions] = useState<any>(null);
  const [savedTrends, setSavedTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      redirect('/sign-in');
      setSavedTrends([]);
    }

    if (isSignedIn) {
      const fetchData = async () => {
        try {
          const [profileRes, contributionsRes] = await Promise.all([
            fetch('/api/profile'),
            fetch('/api/profile', {
              method: 'POST',
              body: JSON.stringify({ action: 'contributions' }),
            }),
          ]);

          if (profileRes.ok) {
            setProfile(await profileRes.json());
          }

          if (contributionsRes.ok) {
            setContributions(await contributionsRes.json());
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-pulse animate-pulse">
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-pulse">
        {/* Profile Header */}
        <div className="bg-white rounded-lg p-8 mb-8 shadow-sm flex gap-6 items-start">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
            {user?.firstName?.[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{user?.fullName || 'User'}</h1>
            <p className="text-gray-600 mb-4">{user?.primaryEmailAddress?.emailAddress}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Insight Score</p>
                <p className="text-2xl font-bold text-blue-600">{profile?.insight_score || 0}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Thoughts</p>
                <p className="text-2xl font-bold text-purple-600">{profile?.thought_count || 0}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Followers</p>
                <p className="text-2xl font-bold text-green-600">{profile?.follower_count || 0}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Following</p>
                <p className="text-2xl font-bold text-orange-600">{profile?.following_count || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs defaultValue="contributions">
            <TabsList className="border-b border-gray-200 px-6">
              <TabsTrigger value="contributions" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                My Contributions
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Bookmark className="w-4 h-4" />
                Saved Trends
              </TabsTrigger>
              <TabsTrigger value="badges" className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Badges
              </TabsTrigger>
            </TabsList>

            {/* Contributions Tab */}
            <TabsContent value="contributions" className="p-6">
              <div className="space-y-4">
                <h3 className="font-bold text-lg">My Thoughts</h3>
                {contributions?.thoughts && contributions.thoughts.length > 0 ? (
                  contributions.thoughts.map((thought: any) => (
                    <div key={thought.id} className="p-4 border border-gray-200 rounded-lg">
                      <p className="text-gray-900 mb-2">{thought.content}</p>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="badge badge-primary">{thought.type}</span>
                        <span>↑ {thought.upvotes} upvotes</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No thoughts yet. Share your insights!</p>
                )}
              </div>
            </TabsContent>

            {/* Saved Trends Tab */}
            <TabsContent value="saved" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedTrends.length > 0 ? (
                  savedTrends.map((engagement: any) => (
                    <Link key={engagement.trend_id} href={`/trends/${engagement.trend_id}`}>
                      <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                        <p className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {engagement.trends?.title}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <TrendingUp className="w-4 h-4" />
                          Score: {engagement.trends?.trending_score}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-gray-500">No saved trends yet.</p>
                )}
              </div>
            </TabsContent>

            {/* Badges Tab */}
            <TabsContent value="badges" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-yellow-300 rounded-lg bg-yellow-50">
                  <Award className="w-6 h-6 text-yellow-600 mb-2" />
                  <p className="font-semibold text-gray-900">7-Day Insight Streak</p>
                  <p className="text-sm text-gray-600">Earned 70+ Insight Score</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                  <Award className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="font-semibold text-gray-600">30-Day Insight Streak</p>
                  <p className="text-sm text-gray-500">Locked - Earn 300+ points</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg opacity-50">
                  <Award className="w-6 h-6 text-gray-400 mb-2" />
                  <p className="font-semibold text-gray-600">Top Contributor</p>
                  <p className="text-sm text-gray-500">Locked - Post 5+ thoughts</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
