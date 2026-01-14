"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, MessageCircle, FileText, AlertCircle, Shield, RefreshCw, User, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState('all');
  const [environment, setEnvironment] = useState('production');
  const [adminEmail, setAdminEmail] = useState('');
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    const email = localStorage.getItem('adminEmail');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    setAdminEmail(email || '');
    fetchMessages(token);
  }, [router]);

  const fetchMessages = async (token, mode = 'all', env = 'production') => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        mode: mode,
        environment: env,
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
      setMessages(data.messages || []);
      setFilteredMessages(data.messages || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeFilter = (mode) => {
    setSelectedMode(mode);
    const token = localStorage.getItem('adminToken');
    fetchMessages(token, mode, environment);
  };

  const handleEnvironmentChange = (env) => {
    setEnvironment(env);
    const token = localStorage.getItem('adminToken');
    fetchMessages(token, selectedMode, env);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    router.push('/admin/login');
  };

  const handleRefresh = () => {
    const token = localStorage.getItem('adminToken');
    fetchMessages(token, selectedMode, environment);
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
        return 'bg-blue-100 text-blue-800';
      case 'analyzer':
        return 'bg-green-100 text-green-800';
      case 'bias-detector':
        return 'bg-yellow-100 text-yellow-800';
      case 'feminist-lens':
        return 'bg-purple-100 text-purple-800';
      case 'rewrite-engine':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Group messages by session
  const groupedMessages = filteredMessages.reduce((acc, msg) => {
    if (!acc[msg.session_id]) {
      acc[msg.session_id] = [];
    }
    acc[msg.session_id].push(msg);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img src="/uks-logo.jpg" alt="Uks Logo" className="h-12 w-12" />
              <div>
                <h1 className="text-2xl font-bold text-secondary">Admin Dashboard</h1>
                <p className="text-sm text-primary">Chat History Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-primary">
                <User size={20} />
                <span className="text-sm">{adminEmail}</span>
              </div>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              >
                <RefreshCw size={18} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-secondary mb-4">Filters</h2>

          {/* Environment Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-secondary mb-2">Environment</label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEnvironmentChange('development')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  environment === 'development'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-primary hover:bg-gray-300'
                }`}
              >
                Development
              </button>
              <button
                onClick={() => handleEnvironmentChange('production')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  environment === 'production'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-primary hover:bg-gray-300'
                }`}
              >
                Production
              </button>
            </div>
          </div>

          {/* Mode Filter */}
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Mode</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleModeFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedMode === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-primary hover:bg-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleModeFilter('support')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedMode === 'support'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-primary hover:bg-gray-300'
                }`}
              >
                Support
              </button>
              <button
                onClick={() => handleModeFilter('analyzer')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedMode === 'analyzer'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-primary hover:bg-gray-300'
                }`}
              >
                Analyzer
              </button>
              <button
                onClick={() => handleModeFilter('bias-detector')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedMode === 'bias-detector'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-primary hover:bg-gray-300'
                }`}
              >
                Bias Detector
              </button>
              <button
                onClick={() => handleModeFilter('feminist-lens')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedMode === 'feminist-lens'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-primary hover:bg-gray-300'
                }`}
              >
                Feminist Lens
              </button>
              <button
                onClick={() => handleModeFilter('rewrite-engine')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedMode === 'rewrite-engine'
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-primary hover:bg-gray-300'
                }`}
              >
                Rewrite Engine
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-primary">
            <strong>Total Messages:</strong> {total}
          </div>
        </div>

        {/* Messages Display */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMessages).length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-500 text-lg">No messages found</p>
                <p className="text-gray-400 text-sm mt-2">Try changing the filters or refresh the data</p>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([sessionId, sessionMessages]) => (
                <div key={sessionId} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getModeColor(sessionMessages[0].mode)}`}>
                        {getModeIcon(sessionMessages[0].mode)}
                        <span className="capitalize">{sessionMessages[0].mode.replace('-', ' ')}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar size={14} />
                        <span>Session ID: {sessionId.slice(0, 8)}...</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {sessionMessages.length} message{sessionMessages.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {sessionMessages
                      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                      .map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-primary/10 ml-8'
                              : 'bg-gray-100 mr-8'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-xs font-semibold ${
                              msg.role === 'user' ? 'text-primary' : 'text-secondary'
                            }`}>
                              {msg.role === 'user' ? 'User' : 'Assistant'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(msg.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                            {msg.content.length > 500
                              ? msg.content.substring(0, 500) + '...'
                              : msg.content}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
