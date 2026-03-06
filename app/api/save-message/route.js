// app/api/save-message/route.js
import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const { sessionId, mode, role, content, environment } = await req.json();

    if (!sessionId || !mode || !role || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const env = environment || process.env.ENV || 'production';
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await pool.execute(
      'INSERT INTO chat_messages (id, session_id, mode, role, content, environment, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, sessionId, mode, role, content, env, timestamp]
    );

    return NextResponse.json({
      success: true,
      data: [{ id, session_id: sessionId, mode, role, content, environment: env, timestamp }]
    });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
