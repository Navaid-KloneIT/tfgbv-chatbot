// app/api/test-supabase/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        supabaseUrl: supabaseUrl ? 'Set' : 'Missing',
        supabaseAnonKey: supabaseAnonKey ? 'Set' : 'Missing'
      });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Test connection by querying admin_users
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .limit(5);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        hint: 'Make sure you ran the SQL schema in Supabase SQL Editor'
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection working!',
      adminUsersFound: data.length,
      users: data
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}
