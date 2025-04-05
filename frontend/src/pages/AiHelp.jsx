import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Paperclip, Mic, Camera, Send, FileUp, AlertCircle } from 'lucide-react';
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

  // Initial questions/problems
  const initialProblems = [
    "How do I fix my slow computer performance?",
    "My internet connection keeps dropping. What should I check?",
    "I'm getting a blue screen error. How can I troubleshoot it?",
    "My printer isn't connecting to my computer. What should I do?"
  ];

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
        // Use Gemini API
        const genAI = new GoogleGenerativeAI("AIzaSyAFxeDll-_VENmpKupAWieN-7dHt4-QfkU");
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const result = await model.generateContent(userInput);
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

      setMessages(prevMessages => [...prevMessages, { sender: 'ai', content: aiResponse }]);
    } catch (error) {
      setMessages(prevMessages => [...prevMessages, { 
        sender: 'ai', 
        content: 'Sorry, there was an error processing your request. Please try again.' 
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

      setMessages(prevMessages => [...prevMessages, { sender: 'ai', content: aiResponse }]);
    } catch (error) {
      setMessages(prevMessages => [
        ...prevMessages, 
        { sender: 'ai', content: 'Sorry, there was an error processing your request. Please try again.' }
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
                      } animate-fadeIn`}
                    >
                      {formatMessage(message)}
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
          <div className="flex items-end max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your tech question here..."
              className="flex-1 px-4 py-2 resize-none max-h-32 min-h-[44px] focus:outline-none rounded-lg"
              rows={1}
              disabled={isLoading}
            />
            <div className="flex items-center p-2 space-x-1">
              <button 
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                disabled={isLoading}
              >
                <Paperclip size={20} />
              </button>
              {advancedMode && (
                <>
                  <button 
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                    disabled={isLoading}
                  >
                    <Mic size={20} />
                  </button>
                  <button 
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                    disabled={isLoading}
                  >
                    <Camera size={20} />
                  </button>
                  <button 
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                    disabled={isLoading}
                  >
                    <FileUp size={20} />
                  </button>
                </>
              )}
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className={`p-2 rounded-full ${
                  isLoading || !input.trim() 
                    ? 'bg-indigo-300 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white flex items-center justify-center`}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        /* Markdown styling */
        .markdown h1, .markdown h2, .markdown h3 {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .markdown h1 {
          font-size: 1.5rem;
        }
        .markdown h2 {
          font-size: 1.25rem;
        }
        .markdown h3 {
          font-size: 1rem;
        }
        .markdown p {
          margin-bottom: 0.5rem;
        }
        .markdown ul, .markdown ol {
          margin-left: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .markdown li {
          margin-bottom: 0.25rem;
        }
        .markdown table {
          border-collapse: collapse;
          margin-bottom: 0.5rem;
        }
        .markdown th, .markdown td {
          border: 1px solid #ccc;
          padding: 0.25rem 0.5rem;
        }
        .markdown th {
          background-color: #f5f5f5;
        }
        .markdown code {
          background-color: #f5f5f5;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
        }
        .markdown pre {
          background-color: #f5f5f5;
          padding: 0.5rem;
          border-radius: 0.25rem;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

export default AiHelp;