import { supabase, supabaseAdmin } from './supabase';
import { Trend, User } from './types';

// Trend operations
export async function saveTrends(trends: any[]) {
  try {
    const { data, error } = await supabaseAdmin.from('trends').insert(
      trends.map(t => ({
        title: t.title,
        description: t.description,
        category: t.category,
        source: t.source,
        trending_score: t.trending_score,
        image_url: t.image_url,
        search_volume: t.search_volume,
      }))
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving trends:', error);
    throw error;
  }
}

export async function getTrendById(id: string) {
  try {
    const { data, error } = await supabase.from('trends').select('*').eq('id', id).single();

    if (error) throw error;
    return data as Trend;
  } catch (error) {
    console.error('Error fetching trend:', error);
    throw error;
  }
}

export async function getTrendsByCategory(category: string, limit = 20) {
  try {
    const { data, error } = await supabase
      .from('trends')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Trend[];
  } catch (error) {
    console.error('Error fetching trends by category:', error);
    throw error;
  }
}

export async function getAllTrends(limit = 50) {
  try {
    const { data, error } = await supabase
      .from('trends')
      .select('*')
      .order('trending_score', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as Trend[];
  } catch (error) {
    console.error('Error fetching all trends:', error);
    throw error;
  }
}

// Thought operations
export async function createThought(trend_id: string, user_id: string, content: string, type: string) {
  try {
    const { data, error } = await supabase.from('thoughts').insert({
      trend_id,
      user_id,
      content,
      type,
      upvotes: 0,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating thought:', error);
    throw error;
  }
}

export async function getThoughtsByTrend(trend_id: string) {
  try {
    const { data, error } = await supabase
      .from('thoughts')
      .select(`*, users(*)`)
      .eq('trend_id', trend_id)
      .order('upvotes', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    throw error;
  }
}

export async function upvoteThought(thought_id: string) {
  try {
    const { data: thought } = await supabase
      .from('thoughts')
      .select('upvotes')
      .eq('id', thought_id)
      .single();

    const newUpvotes = (thought?.upvotes || 0) + 1;

    const { data, error } = await supabase
      .from('thoughts')
      .update({ upvotes: newUpvotes })
      .eq('id', thought_id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error upvoting thought:', error);
    throw error;
  }
}

// Comment operations
export async function createComment(thought_id: string, user_id: string, content: string) {
  try {
    const { data, error } = await supabase.from('comments').insert({
      thought_id,
      user_id,
      content,
      upvotes: 0,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

export async function getCommentsByThought(thought_id: string) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`*, users(*)`)
      .eq('thought_id', thought_id)
      .order('upvotes', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}

export async function upvoteComment(comment_id: string) {
  try {
    const { data: comment } = await supabase
      .from('comments')
      .select('upvotes')
      .eq('id', comment_id)
      .single();

    const newUpvotes = (comment?.upvotes || 0) + 1;

    const { data, error } = await supabase
      .from('comments')
      .update({ upvotes: newUpvotes })
      .eq('id', comment_id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error upvoting comment:', error);
    throw error;
  }
}

// User engagement operations
export async function saveTrend(user_id: string, trend_id: string) {
  try {
    const { data, error } = await supabase.from('user_engagement').upsert(
      {
        user_id,
        trend_id,
        saved: true,
      },
      { onConflict: 'user_id,trend_id' }
    );

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving trend:', error);
    throw error;
  }
}

export async function removeSavedTrend(user_id: string, trend_id: string) {
  try {
    const { data, error } = await supabase
      .from('user_engagement')
      .update({ saved: false })
      .eq('user_id', user_id)
      .eq('trend_id', trend_id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error removing saved trend:', error);
    throw error;
  }
}

export async function getSavedTrends(user_id: string) {
  try {
    const { data, error } = await supabase
      .from('user_engagement')
      .select('*, trends(*)')
      .eq('user_id', user_id)
      .eq('saved', true);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching saved trends:', error);
    throw error;
  }
}

// User operations
export async function getUserProfile(user_id: string) {
  try {
    const { data, error } = await supabase.from('users').select('*').eq('id', user_id).single();

    if (error) throw error;
    return data as User;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(user_id: string, updates: Partial<User>) {
  try {
    const { data, error } = await supabase.from('users').update(updates).eq('id', user_id);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export async function getUserContributions(user_id: string) {
  try {
    const [thoughts, comments] = await Promise.all([
      supabase.from('thoughts').select('*').eq('user_id', user_id),
      supabase.from('comments').select('*').eq('user_id', user_id),
    ]);

    return {
      thoughts: thoughts.data || [],
      comments: comments.data || [],
    };
  } catch (error) {
    console.error('Error fetching user contributions:', error);
    throw error;
  }
}
