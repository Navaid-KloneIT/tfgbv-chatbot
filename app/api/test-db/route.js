// app/api/test-db/route.js
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    // Test connection by querying admin_users
    const [rows] = await pool.execute('SELECT email FROM admin_users LIMIT 5');

    return NextResponse.json({
      success: true,
      message: 'MySQL connection working!',
      adminUsersFound: rows.length,
      users: rows
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      hint: 'Make sure MySQL is running in XAMPP and the tfgbv database exists with the schema applied'
    });
  }
}
