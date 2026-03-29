import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Check if trends table exists
    const { data: tableData, error: tableError } = await supabaseAdmin
      .from('trends')
      .select('*', { count: 'exact', head: true });

    if (tableError) {
      return NextResponse.json({
        status: 'error',
        message: `Tables error: ${tableError.message}`,
      }, { status: 400 });
    }

    // Try to insert a single test record
    const testTrend = {
      title: 'Test Trend: Technology Advances Today',
      description: 'Testing database connection and insertion',
      category: 'tech',
      source: 'test',
      trending_score: 50,
    };

    const { data: insertData, error: insertError } = await supabaseAdmin
      .from('trends')
      .insert([testTrend])
      .select();

    if (insertError) {
      return NextResponse.json({
        status: 'insert_error',
        message: `Insert error: ${insertError.message}`,
        code: insertError.code,
      }, { status: 400 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Database is working! Test record inserted.',
      inserted: insertData?.length || 0,
    });
  } catch (err: any) {
    return NextResponse.json({
      status: 'exception',
      message: err.message,
      stack: err.stack,
    }, { status: 500 });
  }
}
