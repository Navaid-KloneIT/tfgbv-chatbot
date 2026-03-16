// app/api/user/history/route.js
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
    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode');
    const sessionId = searchParams.get('session_id');

    // If a specific session is requested, return all messages for that session
    if (sessionId) {
      const [messages] = await pool.execute(
        'SELECT * FROM chat_messages WHERE user_id = ? AND session_id = ? ORDER BY timestamp ASC',
        [decoded.id, sessionId]
      );
      return NextResponse.json({ success: true, messages });
    }

    // Otherwise, return sessions grouped by session_id
    let query = `
      SELECT session_id, mode,
        MIN(timestamp) as started_at,
        MAX(timestamp) as last_message_at,
        COUNT(*) as message_count
      FROM chat_messages
      WHERE user_id = ?
    `;
    const params = [decoded.id];

    if (mode && mode !== 'all') {
      query += ' AND mode = ?';
      params.push(mode);
    }

    query += ' GROUP BY session_id, mode ORDER BY last_message_at DESC LIMIT 50';

    const [sessions] = await pool.execute(query, params);

    return NextResponse.json({ success: true, sessions });
  } catch (error) {
    console.error('Error fetching user history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
