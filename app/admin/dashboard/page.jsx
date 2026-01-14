"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MessageCircle, FileText, AlertCircle, Shield, RefreshCw, User, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState('all');
  const [adminEmail, setAdminEmail] = useState('');
  const [total, setTotal] = useState(0);
  const [currentEnvironment, setCurrentEnvironment] = useState('production');
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Detect environment from browser (NEXT_PUBLIC_ENV is available in browser)
    const env = process.env.NEXT_PUBLIC_ENV || 'production';
    setCurrentEnvironment(env);
    setAdminEmail(email || '');
    fetchMessages(token, 'all', env);
  }, [router]);

  const fetchMessages = async (token, mode = 'all', env = null) => {
    setLoading(true);
    const environment = env || currentEnvironment;

    try {
      const queryParams = new URLSearchParams({
        mode: mode,
        environment: environment,
        limit: '1000'
      });

      const response = await fetch(`/api/admin/messages?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminEmail');
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch messages');
      }

      const data = await response.json();
      const messages = data.messages || [];
      setTotal(data.total || 0);

      // Group messages by session
      const groupedSessions = messages.reduce((acc, msg) => {
        if (!acc[msg.session_id]) {
          acc[msg.session_id] = {
            sessionId: msg.session_id,
            mode: msg.mode,
            messages: [],
            lastActivity: msg.timestamp
          };
        }
        acc[msg.session_id].messages.push(msg);

        // Update last activity if this message is more recent
        if (new Date(msg.timestamp) > new Date(acc[msg.session_id].lastActivity)) {
          acc[msg.session_id].lastActivity = msg.timestamp;
        }

        return acc;
      }, {});

      // Convert to array and sort by last activity
      const sessionArray = Object.values(groupedSessions).sort(
        (a, b) => new Date(b.lastActivity) - new Date(a.lastActivity)
      );

      setSessions(sessionArray);

      // Auto-select first session if none selected
      if (!selectedSession && sessionArray.length > 0) {
        setSelectedSession(sessionArray[0]);
      } else if (selectedSession) {
        // Update selected session with new data
        const updatedSession = sessionArray.find(s => s.sessionId === selectedSession.sessionId);
        if (updatedSession) {
          setSelectedSession(updatedSession);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeFilter = (mode) => {
    setSelectedMode(mode);
    const token = localStorage.getItem('adminToken');
    fetchMessages(token, mode);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    router.push('/admin/login');
  };

  const handleRefresh = () => {
    const token = localStorage.getItem('adminToken');
    fetchMessages(token, selectedMode);
  };

  const handleSelectSession = (session) => {
    setSelectedSession(session);
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'support':
        return <MessageCircle size={16} className="text-blue-500" />;
      case 'analyzer':
        return <FileText size={16} className="text-green-500" />;
      case 'bias-detector':
        return <AlertCircle size={16} className="text-yellow-500" />;
      case 'feminist-lens':
        return <Shield size={16} className="text-purple-500" />;
      case 'rewrite-engine':
        return <FileText size={16} className="text-pink-500" />;
      default:
        return <MessageCircle size={16} />;
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'support':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'analyzer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'bias-detector':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'feminist-lens':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rewrite-engine':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img src="/uks-logo.jpg" alt="Uks Logo" className="h-12 w-12" />
              <div>
                <h1 className="text-2xl font-bold text-secondary">Admin Dashboard</h1>
                <p className="text-sm text-primary">
                  Environment: <span className="font-semibold capitalize">{currentEnvironment}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-primary">
                <User size={20} />
                <span className="text-sm hidden sm:inline">{adminEmail}</span>
              </div>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <RefreshCw size={18} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleModeFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMode === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-primary hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleModeFilter('support')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMode === 'support'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-primary hover:bg-gray-300'
              }`}
            >
              Support
            </button>
            <button
              onClick={() => handleModeFilter('analyzer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMode === 'analyzer'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-primary hover:bg-gray-300'
              }`}
            >
              Analyzer
            </button>
            <button
              onClick={() => handleModeFilter('bias-detector')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMode === 'bias-detector'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-primary hover:bg-gray-300'
              }`}
            >
              Bias Detector
            </button>
            <button
              onClick={() => handleModeFilter('feminist-lens')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMode === 'feminist-lens'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-primary hover:bg-gray-300'
              }`}
            >
              Feminist Lens
            </button>
            <button
              onClick={() => handleModeFilter('rewrite-engine')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedMode === 'rewrite-engine'
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-primary hover:bg-gray-300'
              }`}
            >
              Rewrite Engine
            </button>
          </div>
          <div className="text-sm text-gray-600">
            <strong>{total}</strong> total messages
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {loading ? (
          <div className="flex-1 flex justify-center items-center">
            <RefreshCw className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <>
            {/* Left Column - Sessions List */}
            <div className="w-80 bg-white border-r overflow-y-auto">
              <div className="p-4 border-b bg-gray-50">
                <h2 className="font-semibold text-secondary">
                  Sessions ({sessions.length})
                </h2>
              </div>

              {sessions.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-500">No sessions found</p>
                  <p className="text-gray-400 text-sm mt-2">Try changing the mode filter</p>
                </div>
              ) : (
                <div className="divide-y">
                  {sessions.map((session) => (
                    <div
                      key={session.sessionId}
                      onClick={() => handleSelectSession(session)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedSession?.sessionId === session.sessionId
                          ? 'bg-primary/5 border-l-4 border-primary'
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 border ${getModeColor(session.mode)}`}>
                          {getModeIcon(session.mode)}
                          <span className="capitalize">{session.mode.replace('-', ' ')}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {session.messages.length} msgs
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 truncate mb-1">
                        ID: {session.sessionId.slice(0, 8)}...
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{new Date(session.lastActivity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Chat History */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
              {selectedSession ? (
                <div className="max-w-4xl mx-auto p-6">
                  {/* Session Header */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-secondary mb-2">Session Details</h2>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>Session ID:</strong> {selectedSession.sessionId}</p>
                          <p><strong>Mode:</strong> <span className="capitalize">{selectedSession.mode.replace('-', ' ')}</span></p>
                          <p><strong>Messages:</strong> {selectedSession.messages.length}</p>
                          <p><strong>Last Activity:</strong> {new Date(selectedSession.lastActivity).toLocaleString()}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-lg text-sm font-medium border ${getModeColor(selectedSession.mode)}`}>
                        {getModeIcon(selectedSession.mode)}
                        <span className="ml-2 capitalize">{selectedSession.mode.replace('-', ' ')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="space-y-4">
                    {selectedSession.messages
                      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                      .map((msg) => (
                        <div
                          key={msg.id}
                          className={`${
                            msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[85%] rounded-lg shadow-md p-4 ${
                              msg.role === 'user'
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-semibold opacity-80">
                                {msg.role === 'user' ? 'User' : 'Assistant'}
                              </span>
                              <span className="text-xs opacity-70">
                                {new Date(msg.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="text-sm whitespace-pre-wrap break-words">
                              {msg.content.length > 1000
                                ? msg.content.substring(0, 1000) + '...'
                                : msg.content}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="mx-auto mb-4 text-gray-400" size={64} />
                    <p className="text-gray-500 text-lg">Select a session to view chat history</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
