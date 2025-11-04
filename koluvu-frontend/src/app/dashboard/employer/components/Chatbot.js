'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FaBusinessTime, FaTimes, FaPaperPlane, FaUserTie } from 'react-icons/fa';

const EmployerChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm Koluvu Employer Assistant. How can I help you with your hiring needs today?",
      sender: 'bot',
      time: getCurrentTime(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Employer-specific suggestions
  const initialSuggestions = [
    'How to post a new job?',
    'Review applicants',
    'Message an applicant',
    'Hiring best practices'
  ];
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  // Check if user is near bottom of chat
  const checkIfNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - (scrollTop + clientHeight) < 100;
  }, []);

  // Scroll to bottom with optional behavior
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Handle scroll events to track position
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsNearBottom(checkIfNearBottom());
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [checkIfNearBottom]);

  // Auto-scroll logic when messages change
  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isTyping, isNearBottom, scrollToBottom]);

  const addMessage = useCallback((text, sender) => {
    const newMessage = {
      text: formatLinks(text),
      sender,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  const updateSuggestions = useCallback((prompt) => {
    let newSuggestions = [];
    
    if (prompt.includes('post') || prompt.includes('job') || prompt.includes('listing')) {
      newSuggestions = [
        'Job title tips',
        'Salary range advice',
        'Screening questions'
      ];
    } else if (prompt.includes('applicant') || prompt.includes('candidate') || prompt.includes('review')) {
      newSuggestions = [
        'Filter applicants',
        'Send interview invite',
        'Reject politely'
      ];
    } else if (prompt.includes('interview') || prompt.includes('meet') || prompt.includes('schedule')) {
      newSuggestions = [
        'Interview questions',
        'Assessment tests',
        'Interview scheduling'
      ];
    } else if (prompt.includes('message') || prompt.includes('contact') || prompt.includes('communicate')) {
      newSuggestions = [
        'Template messages',
        'Follow-up timing',
        'Response etiquette'
      ];
    } else {
      newSuggestions = [
        'Hiring timeline',
        'Candidate search',
        'Profile screening'
      ];
    }
    
    setSuggestions(newSuggestions);
  }, []);

  const fetchGeminiResponse = useCallback(async (prompt) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Koluvu Employer Assistant, helping employers with hiring on the Koluvu platform. 
              Provide concise, actionable advice (1-2 paragraphs max). Focus on:
              - Job posting optimization
              - Applicant management
              - Communication with candidates
              - Hiring process guidance
              Remove any markdown formatting. The employer asked: ${prompt}`
            }]
          }]
        })
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      setIsTyping(false);
      
      if (data.candidates && data.candidates[0].content) {
        let botResponse = data.candidates[0].content.parts[0].text;
        botResponse = botResponse.replace(/\*\*/g, '').replace(/\*/g, '');
        addMessage(botResponse, 'bot');
        updateSuggestions(prompt.toLowerCase());
      } else {
        addMessage("I couldn't process your request. Please try rephrasing your question.", 'bot');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsTyping(false);
      addMessage("I'm having connection issues. Please try again shortly.", 'bot');
    }
  }, [addMessage, updateSuggestions]);

  const sendMessage = useCallback(() => {
    const message = inputValue.trim();
    if (message) {
      addMessage(message, 'user');
      setInputValue('');
      setIsTyping(true);
      setIsNearBottom(true);
      fetchGeminiResponse(message);
    }
  }, [inputValue, addMessage, fetchGeminiResponse]);

  const toggleChatbot = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) {
        setTimeout(() => {
          inputRef.current?.focus();
          setIsNearBottom(true);
          scrollToBottom('auto');
        }, 100);
      }
      return !prev;
    });
    if (!isOpen && hasNotification) {
      setHasNotification(false);
    }
  }, [isOpen, hasNotification, scrollToBottom]);

  const closeChatbot = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }, [sendMessage]);

  const selectSuggestion = useCallback((suggestion) => {
    setInputValue(suggestion);
    inputRef.current?.focus();
    setTimeout(() => sendMessage(), 100);
  }, [sendMessage]);

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {!isOpen && (
        <button
          onClick={toggleChatbot}
          className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105"
          aria-label="Open employer chatbot"
        >
          <FaUserTie className="text-lg sm:text-xl" />
          {hasNotification && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              1
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div className="w-[90vw] max-w-xs sm:max-w-sm h-[24rem] sm:h-[28rem] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-200 transform">
          <div className="bg-blue-600 text-white p-3 sm:p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaBusinessTime className="text-lg sm:text-xl" />
              <h3 className="font-semibold text-sm sm:text-base">Employer Assistant</h3>
            </div>
            <button
              onClick={closeChatbot}
              className="text-white hover:text-blue-200 transition-colors duration-200"
              aria-label="Close chatbot"
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-3 bg-gray-50 space-y-2"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${message.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-200'}`}
                >
                  <div 
                    className="message-content" 
                    dangerouslySetInnerHTML={{ __html: message.text }}
                  />
                  <div className={`text-[10px] mt-1 ${message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {message.time}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-3 py-2 rounded-lg shadow-sm rounded-bl-none border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {!isTyping && suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs hover:bg-blue-200 transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-gray-200 p-2 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask about hiring..."
                className="flex-1 border border-gray-300 rounded-full px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${inputValue.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'} text-white transition-colors duration-200`}
                aria-label="Send message"
              >
                <FaPaperPlane className="text-xs sm:text-sm" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function formatLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
}

function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${minutes} ${ampm}`;
}

export default EmployerChatbot;
