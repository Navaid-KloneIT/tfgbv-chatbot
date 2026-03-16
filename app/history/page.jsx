"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, FileText, AlertCircle, Shield, ArrowLeft, Clock, Filter, ChevronRight, LogOut } from 'lucide-react';

const modeLabels = {
  support: 'Support Chat',
  analyzer: 'Content Analyzer',
  'bias-detector': 'Bias Detector',
  'feminist-lens': 'Feminist Lens',
  'rewrite-engine': 'Rewrite Engine',
};

const modeColors = {
  support: 'bg-blue-100 text-blue-700',
  analyzer: 'bg-purple-100 text-purple-700',
  'bias-detector': 'bg-green-100 text-green-700',
  'feminist-lens': 'bg-pink-100 text-pink-700',
  'rewrite-engine': 'bg-orange-100 text-orange-700',
};

const formatMessageContent = (content) => {
  if (!content) return content;
  let formatted = content
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/^[\-\*] (.+)$/gm, '<li class="ml-4">$1</li>')
    .replace(/(<li.*?<\/li>\n?)+/g, '<ul class="list-disc ml-6 my-2">$&</ul>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
  return formatted;
};

export default function ChatHistory() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [modeFilter, setModeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const name = localStorage.getItem('userName');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    setUserName(name || '');
    fetchSessions(token);
  }, [router]);

  const fetchSessions = async (token, mode = 'all') => {
    setLoading(true);
    try {
      const url = `/api/user/history?mode=${mode}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('userToken');
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
    setLoading(false);
  };

  const fetchSessionMessages = async (sessionId) => {
    setMessagesLoading(true);
    setSelectedSession(sessionId);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`/api/user/history?session_id=${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
    setMessagesLoading(false);
  };

  const handleModeFilter = (mode) => {
    setModeFilter(mode);
    setSelectedSession(null);
    setMessages([]);
    const token = localStorage.getItem('userToken');
    fetchSessions(token, mode);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/20">
      {/* Header */}
      <div className="bg-white shadow-md px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/')}
              className="text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-secondary">Chat History</h1>
              <p className="text-sm text-primary">Welcome, {userName}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            <span className="hidden sm:inline text-sm">Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Mode Filter */}
        <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
          <Filter size={18} className="text-primary flex-shrink-0" />
          {['all', 'support', 'analyzer', 'bias-detector', 'feminist-lens', 'rewrite-engine'].map((m) => (
            <button
              key={m}
              onClick={() => handleModeFilter(m)}
              className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                modeFilter === m
                  ? 'bg-primary text-white'
                  : 'bg-white text-primary border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {m === 'all' ? 'All Modes' : modeLabels[m]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-secondary">Sessions</h2>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                {loading ? (
                  <div className="p-8 text-center text-gray-500">Loading sessions...</div>
                ) : sessions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <MessageCircle size={40} className="mx-auto mb-3 text-gray-300" />
                    <p>No chat history found</p>
                    <p className="text-xs mt-1">Start chatting to see your history here</p>
                  </div>
                ) : (
                  sessions.map((session) => (
                    <button
                      key={session.session_id}
                      onClick={() => fetchSessionMessages(session.session_id)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        selectedSession === session.session_id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${modeColors[session.mode]}`}>
                          {modeLabels[session.mode]}
                        </span>
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                      <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{new Date(session.started_at).toLocaleDateString()}</span>
                        <span>&middot;</span>
                        <span>{session.message_count} messages</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Messages View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="font-semibold text-secondary">
                  {selectedSession ? 'Conversation' : 'Select a session'}
                </h2>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
                {!selectedSession ? (
                  <div className="p-8 text-center text-gray-500">
                    <FileText size={40} className="mx-auto mb-3 text-gray-300" />
                    <p>Select a session from the left to view messages</p>
                  </div>
                ) : messagesLoading ? (
                  <div className="p-8 text-center text-gray-500">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No messages in this session</div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-lg shadow-sm ${
                          msg.role === 'user'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-primary'
                        }`}
                      >
                        <div
                          className="text-sm"
                          dangerouslySetInnerHTML={{
                            __html: formatMessageContent(msg.content),
                          }}
                        />
                        <p className="text-xs mt-2 opacity-70">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
