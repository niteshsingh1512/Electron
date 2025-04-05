import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Paperclip, Mic, Camera, Send, FileUp, AlertCircle } from 'lucide-react';

// Import layout components
import Header from '../component/layout/Header';
import Sidebar from '../component/layout/Sidebar';

const AiHelp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showInitialOptions, setShowInitialOptions] = useState(true);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const messageEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Initial questions/problems
  const initialProblems = [
    "How do I fix my slow computer performance?",
    "My internet connection keeps dropping. What should I check?",
    "I'm getting a blue screen error. How can I troubleshoot it?",
    "My printer isn't connecting to my computer. What should I do?"
  ];

  // Sample responses for the initial problems
  const problemResponses = {
    "How do I fix my slow computer performance?": "Based on common issues, your computer might be slow due to several factors:\n\n1. Too many background processes running\n2. Limited available RAM or storage space\n3. Outdated drivers or OS\n4. Possible malware infection\n\nI recommend starting with these steps:\n• Close unnecessary applications\n• Clear temporary files (type %temp% in Run dialog)\n• Run disk cleanup and defragmentation\n• Check for and install system updates\n• Consider upgrading RAM if problems persist",
    
    "My internet connection keeps dropping. What should I check?": "Intermittent connection issues can be frustrating. Let's troubleshoot step by step:\n\n1. Router/modem issues:\n   • Power cycle your router (unplug for 30 seconds)\n   • Check for overheating\n   • Verify all cables are secure\n\n2. Signal interference:\n   • Move router away from electronic devices\n   • Try different WiFi channels\n   • Consider signal boosters for large spaces\n\n3. Device-specific problems:\n   • Update network drivers\n   • Forget and reconnect to network\n   • Check for IP address conflicts",
    
    "I'm getting a blue screen error. How can I troubleshoot it?": "Blue screen errors (BSOD) typically indicate hardware or driver problems. Here's how to troubleshoot:\n\n1. Note the error code (it helps identify the specific issue)\n\n2. If you can boot into Windows:\n   • Check Event Viewer for error details\n   • Update all drivers, especially graphics and chipset\n   • Run System File Checker (sfc /scannow in Command Prompt)\n\n3. If you can't boot normally:\n   • Boot in Safe Mode (F8 during startup)\n   • Use System Restore to roll back recent changes\n   • Check for overheating issues\n   • Test RAM with Windows Memory Diagnostic",
    
    "My printer isn't connecting to my computer. What should I do?": "Let's get your printer connected again with these troubleshooting steps:\n\n1. Basic checks:\n   • Ensure printer is powered on and has paper/ink\n   • Verify all cables are securely connected\n   • Restart both printer and computer\n\n2. Network printer issues:\n   • Confirm printer and computer are on same network\n   • Try resetting the printer's network settings\n   • Check if printer's IP address has changed\n\n3. Driver problems:\n   • Uninstall and reinstall printer drivers\n   • Download latest drivers from manufacturer website\n   • Try using universal print drivers"
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  // Handle sending messages
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { sender: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = advancedMode
        ? "I'm using advanced diagnostics and searching the latest technical documentation to find a solution. Based on my analysis, your issue might be related to recent system changes. Here's what I recommend..."
        : "I understand your issue. Based on my analysis, here are some steps you can take to resolve this problem. Would you like me to provide more specific guidance?";
      
      setMessages([...newMessages, { sender: 'ai', content: aiResponse }]);
    }, 1000);
  };

  // Handle pressing Enter to send message (but Shift+Enter for new line)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle selecting an initial problem
  const handleSelectProblem = (problem) => {
    setShowInitialOptions(false);
    
    // Add user message and AI response
    setMessages([
      { sender: 'user', content: problem },
      { 
        sender: 'ai', 
        content: problemResponses[problem] || "I'll help you troubleshoot this issue. Could you provide more details about the problem you're experiencing?"
      }
    ]);
  };

  // Handle going back to initial options
  const handleBackToOptions = () => {
    setMessages([]);
    setShowInitialOptions(true);
  };

  // Format message content with line breaks
  const formatMessage = (content) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={true} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header /> {/* Header component */}
        
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
          {!showInitialOptions && (
            <button 
              onClick={handleBackToOptions}
              className="flex items-center justify-center p-2 rounded-md hover:bg-gray-100"
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

        {/* Advanced Mode Alert */}
        {showAlert && (
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 flex items-center p-3 bg-indigo-600 text-white rounded-lg shadow-lg">
            <AlertCircle size={16} className="mr-2" />
            <span>Advanced mode enabled</span>
          </div>
        )}

        {/* Main Chat Area */}
        <main className="flex-1 overflow-y-auto p-4">
          {showInitialOptions ? (
            <div className="max-w-3xl mx-auto mt-8">
              <h2 className="text-xl font-medium text-center mb-6">Choose from common tech issues:</h2>
              <div className="grid grid-cols-1 gap-4">
                {initialProblems.map((problem, index) => (
                  <div 
                    key={index}
                    onClick={() => handleSelectProblem(problem)}
                    className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-500 hover:shadow transition-all cursor-pointer"
                  >
                    <p className="text-gray-800">{problem}</p>
                  </div>
                ))}
              </div>
              <p className="text-center text-gray-500 mt-6">
                Or type your own question below
              </p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
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
                      }`}
                    >
                      {formatMessage(message.content)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messageEndRef} />
            </div>
          )}
        </main>

        {/* Input Area */}
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
            />
            
            <div className="flex items-center p-2 space-x-1">
              {/* Upload button - always visible */}
              <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                <Paperclip size={20} />
              </button>
              
              {/* Advanced mode additional buttons */}
              {advancedMode && (
                <>
                  <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                    <Mic size={20} />
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                    <Camera size={20} />
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500">
                    <FileUp size={20} />
                  </button>
                </>
              )}
              
              <button 
                onClick={handleSendMessage}
                className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiHelp;