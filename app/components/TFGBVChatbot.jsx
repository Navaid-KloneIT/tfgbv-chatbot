// app/components/TFGBVChatbot.jsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Shield, Phone, AlertCircle, Globe, Menu, X, FileText, Upload } from 'lucide-react';
import mammoth from 'mammoth';

const TFGBVChatbot = () => {
  const [mode, setMode] = useState('support'); // 'support', 'analyzer', 'bias-detector', 'feminist-lens', 'rewrite-engine'
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'السلام علیکم / आदाब / Hello! I am here to provide you with confidential support and information about Technology-Facilitated Gender-Based Violence (TFGBV). You can ask me about:\n\n• What is TFGBV?\n• How to stay safe online\n• Where to report abuse\n• Your legal rights\n• Support services available\n\nHow can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setMessages([]);
    setAnalysisResult(null);
    setInputMessage('');
    if (newMode === 'support') {
      setMessages([
        {
          role: 'assistant',
          content: 'You are now in Support Chat mode. I am here to provide confidential support and information about TFGBV. How can I help?',
          timestamp: new Date()
        }
      ]);
    } else if (newMode === 'analyzer') {
      setMessages([
        {
          role: 'assistant',
          content: 'You are now in Content Analyzer mode. Please enter a headline, paste your text, or upload a Word document for review based on Uks\'s feminist and media-sensitive guidelines.',
          timestamp: new Date()
        }
      ]);
    } else if (newMode === 'bias-detector') {
      setMessages([
        {
          role: 'assistant',
          content: 'You are now in Bias Detector mode. Please enter text or upload a Word document to analyze for gender-biased language. I will flag problematic terms and suggest neutral alternatives.',
          timestamp: new Date()
        }
      ]);
    } else if (newMode === 'feminist-lens') {
      setMessages([
        {
          role: 'assistant',
          content: 'You are now in Feminist Lens mode. Please enter text or upload a Word document to analyze for representation gaps, such as missing perspectives from women or marginalized groups.',
          timestamp: new Date()
        }
      ]);
    } else if (newMode === 'rewrite-engine') {
      setMessages([
        {
          role: 'assistant',
          content: 'You are now in Rewrite Engine mode. Please enter text or upload a Word document (e.g., job ads, posters) to transform exclusionary language into inclusive terms.',
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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    setAnalysisResult(null);

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
          mode
        }),
      });

      if (!response.ok) {
        throw new Error('API response was not ok.');
      }

      const data = await response.json();

      if (['analyzer', 'bias-detector', 'feminist-lens', 'rewrite-engine'].includes(mode) && data.analysis) {
        setAnalysisResult(data);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: mode === 'analyzer'
            ? "Here is the analysis of your text. See the results displayed below the chat."
            : mode === 'bias-detector'
            ? "Here is the bias analysis of your text. Problematic terms have been flagged with neutral alternatives below."
            : mode === 'feminist-lens'
            ? "Here is the analysis of representation gaps in your text. Suggestions for inclusivity are provided below."
            : "Here is the rewritten text with inclusive language. See the changes below.",
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
    event.target.value = null;
  };

  const handleQuickAction = (text) => {
    setInputMessage(text);
  };

  const getTranslation = (key) => {
    const translations = {
      en: {
        title: 'UKS-Platform',
        subtitle: 'Confidential Support & Information',
        emergency: 'Emergency Contacts',
        quickActions: 'Quick Actions',
        typeMessage: 'Type your message...',
        language: 'Language',
        disclaimer: 'This chatbot provides information only. For immediate danger, please call emergency services.',
        confidential: 'Your conversation is private and confidential',
        analyzerTitle: 'Content Analyzer',
        analyzerSubtitle: 'Review content based on Uks\'s guidelines',
        biasDetectorTitle: 'Bias Detector',
        biasDetectorSubtitle: 'Detect and correct gender-biased language',
        feministLensTitle: 'Feminist Lens',
        feministLensSubtitle: 'Analyze for representation gaps',
        rewriteEngineTitle: 'Rewrite Engine',
        rewriteEngineSubtitle: 'Transform exclusionary language to inclusive',
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
        biasDetectorTitle: 'تعصب کا پتہ لگانے والا',
        biasDetectorSubtitle: 'جنسی تعصب پر مبنی زبان کا پتہ لگائیں اور درست کریں',
        feministLensTitle: 'فیمنسٹ لینس',
        feministLensSubtitle: 'نقصانات کی نمائندگی کے لئے تجزیہ کریں',
        rewriteEngineTitle: 'ری رائٹ انجن',
        rewriteEngineSubtitle: 'خارج کرنے والی زبان کو شامل کرنے والی زبان میں تبدیل کریں',
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
        biasDetectorTitle: 'تعصب جو پتو لڳائيندڙ',
        biasDetectorSubtitle: 'جنسي تعصب تي ٻڌل ٻوليءَ جو پتو لڳايو ۽ درست ڪريو',
        feministLensTitle: 'فيمينسٽ لينس',
        feministLensSubtitle: 'نمايانگي جي خالن جو تجزيو ڪريو',
        rewriteEngineTitle: 'ري رائيٽ انجن',
        rewriteEngineSubtitle: 'خارج ڪندڙ ٻولي کي شامل ڪندڙ ٻولي ۾ تبديل ڪريو',
        typePrompt: 'ھڪڙي عنوان داخل ڪريو يا ٽيڪسٽ پيسٽ ڪريو...'
      }
    };
    return translations[language][key] || translations.en[key];
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/20">
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-80 bg-white shadow-xl transition-transform duration-300 ease-in-out z-20 h-full overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="text-primary" size={28} />
              <h2 className="text-xl font-bold text-secondary">Resources</h2>
            </div>
            <button onClick={() => setShowSidebar(false)} className="md:hidden">
              <X size={24} className="text-primary" />
            </button>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-secondary mb-2">
              <Globe className="inline mr-2 text-primary" size={16} />
              {getTranslation('language')}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
            >
              <option value="en">English</option>
              <option value="ur">اردو (Urdu)</option>
              <option value="sd">سنڌي (Sindhi)</option>
            </select>
          </div>
          {mode === 'support' ? (
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-secondary mb-3 flex items-center">
                  <Phone className="mr-2 text-primary" size={20} />
                  {getTranslation('emergency')}
                </h3>
                <div className="space-y-2">
                  {emergencyContacts[language].map((contact, index) => (
                    <div key={index} className="bg-secondary/10 p-3 rounded-lg border border-secondary/20">
                      <p className="text-sm font-medium text-primary">{contact.name}</p>
                      <p className="text-lg font-bold text-primary">{contact.number}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold text-secondary mb-3">{getTranslation('quickActions')}</h3>
                <div className="space-y-2">
                  {quickActions[language].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.text)}
                        className="w-full text-left px-4 py-3 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center space-x-3"
                      >
                        <Icon size={18} className="text-primary" />
                        <span className="text-sm text-primary">{action.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : mode === 'analyzer' ? (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-secondary mb-2">About Content Analyzer</h3>
              <p className="text-xs text-primary">
                This tool helps journalists and content creators by:
                <br/>• Generating content from headlines.
                <br/>• Revising text based on feminist and gender-sensitive principles.
                <br/>• Highlighting grammatical and stylistic issues.
              </p>
            </div>
          ) : mode === 'bias-detector' ? (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-secondary mb-2">About Bias Detector</h3>
              <p className="text-xs text-primary">
                This tool identifies gender-biased language in text, such as terms like 'emotional' or 'ambitious' when used for female leaders, and suggests neutral alternatives like 'expressive' or 'determined' based on Uks' 30-year archive of Pakistani journalism.
              </p>
            </div>
          ) : mode === 'feminist-lens' ? (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-secondary mb-2">About Feminist Lens</h3>
              <p className="text-xs text-primary">
                This tool scans content for representation gaps, such as missing perspectives from women or marginalized groups, and suggests inclusive additions based on Uks' Gynae Feminism project.
              </p>
            </div>
          ) : (
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <h3 className="font-semibold text-secondary mb-2">About Rewrite Engine</h3>
              <p className="text-xs text-primary">
                This tool transforms exclusionary language in job ads or posters into inclusive terms, such as changing 'salesman' to 'salesperson' or 'hygienic Muslim girls' to 'health-conscious youth.'
              </p>
            </div>
          )}
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-4 mt-6">
            <p className="text-xs text-primary">
              {getTranslation('disclaimer')}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-md px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button onClick={() => setShowSidebar(true)} className="md:hidden">
                <Menu size={24} className="text-primary" />
              </button>
              {mode === 'support' ? (
                <MessageCircle className="text-primary" size={32} />
              ) : mode === 'analyzer' ? (
                <FileText className="text-primary" size={32} />
              ) : mode === 'bias-detector' ? (
                <AlertCircle className="text-primary" size={32} />
              ) : mode === 'feminist-lens' ? (
                <Shield className="text-primary" size={32} />
              ) : (
                <FileText className="text-primary" size={32} />
              )}
              <div>
                <h1 className="text-2xl font-bold text-secondary">
                  {mode === 'support' ? getTranslation('title') :
                   mode === 'analyzer' ? getTranslation('analyzerTitle') :
                   mode === 'bias-detector' ? getTranslation('biasDetectorTitle') :
                   mode === 'feminist-lens' ? getTranslation('feministLensTitle') :
                   getTranslation('rewriteEngineTitle')}
                </h1>
                <p className="text-sm text-primary">
                  {mode === 'support' ? getTranslation('subtitle') :
                   mode === 'analyzer' ? getTranslation('analyzerSubtitle') :
                   mode === 'bias-detector' ? getTranslation('biasDetectorSubtitle') :
                   mode === 'feminist-lens' ? getTranslation('feministLensSubtitle') :
                   getTranslation('rewriteEngineSubtitle')}
                </p>
              </div>
            </div>
            <div className="flex items-center p-1 bg-gray-200 rounded-lg">
              <button
                onClick={() => handleModeChange('support')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'support' ? 'bg-primary text-white' : 'text-primary'}`}
              >
                Support
              </button>
              <button
                onClick={() => handleModeChange('analyzer')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'analyzer' ? 'bg-primary text-white' : 'text-primary'}`}
              >
                Analyzer
              </button>
              <button
                onClick={() => handleModeChange('bias-detector')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'bias-detector' ? 'bg-primary text-white' : 'text-primary'}`}
              >
                Bias Detector
              </button>
              <button
                onClick={() => handleModeChange('feminist-lens')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'feminist-lens' ? 'bg-primary text-white' : 'text-primary'}`}
              >
                Feminist Lens
              </button>
              <button
                onClick={() => handleModeChange('rewrite-engine')}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${mode === 'rewrite-engine' ? 'bg-primary text-white' : 'text-primary'}`}
              >
                Rewrite Engine
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg shadow-md ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary'
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
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          {analysisResult && (
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-secondary mb-4">
                {mode === 'analyzer' ? 'Analysis Complete' :
                 mode === 'bias-detector' ? 'Bias Detection Complete' :
                 mode === 'feminist-lens' ? 'Feminist Lens Analysis Complete' :
                 'Rewrite Complete'}
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-secondary mb-2">Revised Content</h3>
                  <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap text-primary">
                    {analysisResult.revisedText}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-secondary mb-2">Issues and Suggestions</h3>
                  {analysisResult.analysis.length > 0 ? (
                    <div className="space-y-4">
                      {analysisResult.analysis.map((item, index) => (
                        <div key={index} className="border-l-4 p-4 rounded-r-lg" style={{ borderColor: item.issueType === 'Tone' ? '#F6A317' : item.issueType === 'Gender-Sensitivity' ? '#F472B6' : item.issueType === 'Bias' ? '#10B981' : item.issueType === 'Representation' ? '#EF4444' : item.issueType === 'Inclusivity' ? '#8B5CF6' : '#60A5FA' }}>
                          <p className="font-semibold text-primary">Original Snippet: <span className="font-normal italic text-red-600">"{item.originalSnippet}"</span></p>
                          <p className="text-sm mt-2"><strong className="text-primary">Issue Type:</strong> {item.issueType}</p>
                          <p className="text-sm mt-1"><strong className="text-primary">Explanation:</strong> {item.explanation}</p>
                          <p className="text-sm mt-1"><strong className="text-primary">Suggestion:</strong> {item.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-primary">No specific issues found. The text aligns well with the guidelines.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-white border-t px-6 py-4">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={mode === 'support' ? getTranslation('typeMessage') : getTranslation('typePrompt')}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-primary"
              disabled={isLoading}
            />
            {['analyzer', 'bias-detector', 'feminist-lens', 'rewrite-engine'].includes(mode) && (
              <>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".docx" style={{ display: 'none' }} />
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={isLoading}
                  className="px-4 py-3 bg-gray-200 text-primary rounded-lg hover:bg-gray-300 disabled:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <Upload size={20} className="text-primary" />
                  <span className="hidden sm:inline text-primary">Upload</span>
                </button>
              </>
            )}
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send size={20} className="text-white" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TFGBVChatbot;