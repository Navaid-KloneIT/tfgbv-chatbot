// app/components/TFGBVChatbot.jsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Shield, Phone, AlertCircle, Globe, Menu, X, FileText, Upload, Moon, Sun } from 'lucide-react';
import mammoth from 'mammoth';

// Helper function to format markdown-style text to HTML
const formatMessageContent = (content) => {
  if (!content) return content;

  // Convert markdown formatting to HTML
  let formatted = content
    // Bold: **text** or __text__ -> <strong>text</strong>
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_ -> <em>text</em>
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    // Headings: ### Heading -> <h3>Heading</h3>
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
    // Bullet points: - item or * item -> <li>item</li>
    .replace(/^[\-\*] (.+)$/gm, '<li class="ml-4">$1</li>')
    // Wrap consecutive <li> tags in <ul>
    .replace(/(<li.*?<\/li>\n?)+/g, '<ul class="list-disc ml-6 my-2">$&</ul>')
    // Line breaks: \n\n -> <br><br>
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');

  return formatted;
};

const TFGBVChatbot = () => {
  const [mode, setMode] = useState('support'); // 'support', 'analyzer', 'bias-detector', 'feminist-lens', 'rewrite-engine'
  // Store messages per mode to preserve chat history when switching tabs
  const [messagesByMode, setMessagesByMode] = useState({
    support: [
      {
        role: 'assistant',
        content: '<p><strong>Uks Research Centre&rsquo;s AI Platform</strong> brings gender sensitivity to the digital world.<br><br>It detects bias, challenges stereotypes, and helps you communicate with fairness and empathy in both <strong>Urdu and English</strong>.</p><br/><p><strong>What It Does</strong></p><br/><ul type="disc"> <li><strong>Detect Bias:</strong> Finds sexist or exclusionary language and suggests inclusive alternatives.</li><br/> <li><strong>Analyze Media:</strong> Rates content for gender balance and fair representation.</li> <br/> <li><strong>Rewrite with Respect:</strong> Turns harmful or biased text into fair,&nbsp;inclusive communication.</li> </ul> <br/> <p><strong>Built in Pakistan, for Pakistan</strong></p> <p>Locally trained, culturally aware &mdash; this AI understands how language, power, and gender work here.</p>',
        timestamp: new Date()
      }
    ],
    analyzer: [],
    'bias-detector': [],
    'feminist-lens': [],
    'rewrite-engine': []
  });
  const [analysisResultByMode, setAnalysisResultByMode] = useState({
    support: null,
    analyzer: null,
    'bias-detector': null,
    'feminist-lens': null,
    'rewrite-engine': null
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showSidebar, setShowSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasMounted, setHasMounted] = useState(false);
  const fileInputRef = useRef(null);

  // Generate or retrieve persistent session ID from localStorage
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      let storedSessionId = localStorage.getItem('chatSessionId');
      if (!storedSessionId) {
        storedSessionId = crypto.randomUUID();
        localStorage.setItem('chatSessionId', storedSessionId);
      }
      return storedSessionId;
    }
    return crypto.randomUUID();
  });

  // Get current messages and analysis result for active mode
  const messages = messagesByMode[mode] || [];
  const analysisResult = analysisResultByMode[mode];

  // Helper function to save message to database
  const saveMessageToDatabase = async (role, content, currentMode) => {
    try {
      await fetch('/api/save-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          mode: currentMode,
          role,
          content,
          environment: process.env.NEXT_PUBLIC_ENV || 'production'
        }),
      });
    } catch (error) {
      console.error('Failed to save message to database:', error);
    }
  };

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
    setInputMessage('');

    // Initialize messages for this mode if empty
    setMessagesByMode(prev => {
      const currentModeMessages = prev[newMode];
      if (!currentModeMessages || currentModeMessages.length === 0) {
        let welcomeMessage = '';
        if (newMode === 'support') {
          welcomeMessage = 'You are now in Support Chat mode. I am here to provide confidential support and information about Uks Feminist AI Platform. How can I help?';
        } else if (newMode === 'analyzer') {
          welcomeMessage = 'You are now in Content Analyzer mode. Please enter a headline, paste your text, or upload a Word document for review based on Uks\'s feminist and media-sensitive guidelines.';
        } else if (newMode === 'bias-detector') {
          welcomeMessage = 'You are now in Bias Detector mode. Please enter text or upload a Word document to analyze for gender-biased language. I will flag problematic terms and suggest neutral alternatives.';
        } else if (newMode === 'feminist-lens') {
          welcomeMessage = 'You are now in Feminist Lens mode. Please enter text or upload a Word document to analyze for representation gaps, such as missing perspectives from women or marginalized groups.';
        } else if (newMode === 'rewrite-engine') {
          welcomeMessage = 'You are now in Rewrite Engine mode. Please enter text or upload a Word document (e.g., job ads, posters) to transform exclusionary language into inclusive terms.';
        }

        return {
          ...prev,
          [newMode]: [{
            role: 'assistant',
            content: welcomeMessage,
            timestamp: new Date()
          }]
        };
      }
      return prev;
    });
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
      { text: 'What is Uks Feminist AI Platform?', icon: AlertCircle },
      { text: 'How to stay safe online', icon: Shield },
      { text: 'Where to report abuse', icon: Phone },
      { text: 'My legal rights', icon: MessageCircle }
    ],
    ur: [
      { text: 'Uks Feminist AI Platform کیا ہے؟', icon: AlertCircle },
      { text: 'آن لائن محفوظ کیسے رہیں', icon: Shield },
      { text: 'بدسلوکی کی رپورٹ کہاں کریں', icon: Phone },
      { text: 'میرے قانونی حقوق', icon: MessageCircle }
    ],
    sd: [
      { text: 'Uks Feminist AI Platform ڇا آهي؟', icon: AlertCircle },
      { text: 'آن لائن محفوظ ڪيئن رهجو', icon: Shield },
      { text: 'بدسلوڪي جي رپورٽ ڪٿي ڪجو', icon: Phone },
      { text: 'منهنجا قانوني حق', icon: MessageCircle }
    ]
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Clear analysis result for current mode
    setAnalysisResultByMode(prev => ({
      ...prev,
      [mode]: null
    }));

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    // Add user message to current mode's messages
    setMessagesByMode(prev => ({
      ...prev,
      [mode]: [...(prev[mode] || []), userMessage]
    }));

    // Save user message to database
    saveMessageToDatabase('user', inputMessage, mode);

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
        setAnalysisResultByMode(prev => ({
          ...prev,
          [mode]: data
        }));
        const assistantContent = mode === 'analyzer'
          ? "Here is the analysis of your text. See the results displayed below the chat."
          : mode === 'bias-detector'
          ? "Here is the bias analysis of your text. Problematic terms have been flagged with neutral alternatives below."
          : mode === 'feminist-lens'
          ? "Here is the analysis of representation gaps in your text. Suggestions for inclusivity are provided below."
          : "Here is the rewritten text with inclusive language. See the changes below.";

        setMessagesByMode(prev => ({
          ...prev,
          [mode]: [...(prev[mode] || []), {
            role: 'assistant',
            content: assistantContent,
            timestamp: new Date()
          }]
        }));

        // Save assistant message with analysis result to database
        saveMessageToDatabase('assistant', JSON.stringify(data), mode);
      } else {
        // Format the message content with markdown formatting
        const formattedContent = formatMessageContent(data.message);
        setMessagesByMode(prev => ({
          ...prev,
          [mode]: [...(prev[mode] || []), {
            role: 'assistant',
            content: formattedContent,
            timestamp: new Date()
          }]
        }));

        // Save assistant message to database
        saveMessageToDatabase('assistant', data.message, mode);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage = "Sorry, I encountered an error. Please check your connection or API quota and try again.";
      setMessagesByMode(prev => ({
        ...prev,
        [mode]: [...(prev[mode] || []), {
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date()
        }]
      }));

      // Save error message to database
      saveMessageToDatabase('assistant', errorMessage, mode);
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
            setMessagesByMode(prev => ({
              ...prev,
              [mode]: [...(prev[mode] || []), {
                role: 'assistant',
                content: `Document "${file.name}" uploaded successfully. Press 'Send' to analyze.`,
                timestamp: new Date()
              }]
            }));
          })
          .catch(err => {
            console.error('Error reading docx file:', err);
            setMessagesByMode(prev => ({
              ...prev,
              [mode]: [...(prev[mode] || []), {
                role: 'assistant',
                content: `Sorry, there was an error reading the document.`,
                timestamp: new Date()
              }]
            }));
          });
      };
      reader.readAsArrayBuffer(file);
    } else {
      setMessagesByMode(prev => ({
        ...prev,
        [mode]: [...(prev[mode] || []), {
          role: 'assistant',
          content: `Please upload a valid Word document (.docx).`,
          timestamp: new Date()
        }]
      }));
    }
    event.target.value = null;
  };

  const handleQuickAction = (text) => {
    setInputMessage(text);
  };

  const getTranslation = (key) => {
    const translations = {
      en: {
        title: 'Uks Feminist AI Platform',
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
        title: 'Uks Feminist AI Platform سپورٹ چیٹ بوٹ',
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
        title: 'Uks Feminist AI Platform سپورٽ چيٽ بوٽ',
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
    <div className={`flex h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/20'} overflow-hidden`}>
      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative w-64 sm:w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl transition-all duration-300 ease-in-out z-20 h-full overflow-y-auto`}>
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <img src="/uks-logo.jpg" alt="Uks Feminist AI Platform Logo" className="h-25 w-25" />
            </div>
            <button onClick={() => setShowSidebar(false)} className="md:hidden">
              <X size={24} className="text-primary" />
            </button>
          </div>
          
          {/* Language Selector */}
          <div className="mb-4 sm:mb-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-secondary'} mb-2`}>
              <Globe className={`inline mr-2 ${darkMode ? 'text-blue-400' : 'text-primary'}`} size={16} />
              {getTranslation('language')}
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200' : 'border-gray-300 bg-white text-primary'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm`}
            >
              <option value="en">English</option>
              <option value="ur">اردو (Urdu)</option>
              <option value="sd">سنڌي (Sindhi)</option>
            </select>
          </div>

          {/* Dark Mode Toggle */}
          <div className="mb-4 sm:mb-6">
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-secondary'} mb-2`}>
              {darkMode ? <Moon className={`inline mr-2 ${darkMode ? 'text-blue-400' : 'text-primary'}`} size={16} /> : <Sun className={`inline mr-2 ${darkMode ? 'text-blue-400' : 'text-primary'}`} size={16} />}
              Theme
            </label>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-full px-3 py-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200 hover:bg-gray-600' : 'border-gray-300 bg-white text-primary hover:bg-gray-50'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm flex items-center justify-between transition-colors`}
            >
              <span>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
              {darkMode ? <Moon size={16} className={darkMode ? 'text-blue-400' : 'text-primary'} /> : <Sun size={16} className={darkMode ? 'text-blue-400' : 'text-primary'} />}
            </button>
          </div>
          
          {mode === 'support' ? (
            <>
              {/* Emergency Contacts */}
              <div className="mb-4 sm:mb-6">
                <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-secondary'} mb-3 flex items-center text-sm sm:text-base`}>
                  <Phone className={`mr-2 ${darkMode ? 'text-blue-400' : 'text-primary'}`} size={20} />
                  {getTranslation('emergency')}
                </h3>
                <div className="space-y-2">
                  {emergencyContacts[language].map((contact, index) => (
                    <div key={index} className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-secondary/10 border-secondary/20'} p-2 sm:p-3 rounded-lg border`}>
                      <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-primary'}`}>{contact.name}</p>
                      <p className={`text-base sm:text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-primary'}`}>{contact.number}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-4 sm:mb-6">
                <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-secondary'} mb-3 text-sm sm:text-base`}>{getTranslation('quickActions')}</h3>
                <div className="space-y-2">
                  {quickActions[language].map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.text)}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-primary/10 hover:bg-primary/20'} rounded-lg transition-colors flex items-center space-x-2 sm:space-x-3`}
                      >
                        <Icon size={16} className={`${darkMode ? 'text-blue-400' : 'text-primary'} flex-shrink-0`} />
                        <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-200' : 'text-primary'}`}>{action.text}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : mode === 'analyzer' ? (
            <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-primary/10 border-primary/20'} border rounded-lg p-3 sm:p-4`}>
              <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-secondary'} mb-2 text-sm sm:text-base`}>About Content Analyzer</h3>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-primary'}`}>
                This tool helps journalists and content creators by:
                <br/>• Generating content from headlines.
                <br/>• Revising text based on feminist and gender-sensitive principles.
                <br/>• Highlighting grammatical and stylistic issues.
              </p>
            </div>
          ) : mode === 'bias-detector' ? (
            <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-primary/10 border-primary/20'} border rounded-lg p-3 sm:p-4`}>
              <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-secondary'} mb-2 text-sm sm:text-base`}>About Bias Detector</h3>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-primary'}`}>
                This tool identifies gender-biased language in text, such as terms like 'emotional' or 'ambitious' when used for female leaders, and suggests neutral alternatives like 'expressive' or 'determined' based on Uks' 30-year archive of Pakistani journalism.
              </p>
            </div>
          ) : mode === 'feminist-lens' ? (
            <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-primary/10 border-primary/20'} border rounded-lg p-3 sm:p-4`}>
              <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-secondary'} mb-2 text-sm sm:text-base`}>About Feminist Lens</h3>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-primary'}`}>
                This tool scans content for representation gaps, such as missing perspectives from women or marginalized groups, and suggests inclusive additions based on Uks' Gynae Feminism project.
              </p>
            </div>
          ) : (
            <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-primary/10 border-primary/20'} border rounded-lg p-3 sm:p-4`}>
              <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-secondary'} mb-2 text-sm sm:text-base`}>About Rewrite Engine</h3>
              <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-primary'}`}>
                This tool transforms exclusionary language in job ads or posters into inclusive terms, such as changing 'salesman' to 'salesperson' or 'hygienic Muslim girls' to 'health-conscious youth.'
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-secondary/10 border-secondary/20'} border rounded-lg p-3 sm:p-4 mt-4 sm:mt-6`}>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-primary'}`}>
              {getTranslation('disclaimer')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-md px-3 sm:px-6 py-3 sm:py-4`}>
          <div className="flex flex-col space-y-3">
            {/* Top row: Menu button, Logo, Icon, and Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <button onClick={() => setShowSidebar(true)} className="md:hidden flex-shrink-0">
                  <Menu size={24} className={darkMode ? 'text-blue-400' : 'text-primary'} />
                </button>

                {/* Logo - visible on mobile */}
                <img src="/uks-logo.jpg" alt="Uks Logo" className="h-8 w-8 sm:h-10 sm:w-10 md:hidden flex-shrink-0" />

                {/* Mode Icon - hidden on very small screens, visible on sm+ */}
                <div className="hidden sm:block flex-shrink-0">
                  {mode === 'support' ? (
                    <MessageCircle className={darkMode ? 'text-blue-400' : 'text-primary'} size={32} />
                  ) : mode === 'analyzer' ? (
                    <FileText className={darkMode ? 'text-blue-400' : 'text-primary'} size={32} />
                  ) : mode === 'bias-detector' ? (
                    <AlertCircle className={darkMode ? 'text-blue-400' : 'text-primary'} size={32} />
                  ) : mode === 'feminist-lens' ? (
                    <Shield className={darkMode ? 'text-blue-400' : 'text-primary'} size={32} />
                  ) : (
                    <FileText className={darkMode ? 'text-blue-400' : 'text-primary'} size={32} />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className={`text-base sm:text-xl md:text-2xl font-bold ${darkMode ? 'text-gray-200' : 'text-secondary'} truncate`}>
                    {mode === 'support' ? getTranslation('title') :
                     mode === 'analyzer' ? getTranslation('analyzerTitle') :
                     mode === 'bias-detector' ? getTranslation('biasDetectorTitle') :
                     mode === 'feminist-lens' ? getTranslation('feministLensTitle') :
                     getTranslation('rewriteEngineTitle')}
                  </h1>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-primary'} truncate`}>
                    {mode === 'support' ? getTranslation('subtitle') :
                     mode === 'analyzer' ? getTranslation('analyzerSubtitle') :
                     mode === 'bias-detector' ? getTranslation('biasDetectorSubtitle') :
                     mode === 'feminist-lens' ? getTranslation('feministLensSubtitle') :
                     getTranslation('rewriteEngineSubtitle')}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Bottom row: Mode switcher - scrollable on mobile */}
            <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0 pb-1">
              <div className={`flex items-center p-0.5 sm:p-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg space-x-0.5 sm:space-x-1 w-max sm:w-auto`}>
                <button
                  onClick={() => handleModeChange('support')}
                  className={`px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${mode === 'support' ? 'bg-primary text-white' : darkMode ? 'text-gray-300' : 'text-primary'}`}
                >
                  Support
                </button>
                <button
                  onClick={() => handleModeChange('analyzer')}
                  className={`px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${mode === 'analyzer' ? 'bg-primary text-white' : darkMode ? 'text-gray-300' : 'text-primary'}`}
                >
                  Analyzer
                </button>
                <button
                  onClick={() => handleModeChange('bias-detector')}
                  className={`px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${mode === 'bias-detector' ? 'bg-primary text-white' : darkMode ? 'text-gray-300' : 'text-primary'}`}
                >
                  Bias Detector
                </button>
                <button
                  onClick={() => handleModeChange('feminist-lens')}
                  className={`px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${mode === 'feminist-lens' ? 'bg-primary text-white' : darkMode ? 'text-gray-300' : 'text-primary'}`}
                >
                  Feminist Lens
                </button>
                <button
                  onClick={() => handleModeChange('rewrite-engine')}
                  className={`px-1.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${mode === 'rewrite-engine' ? 'bg-primary text-white' : darkMode ? 'text-gray-300' : 'text-primary'}`}
                >
                  Rewrite Engine
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-2xl px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-md ${
                  message.role === 'user'
                    ? 'bg-primary text-white'
                    : darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-primary'
                }`}
              >
                <div className="text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: message.content }} />
                {hasMounted && (
                  <p className="text-xs mt-1 sm:mt-2 opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className={`${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-md px-3 sm:px-4 py-2 sm:py-3 rounded-lg`}>
                <div className="flex space-x-2">
                  <div className={`w-2 h-2 ${darkMode ? 'bg-blue-400' : 'bg-primary'} rounded-full animate-bounce`}></div>
                  <div className={`w-2 h-2 ${darkMode ? 'bg-blue-400' : 'bg-primary'} rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
                  <div className={`w-2 h-2 ${darkMode ? 'bg-blue-400' : 'bg-primary'} rounded-full animate-bounce`} style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {/* Analysis Results */}
          {analysisResult && (
            <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 sm:p-6 rounded-lg shadow-lg border`}>
              <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-gray-200' : 'text-secondary'} mb-3 sm:mb-4`}>
                {mode === 'analyzer' ? 'Analysis Complete' :
                 mode === 'bias-detector' ? 'Bias Detection Complete' :
                 mode === 'feminist-lens' ? 'Feminist Lens Analysis Complete' :
                 'Rewrite Complete'}
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h3 className={`font-semibold text-base sm:text-lg ${darkMode ? 'text-gray-200' : 'text-secondary'} mb-2`}>Revised Content</h3>
                  <div className={`${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-primary'} p-3 sm:p-4 rounded-md whitespace-pre-wrap text-sm sm:text-base`}>
                    {analysisResult.revisedText}
                  </div>
                </div>
                <div>
                  <h3 className={`font-semibold text-base sm:text-lg ${darkMode ? 'text-gray-200' : 'text-secondary'} mb-2`}>Issues and Suggestions</h3>
                  {analysisResult.analysis.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {analysisResult.analysis.map((item, index) => (
                        <div key={index} className={`border-l-4 p-3 sm:p-4 rounded-r-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`} style={{ borderColor: item.issueType === 'Tone' ? '#F6A317' : item.issueType === 'Gender-Sensitivity' ? '#F472B6' : item.issueType === 'Bias' ? '#10B981' : item.issueType === 'Representation' ? '#EF4444' : item.issueType === 'Inclusivity' ? '#8B5CF6' : '#60A5FA' }}>
                          <p className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-primary'} text-sm sm:text-base`}>Original Snippet: <span className="font-normal italic text-red-400">"{item.originalSnippet}"</span></p>
                          <p className={`text-xs sm:text-sm mt-2 ${darkMode ? 'text-gray-300' : ''}`}><strong className={darkMode ? 'text-gray-200' : 'text-primary'}>Issue Type:</strong> {item.issueType}</p>
                          <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-300' : ''}`}><strong className={darkMode ? 'text-gray-200' : 'text-primary'}>Explanation:</strong> {item.explanation}</p>
                          <p className={`text-xs sm:text-sm mt-1 ${darkMode ? 'text-gray-300' : ''}`}><strong className={darkMode ? 'text-gray-200' : 'text-primary'}>Suggestion:</strong> {item.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`${darkMode ? 'text-gray-300' : 'text-primary'} text-sm sm:text-base`}>No specific issues found. The text aligns well with the guidelines.</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border-t px-3 sm:px-6 py-3 sm:py-4`}>
          <div className="flex space-x-2 sm:space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              placeholder={mode === 'support' ? getTranslation('typeMessage') : getTranslation('typePrompt')}
              className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400' : 'border-gray-300 bg-white text-primary'} rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base`}
            />
            
            {['analyzer', 'bias-detector', 'feminist-lens', 'rewrite-engine'].includes(mode) && (
              <>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".docx" style={{ display: 'none' }} />
                <button
                  onClick={() => fileInputRef.current.click()}
                  disabled={isLoading}
                  className={`px-3 sm:px-4 py-2 sm:py-3 ${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 disabled:bg-gray-800' : 'bg-gray-200 text-primary hover:bg-gray-300 disabled:bg-gray-100'} rounded-lg transition-colors flex items-center space-x-1 sm:space-x-2 flex-shrink-0`}
                >
                  <Upload size={18} className={darkMode ? 'text-gray-200' : 'text-primary'} />
                  <span className={`hidden sm:inline ${darkMode ? 'text-gray-200' : 'text-primary'} text-sm`}>Upload</span>
                </button>
              </>
            )}

            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className={`px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg hover:bg-primary/90 ${darkMode ? 'disabled:bg-gray-700' : 'disabled:bg-gray-300'} disabled:cursor-not-allowed transition-colors flex items-center space-x-1 sm:space-x-2 flex-shrink-0`}
            >
              <Send size={18} className="text-white" />
              <span className="hidden sm:inline text-sm">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TFGBVChatbot;