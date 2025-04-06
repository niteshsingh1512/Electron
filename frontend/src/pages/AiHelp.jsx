import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Paperclip, Mic, Camera, Send, FileUp, AlertCircle, Globe, VolumeX, Volume2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Import react-markdown
import remarkGfm from 'remark-gfm'; // Import remark-gfm for GitHub-flavored Markdown

// Import layout components
import Header from '../component/layout/Header';
import Sidebar from '../component/layout/Sidebar';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Correct import for Gemini

const AiHelp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [numPredict, setNumPredict] = useState(500); // Increased default token count
  const messageEndRef = useRef(null);
  const textareaRef = useRef(null);
  
  // Speech recognition related states
  const [isListening, setIsListening] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const recognitionRef = useRef(null);
  
  // Text-to-speech related states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthSupported, setSpeechSynthSupported] = useState(false);
  const synthRef = useRef(null);
  
  // Language selection
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: 'en-IN',
    name: 'English (India)',
    voiceName: 'Google हिन्दी'
  });
  
  // List of Indian languages supported
  const indianLanguages = [
    { code: 'en-IN', name: 'English (India)', voiceName: 'Google English (India)' },
    { code: 'hi-IN', name: 'Hindi', voiceName: 'Google हिन्दी' },
    { code: 'ta-IN', name: 'Tamil', voiceName: 'Google தமிழ்' },
    { code: 'te-IN', name: 'Telugu', voiceName: 'Google తెలుగు' },
    { code: 'kn-IN', name: 'Kannada', voiceName: 'Google ಕನ್ನಡ' },
    { code: 'ml-IN', name: 'Malayalam', voiceName: 'Google മലയാളം' },
    { code: 'mr-IN', name: 'Marathi', voiceName: 'Google मराठी' },
    { code: 'bn-IN', name: 'Bengali', voiceName: 'Google বাংলা' },
    { code: 'gu-IN', name: 'Gujarati', voiceName: 'Google ગુજરાતી' },
    { code: 'pa-IN', name: 'Punjabi', voiceName: 'Google ਪੰਜਾਬੀ' },
  ];

  // Initial questions/problems
  const initialProblems = [
    "How do I fix my slow computer performance?",
    "My internet connection keeps dropping. What should I check?",
    "I'm getting a blue screen error. How can I troubleshoot it?",
    "My printer isn't connecting to my computer. What should I do?"
  ];

  // Check for speech recognition and speech synthesis support
  useEffect(() => {
    // Check for SpeechRecognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        if (event.results[0].isFinal) {
          setInput(transcript);
        }
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    }
    
    // Check for SpeechSynthesis support
    if ('speechSynthesis' in window) {
      setSpeechSynthSupported(true);
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Handle toggle for advanced mode
  const toggleAdvancedMode = () => {
    setAdvancedMode(!advancedMode);
    if (!advancedMode) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  // Handle toggle for speech recognition
  const toggleSpeechRecognition = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else if (recognitionSupported) {
      recognitionRef.current.lang = selectedLanguage.code;
      recognitionRef.current.start();
    }
  };

  // Helper function to clean text for speech
  const cleanTextForSpeech = (text) => {
    // Remove markdown formatting
    let cleanedText = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1') // Italic
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Links
      .replace(/`(.*?)`/g, '$1') // Inline code
      .replace(/```[\s\S]*?```/g, '') // Code blocks
      .replace(/#{1,6}\s(.*?)(\n|$)/g, '$1. ') // Headers
      .replace(/\n\s*[-*+]\s/g, '. ') // Bullet points
      .replace(/\n\s*\d+\.\s/g, '. ') // Numbered lists
      
      // Remove special characters but keep spaces and punctuation
      .replace(/[^\w\s.,?!;:'"()]/g, ' ')
      
      // Replace multiple spaces with a single space
      .replace(/\s+/g, ' ')
      
      // Add pauses for punctuation
      .replace(/\./g, '. ')
      .replace(/\!/g, '! ')
      .replace(/\?/g, '? ')
      .trim();
      
    return cleanedText;
  };

  // Speak text using speech synthesis
  const speakText = (text) => {
    if (speechSynthSupported && text) {
      // Stop any current speech
      if (synthRef.current.speaking) {
        synthRef.current.cancel();
      }
      
      // Clean the text for better speech
      const cleanedText = cleanTextForSpeech(text);
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.lang = selectedLanguage.code;
      
      // Try to find a voice matching the selected language
      const voices = synthRef.current.getVoices();
      const voice = voices.find(v => 
        v.lang.includes(selectedLanguage.code.split('-')[0]) || 
        v.name.includes(selectedLanguage.voiceName)
      );
      
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (speechSynthSupported && synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Check if response appears truncated
  const isTruncatedResponse = (response) => {
    const truncationIndicators = [
      /[a-zA-Z0-9]$/,
      /\d+\.\s*$/,
      /\*\s*$/,
      /\s(and|or|the|if|to|in|on|with|by|for|a|an)$/i
    ];
    return truncationIndicators.some(pattern => pattern.test(response));
  };

  // Generate response from API
  const generateResponse = async (userInput, isFollowUp = false) => {
    try {
      if (advancedMode) {
        // Use Gemini API with language instruction
        const genAI = new GoogleGenerativeAI("AIzaSyAFxeDll-_VENmpKupAWieN-7dHt4-QfkU");
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        
        // Specify the language in the prompt
        const languageInstruction = selectedLanguage.code !== 'en-IN' 
          ? `Please respond in ${selectedLanguage.name} language. Question: ${userInput}`
          : userInput;

        const result = await model.generateContent(languageInstruction);
        const responseText = result.response.text();

        return responseText;
      }

      // Default to LLaMA if advancedMode is OFF
      const tokensToUse = isFollowUp ? Math.min(numPredict * 2, 1000) : numPredict;
      const response = await fetch('http://localhost:8000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: userInput,
          stream: false,
          options: {
            num_predict: tokensToUse,
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      return data?.response || 'Sorry, no response from LLaMA.';
    } catch (error) {
      return 'An error occurred while generating a response. Please try again.';
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prevMessages => [...prevMessages, { sender: 'user', content: userMessage }]);
    setInput('');

    setIsLoading(true);
    setLoadingMessage(userMessage);

    try {
      let aiResponse = await generateResponse(userMessage);

      if (isTruncatedResponse(aiResponse)) {
        const followUpPrompt = `${userMessage}\n\nYour previous response was: "${aiResponse}"\n\nPlease continue and complete your response.`;
        const continuationResponse = await generateResponse(followUpPrompt, true);
        aiResponse = `${aiResponse} ${continuationResponse.trim()}`;
      }

      const messageWithLang = { 
        sender: 'ai', 
        content: aiResponse,
        language: selectedLanguage.code 
      };
      
      setMessages(prevMessages => [...prevMessages, messageWithLang]);
      
      // Auto speak the response if in advanced mode
      if (advancedMode && speechSynthSupported) {
        speakText(aiResponse);
      }
    } catch (error) {
      setMessages(prevMessages => [...prevMessages, { 
        sender: 'ai', 
        content: 'Sorry, there was an error processing your request. Please try again.',
        language: selectedLanguage.code
      }]);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Handle pressing Enter to send message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle selecting an initial problem
  const handleSelectProblem = async (problem) => {
    if (isLoading) return;

    setShowInitialOptions(false);
    setMessages([{ sender: 'user', content: problem }]);

    setIsLoading(true);
    setLoadingMessage(problem);

    try {
      let aiResponse = await generateResponse(problem);

      if (isTruncatedResponse(aiResponse)) {
        const followUpPrompt = `${problem}\n\nYour previous response was: "${aiResponse}"\n\nPlease continue and complete your response.`;
        const continuationResponse = await generateResponse(followUpPrompt, true);
        aiResponse = `${aiResponse} ${continuationResponse.trim()}`;
      }

      setMessages(prevMessages => [...prevMessages, { 
        sender: 'ai', 
        content: aiResponse,
        language: selectedLanguage.code 
      }]);
      
      // Auto speak the response if in advanced mode
      if (advancedMode && speechSynthSupported) {
        speakText(aiResponse);
      }
    } catch (error) {
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          sender: 'ai', 
          content: 'Sorry, there was an error processing your request. Please try again.',
          language: selectedLanguage.code
        }
      ]);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  // Handle going back to initial options
  const handleBackToOptions = () => {
    setMessages([]);
    setShowInitialOptions(true);
    setIsLoading(false);
    setLoadingMessage('');
    // Stop any ongoing speech
    if (speechSynthSupported && synthRef.current.speaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };
  
  // Handle language change
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    setShowLanguageSelector(false);
  };

  // Format user messages with plain text and AI messages with Markdown
  const formatMessage = (message) => {
    if (message.sender === 'user') {
      // User messages remain as plain text with line breaks
      return message.content.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < message.content.split('\n').length - 1 && <br />}
        </React.Fragment>
      ));
    } else {
      // AI messages use Markdown with GitHub-flavored support
      return <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={true} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          {!showInitialOptions && (
            <button 
              onClick={handleBackToOptions}
              className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
              disabled={isLoading}
            >
              <ArrowLeft size={18} />
              <span className="ml-2 text-sm">Back to options</span>
            </button>
          )}
          {showInitialOptions && <div className="w-32"></div>}
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-500 bg-clip-text text-transparent">
            AiHelp
          </h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button 
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100 text-gray-600"
              >
                <Globe size={16} />
                <span className="ml-1 text-xs md:text-sm">{selectedLanguage.name}</span>
              </button>
              
              {showLanguageSelector && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 py-1 border border-gray-200">
                  {indianLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        selectedLanguage.code === lang.code ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <span className="text-sm text-gray-600">Advanced Mode</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={advancedMode}
                onChange={toggleAdvancedMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </header>

        {showAlert && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-3 bg-indigo-600 text-white rounded-lg shadow-lg">
            <AlertCircle size={16} className="mr-2" />
            <span>Advanced mode enabled</span>
          </div>
        )}

        {isLoading && (
          <div className="fixed top-4 right-4 z-50 flex items-center p-3 bg-indigo-600 text-white rounded-lg shadow-md">
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing request...</span>
          </div>
        )}

        {isListening && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-3 bg-red-500 text-white rounded-lg shadow-md animate-pulse">
            <Mic size={16} className="mr-2" />
            <span>Listening... Speak now</span>
          </div>
        )}

        {isSpeaking && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-3 bg-indigo-600 text-white rounded-lg shadow-md">
            <Volume2 size={16} className="mr-2 animate-pulse" />
            <span className="mr-2">Speaking...</span>
            <button 
              onClick={stopSpeaking}
              className="flex items-center justify-center p-1 bg-white text-indigo-600 rounded-md hover:bg-gray-100"
            >
              <VolumeX size={14} className="mr-1" />
              <span className="text-xs font-medium">Stop</span>
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4">
          {showInitialOptions ? (
            <div className="max-w-3xl mx-auto mt-8">
              <h2 className="text-xl font-medium text-center mb-6">Choose from common tech issues:</h2>
              <div className="grid grid-cols-1 gap-4">
                {initialProblems.map((problem, index) => (
                  <div 
                    key={index}
                    onClick={() => handleSelectProblem(problem)}
                    className={`bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <p className="text-gray-800">{problem}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-500 mt-6">
                Or type your own question below
              </p>
              <div className="max-w-3xl mx-auto mt-8 bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Response Length: {numPredict}</label>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">tokens</span>
                    <button 
                      onClick={() => setNumPredict(Math.min(numPredict + 100, 1000))}
                      className="p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded ml-2"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => setNumPredict(Math.max(numPredict - 100, 100))}
                      className="p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded ml-1"
                    >
                      -
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={numPredict}
                  onChange={(e) => setNumPredict(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100<br/>(Brief)</span>
                  <span>500<br/>(Standard)</span>
                  <span>1000<br/>(Detailed)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="max-w-3xl mx-auto mb-4 bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Response Length: {numPredict}</label>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-1">tokens</span>
                    <button 
                      onClick={() => setNumPredict(Math.min(numPredict + 100, 1000))}
                      className="p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded ml-2"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => setNumPredict(Math.max(numPredict - 100, 100))}
                      className="p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded ml-1"
                    >
                      -
                    </button>
                  </div>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={numPredict}
                  onChange={(e) => setNumPredict(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>100<br/>(Brief)</span>
                  <span>500<br/>(Standard)</span>
                  <span>1000<br/>(Detailed)</span>
                </div>
              </div>

              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`flex ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'} max-w-[80%]`}>
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 ${
                        message.sender === 'user' ? 'bg-indigo-600 ml-2 text-white' : 'bg-gray-200 mr-2 text-gray-700'
                      }`}
                    >
                      {message.sender === 'user' ? 'U' : 'A'}
                    </div>
                    <div 
                      className={`p-3 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-white border border-gray-200 text-gray-800'
                      } animate-fadeIn relative`}
                    >
                      {formatMessage(message)}
                      
                      {/* Text-to-speech controls for AI messages only */}
                      {message.sender === 'ai' && speechSynthSupported && advancedMode && (
                        <div className="absolute top-2 right-2 flex space-x-1">
                          {isSpeaking && message === messages[messages.length - 1] ? (
                            <button 
                              onClick={stopSpeaking}
                              className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 flex items-center"
                              title="Stop speaking"
                            >
                              <VolumeX size={16} />
                            </button>
                          ) : (
                            <button 
                              onClick={() => speakText(message.content)}
                              className="p-1 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 flex items-center"
                              title="Read aloud"
                            >
                              <Volume2 size={16} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && loadingMessage && (
                <div className="flex justify-start mb-4">
                  <div className="flex flex-row max-w-[80%]">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 bg-gray-200 mr-2 text-gray-700">
                      A
                    </div>
                    <div className="p-4 rounded-lg bg-white border border-gray-200 text-gray-800 shadow-md min-w-[200px]">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6">
                            <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                          <span className="text-indigo-600 font-medium">Generating response...</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-gray-200 rounded-full w-full animate-pulse"></div>
                          <div className="h-2 bg-gray-200 rounded-full w-5/6 animate-pulse"></div>
                          <div className="h-2 bg-gray-200 rounded-full w-4/6 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messageEndRef} />
            </div>
          )}
        </main>

   
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg p-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Type your question in ${selectedLanguage.name}...`}
              className="flex-grow p-2 focus:outline-none resize-none min-h-[40px] max-h-[160px]"
              rows={1}
              disabled={isLoading}
            ></textarea>
            <div className="flex items-center space-x-2 ml-2">
              {recognitionSupported && (
                <button
                  onClick={toggleSpeechRecognition}
                  className={`p-2 rounded-full ${
                    isListening ? 'bg-red-100 text-red-600' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                  disabled={isLoading}
                  title="Voice input"
                >
                  <Mic size={20} />
                </button>
              )}
              <button
                onClick={handleSendMessage}
                className={`p-2 rounded-full ${
                  input.trim() && !isLoading 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!input.trim() || isLoading}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          
          {advancedMode && (
            <div className="flex justify-center mt-2 text-xs text-gray-500">
              <span>Using {advancedMode ? 'Gemini AI' : 'LLaMA'} model. {selectedLanguage.code !== 'en-IN' && `Responding in ${selectedLanguage.name}.`}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiHelp;