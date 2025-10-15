// app/components/TFGBVChatbot.jsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Shield, Phone, AlertCircle, Globe, Menu, X, FileText, Upload } from 'lucide-react';
import mammoth from 'mammoth'; // --- ADDED --- for reading docx files

const TFGBVChatbot = () => {
  // --- START: MODIFIED STATE ---
  const [mode, setMode] = useState('support'); // 'support' or 'analyzer'
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'السلام علیکم / आदाब / Hello! I am here to provide you with confidential support and information about Technology-Facilitated Gender-Based Violence (TFGBV). You can ask me about:\n\n• What is TFGBV?\n• How to stay safe online\n• Where to report abuse\n• Your legal rights\n• Support services available\n\nHow can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [analysisResult, setAnalysisResult] = useState(null); // To store results from analyzer mode
  // --- END: MODIFIED STATE ---

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);
  const fileInputRef = useRef(null); // --- ADDED --- for file input

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- ADDED --- Function to handle mode change
  const handleModeChange = (newMode) => {
    setMode(newMode);
    setMessages([]); // Clear messages when switching modes
    setAnalysisResult(null); // Clear analysis results
    setInputMessage('');
    if (newMode === 'support') {
        setMessages([
             {
              role: 'assistant',
              content: 'You are now in Support Chat mode. I am here to provide confidential support and information about TFGBV. How can I help?',
              timestamp: new Date()
            }
        ]);
    } else {
        setMessages([
             {
              role: 'assistant',
              content: 'You are now in Content Analyzer mode. Please enter a headline, paste your text, or upload a Word document for review based on Uks\'s feminist and media-sensitive guidelines.',
              timestamp: new Date()
            }
        ]);
    }
  };
  
  const emergencyContacts = {
    en: [
      { name: 'National Emergency Helpline', number: '1099' },
      { name: 'Rozan Helpline', number: '0800-22-227' },
      { name: 'Madadgar Helpline', number: '1098' },
      { name: 'Women Development Helpline', number: '1043' }
    ],
    ur: [
      { name: 'قومی ہنگامی ہیلپ لائن', number: '1099' },
      { name: 'روزن ہیلپ لائن', number: '0800-22-227' },
      { name: 'مددگار ہیلپ لائن', number: '1098' },
      { name: 'خواتین کی ترقی ہیلپ لائن', number: '1043' }
    ],
    sd: [
      { name: 'قومي ايمرجنسي هيلپ لائين', number: '1099' },
      { name: 'روزن هيلپ لائين', number: '0800-22-227' },
      { name: 'مددگار هيلپ لائين', number: '1098' },
      { name: 'عورتن جي ترقي هيلپ لائين', number: '1043' }
    ]
  };

  const quickActions = {
    en: [
      { text: 'What is TFGBV?', icon: AlertCircle },
      { text: 'How to stay safe online', icon: Shield },
      { text: 'Where to report abuse', icon: Phone },
      { text: 'My legal rights', icon: MessageCircle }
    ],
    ur: [
      { text: 'TFGBV کیا ہے؟', icon: AlertCircle },
      { text: 'آن لائن محفوظ کیسے رہیں', icon: Shield },
      { text: 'بدسلوکی کی رپورٹ کہاں کریں', icon: Phone },
      { text: 'میرے قانونی حقوق', icon: MessageCircle }
    ],
    sd: [
      { text: 'TFGBV ڇا آهي؟', icon: AlertCircle },
      { text: 'آن لائن محفوظ ڪيئن رهجو', icon: Shield },
      { text: 'بدسلوڪي جي رپورٽ ڪٿي ڪجو', icon: Phone },
      { text: 'منهنجا قانوني حق', icon: MessageCircle }
    ]
  };

  const systemPrompt = `You are a compassionate, culturally sensitive AI assistant supporting women experiencing Technology-Facilitated Gender-Based Violence (TFGBV) in Pakistan. Your role is to:

1. Provide accurate information about TFGBV in simple, accessible language
2. Offer practical guidance on digital safety and reporting mechanisms
3. Inform survivors about their legal rights under Pakistani law
4. Direct users to appropriate support services
5. Maintain a supportive, non-judgmental, and empowering tone
6. Respect cultural sensitivities of the Sindhi-speaking and broader Pakistani community
7. Prioritize user safety and confidentiality
8. Never blame survivors or minimize their experiences

Key information to share:
- TFGBV includes cyberstalking, non-consensual sharing of images, online harassment, threats, doxxing, and digital abuse
- Pakistan's Prevention of Electronic Crimes Act (PECA) 2016 provides legal protection
- Survivors can report to FIA Cyber Crime Wing, local police, or use helplines
- Digital safety measures: strong passwords, privacy settings, blocking harassers, documenting evidence
- Available support: Rozan, Uks Research Centre, legal aid organizations, counseling services

Always be empathetic, provide hope, and empower survivors with actionable information.`;

  // --- START: MODIFIED handleSendMessage FUNCTION ---
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    setAnalysisResult(null); // Clear previous analysis

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          language,
          mode // Pass the current mode to the API
        }),
      });

      if (!response.ok) {
        throw new Error('API response was not ok.');
      }

      const data = await response.json();

      if (mode === 'analyzer' && data.analysis) {
        setAnalysisResult(data);
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: "Here is the analysis of your text. See the results displayed below the chat.",
            timestamp: new Date()
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I encountered an error. Please check your connection or API quota and try again.",
        timestamp: new Date()
      }]);
    }

    setIsLoading(false);
  };
  // --- END: MODIFIED handleSendMessage FUNCTION ---
  
  // --- ADDED --- Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        mammoth.extractRawText({ arrayBuffer: arrayBuffer })
          .then(result => {
            setInputMessage(result.value);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Document "${file.name}" uploaded successfully. Press 'Send' to analyze.`,
                timestamp: new Date()
            }]);
          })
          .catch(err => {
            console.error('Error reading docx file:', err);
             setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Sorry, there was an error reading the document.`,
                timestamp: new Date()
            }]);
          });
      };
      reader.readAsArrayBuffer(file);
    } else {
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: `Please upload a valid Word document (.docx).`,
            timestamp: new Date()
        }]);
    }
    event.target.value = null; // Reset file input
  };


  const handleQuickAction = (text) => {
    setInputMessage(text);
  };

  const getTranslation = (key) => {
    const translations = {
      en: {
        title: 'TFGBV Support Chatbot',
        subtitle: 'Confidential Support & Information',
        emergency: 'Emergency Contacts',
        quickActions: 'Quick Actions',
        typeMessage: 'Type your message...',
        language: 'Language',
        disclaimer: 'This chatbot provides information only. For immediate danger, please call emergency services.',
        confidential: 'Your conversation is private and confidential',
        analyzerTitle: 'Content Analyzer',
        analyzerSubtitle: 'Review content based on Uks\'s guidelines',
        typePrompt: 'Enter a headline or paste text...'
      },
      ur: {
        title: 'TFGBV سپورٹ چیٹ بوٹ',
        subtitle: 'خفیہ معاونت اور معلومات',
        emergency: 'ہنگامی رابطے',
        quickActions: 'فوری اقدامات',
        typeMessage: 'اپنا پیغام لکھیں...',
        language: 'زبان',
        disclaimer: 'یہ چیٹ بوٹ صرف معلومات فراہم کرتا ہے۔ فوری خطرے کی صورت میں، براہ کرم ہنگامی خدمات کو کال کریں۔',
        confidential: 'آپ کی گفتگو نجی اور خفیہ ہے',
        analyzerTitle: 'مواد کا تجزیہ کار',
        analyzerSubtitle: 'یوکس کے رہنما اصولوں پر مبنی مواد کا جائزہ لیں',
        typePrompt: 'ایک سرخی درج کریں یا متن چسپاں کریں...'
      },
      sd: {
        title: 'TFGBV سپورٽ چيٽ بوٽ',
        subtitle: 'رازداري سپورٽ ۽ معلومات',
        emergency: 'ايمرجنسي رابطا',
        quickActions: 'تڪڙا قدم',
        typeMessage: 'پنهنجو پيغام لکو...',
        language: 'ٻولي',
        disclaimer: 'هي چيٽ بوٽ صرف معلومات فراهم ڪري ٿو. فوري خطري جي صورت ۾، مهرباني ڪري ايمرجنسي سروسز کي ڪال ڪريو.',
        confidential: 'توهان جي ڳالهه ٻولهه خانگي ۽ رازداري آهي',
        analyzerTitle: 'مواد جو تجزيو ڪندڙ',
        analyzerSubtitle: 'Uks جي ھدايتن جي بنياد تي مواد جو جائزو وٺو',
        typePrompt: 'ھڪڙي عنوان داخل ڪريو يا ٽيڪسٽ پيسٽ ڪريو...'
      }
    };

    return translations[language][key] || translations.en[key];
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-80 bg-white shadow-xl transition-transform duration-300 ease-in-out z-20 h-full overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="text-purple-600" size={28} />
              <h2 className="text-xl font-bold text-gray-800">Resources</h2>
            </div>
            <button onClick={() => setShowSidebar(false)} className="md:hidden">
              <X size={24} />
            </button>
          </div>

          {/* Language Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Globe className="inline mr-2" size={16} />
              {getTranslation('language')}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="ur">اردو (Urdu)</option>
              <option value="sd">سنڌي (Sindhi)</option>
            </select>
          </div>
            
          {/* --- RENDER SIDEBAR CONTENT BASED ON MODE --- */}
          {mode === 'support' ? (
            <>
              {/* Emergency Contacts */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Phone className="mr-2 text-red-600" size={20} />
                  {getTranslation('emergency')}
                </h3>
                <div className="space-y-2">
                  {emergencyContacts[language].map((contact, index) => (
                    <div key={index} className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <p className="text-sm font-medium text-gray-800">{contact.name}</p>
                      <p className="text-lg font-bold text-red-600">{contact.number}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">{getTranslation('quickActions')}</h3>
                <div className="space-y-2">
                  {quickActions[language].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.text)}
                        className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center space-x-3"
                      >
                        <Icon size={18} className="text-purple-600" />
                        <span className="text-sm text-gray-700">{action.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">About Content Analyzer</h3>
                <p className="text-xs text-gray-600">
                    This tool helps journalists and content creators by:
                    <br/>• Generating content from headlines.
                    <br/>• Revising text based on feminist and gender-sensitive principles.
                    <br/>• Highlighting grammatical and stylistic issues.
                </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
            <p className="text-xs text-gray-600">
              {getTranslation('disclaimer')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-md px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => setShowSidebar(true)} className="md:hidden">
                <Menu size={24} />
              </button>
              {/* --- DYNAMIC HEADER --- */}
              {mode === 'support' ? (
                <MessageCircle className="text-purple-600" size={32} />
              ) : (
                <FileText className="text-blue-600" size={32} />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    {mode === 'support' ? getTranslation('title') : getTranslation('analyzerTitle')}
                </h1>
                <p className="text-sm text-gray-600">
                    {mode === 'support' ? getTranslation('subtitle') : getTranslation('analyzerSubtitle')}
                </p>
              </div>
            </div>
             {/* --- ADDED MODE SWITCHER --- */}
            <div className="flex items-center p-1 bg-gray-200 rounded-lg">
                <button 
                    onClick={() => handleModeChange('support')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'support' ? 'bg-purple-600 text-white' : 'text-gray-600'}`}>
                    Support
                </button>
                <button 
                    onClick={() => handleModeChange('analyzer')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'analyzer' ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>
                    Analyzer
                </button>
            </div>
          </div>
        </div>

        {/* Messages and Analysis Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg shadow-md ${
                  message.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {hasMounted && (
                  <p className="text-xs mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md px-4 py-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
           {/* --- ADDED: Analysis Result Display --- */}
          {analysisResult && (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Analysis Complete</h2>
                <div className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-blue-600 mb-2">Revised Content</h3>
                        <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap text-gray-700">
                            {analysisResult.revisedText}
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-blue-600 mb-2">Issues and Suggestions</h3>
                        {analysisResult.analysis.length > 0 ? (
                            <div className="space-y-4">
                                {analysisResult.analysis.map((item, index) => (
                                    <div key={index} className="border-l-4 p-4 rounded-r-lg" style={{borderColor: item.issueType === 'Tone' ? '#FBBF24' : item.issueType === 'Gender-Sensitivity' ? '#F472B6' : '#60A5FA'}}>
                                        <p className="font-semibold text-gray-800">Original Snippet: <span className="font-normal italic text-red-600">"{item.originalSnippet}"</span></p>
                                        <p className="text-sm mt-2"><strong className="text-gray-700">Issue Type:</strong> {item.issueType}</p>
                                        <p className="text-sm mt-1"><strong className="text-gray-700">Explanation:</strong> {item.explanation}</p>
                                        <p className="text-sm mt-1"><strong className="text-gray-700">Suggestion:</strong> {item.suggestion}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No specific issues found. The text aligns well with the guidelines.</p>
                        )}
                    </div>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t px-6 py-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={mode === 'support' ? getTranslation('typeMessage') : getTranslation('typePrompt')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={isLoading}
            />
            {/* --- ADDED: UPLOAD BUTTON FOR ANALYZER MODE --- */}
            {mode === 'analyzer' && (
                <>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".docx" style={{ display: 'none' }} />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        disabled={isLoading}
                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors flex items-center space-x-2"
                    >
                       <Upload size={20} />
                       <span className="hidden sm:inline">Upload</span>
                    </button>
                </>
            )}
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send size={20} />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TFGBVChatbot;