// app/api/admin/messages/route.js
import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export async function GET(req) {
  try {
    // Verify JWT token
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');
    const environment = searchParams.get('environment') || process.env.ENV || 'production';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = 'SELECT * FROM chat_messages WHERE environment = ?';
    let countQuery = 'SELECT COUNT(*) as total FROM chat_messages WHERE environment = ?';
    const params = [environment];

    if (mode && mode !== 'all') {
      query += ' AND mode = ?';
      countQuery += ' AND mode = ?';
      params.push(mode);
    }

    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';

    // Execute both queries
    const [rows] = await pool.execute(query, [...params, String(limit), String(offset)]);
    const [countRows] = await pool.execute(countQuery, params);

    return NextResponse.json({
      success: true,
      messages: rows,
      total: countRows[0].total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
