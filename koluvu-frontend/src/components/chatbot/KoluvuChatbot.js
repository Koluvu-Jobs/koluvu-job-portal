// src/components/chatbot/KoluvuChatbot.js

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FaInfoCircle, FaTimes, FaPaperPlane } from 'react-icons/fa';
import md5 from 'crypto-js/md5';

const KoluvuChatbot = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm Koluvu AI Assistant. How can I help with your recruitment needs today?",
      sender: 'bot',
      time: getCurrentTime(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [lastRequestTime, setLastRequestTime] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  // Refs
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // API Configuration
  const GEMINI_MODEL = 'gemini-1.5-flash';
  const API_VERSION = 'v1beta';

  // Suggestions
  const [suggestions, setSuggestions] = useState([
    'Post a job',
    'Job requirements help',
    'Candidate search'
  ]);

  // Check scroll position
  const checkIfNearBottom = useCallback(() => {
    if (!messagesContainerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    return scrollHeight - (scrollTop + clientHeight) < 100;
  }, []);

  // Scroll to bottom
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Handle scroll events
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsNearBottom(checkIfNearBottom());
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [checkIfNearBottom]);

  // Auto-scroll when messages change
  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isTyping, isNearBottom, scrollToBottom]);

  // Add message to chat
  const addMessage = useCallback((text, sender) => {
    const newMessage = {
      text: formatLinks(text),
      sender,
      time: getCurrentTime(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  // Process queries with job posting specialization
  const processQuery = useCallback(async (prompt) => {
    // Enhanced knowledge base with job posting expertise
    const getKoluvuResponse = (prompt) => {
      const lowerPrompt = prompt.toLowerCase().trim();
      const lastUserMessage = messages.length > 1 ? messages[messages.length - 2].text.toLowerCase() : '';

      // Handle greetings
      if (/^(hi|hello|hey)$/.test(lowerPrompt)) {
        return {
          response: "Hello! I'm Koluvu's recruitment assistant. Are you looking to post a job or find candidates today?",
          suggestions: ['Post a job', 'Find candidates', 'Platform help']
        };
      }

      // Job Requirements Expertise
      if (lowerPrompt.includes('requirement') || lowerPrompt.includes('qualification') || 
          (lastUserMessage.includes('job') && lowerPrompt.includes('what'))) {
        return {
          response: `<strong>Job Requirements Best Practices:</strong><br><br>` +
                   `📌 <u>Essential Requirements:</u><br>` +
                   `• List only must-have skills (e.g., "3+ years JavaScript")<br>` +
                   `• Group by category:<br>` +
                   `&nbsp;&nbsp;- <strong>Technical Skills:</strong> [Specific tools/languages]<br>` +
                   `&nbsp;&nbsp;- <strong>Experience:</strong> [Years/type]<br>` +
                   `&nbsp;&nbsp;- <strong>Education:</strong> [Degree/certifications]<br><br>` +
                   `🚫 <u>Avoid:</u><br>` +
                   `• Unnecessary degree requirements<br>` +
                   `• Overly specific technologies unless critical<br>` +
                   `• Gender-biased language<br><br>` +
                   `💡 <strong>Example for Software Engineer:</strong><br>` +
                   `<em>"Required Skills:<br>` +
                   `- 3+ years with React.js<br>` +
                   `- REST API development<br>` +
                   `- State management (Redux/MobX)<br><br>` +
                   `Nice-to-Have:<br>` +
                   `- AWS experience<br>` +
                   `- Testing frameworks"</em>`,
          suggestions: ['See more examples', 'Requirements checklist', 'Start posting']
        };
      }

      // Job Posting Help
      if (lowerPrompt.includes('post a job') || lowerPrompt.includes('create listing')) {
        return {
          response: `<strong>Creating Effective Job Posts:</strong><br><br>` +
                   `1. <u>Title:</u> Be specific ("Senior UX Designer" vs "Designer")<br>` +
                   `2. <u>Description:</u> Brief team/role context<br>` +
                   `3. <u>Responsibilities:</u> 5-7 key tasks<br>` +
                   `4. <u>Requirements:</u> Use our requirements guide<br>` +
                   `5. <u>Benefits:</u> Highlight perks/company culture<br><br>` +
                   `📊 <strong>Koluvu Optimization Tips:</strong><br>` +
                   `• Use our AI title suggestions<br>` +
                   `• Include 3-5 relevant skills for matching<br>` +
                   `• Add screening questions<br><br>` +
                   `Would you like to see a sample post or start creating?`,
          suggestions: ['View sample', 'Start now', 'Optimization tips']
        };
      }

      // Candidate Search
      if (lowerPrompt.includes('find candidate') || lowerPrompt.includes('search')) {
        return {
          response: `<strong>Finding Candidates on Koluvu:</strong><br><br>` +
                   `🔍 <u>Search Methods:</u><br>` +
                   `• <strong>AI Match:</strong> Automatically suggests top candidates<br>` +
                   `• <strong>Boolean Search:</strong> (e.g., "Java AND Spring NOT Angular")<br>` +
                   `• <strong>Filters:</strong> Location, experience, skills<br><br>` +
                   `💡 <strong>Tips:</strong><br>` +
                   `- Save searches for recurring needs<br>` +
                   `- Review candidate match scores<br>` +
                   `- Use our templated outreach messages`,
          suggestions: ['Search syntax', 'Saved searches', 'Messaging']
        };
      }

      return null;
    };

    try {
      setIsTyping(true);
      const now = Date.now();
      
      // Rate limiting
      if (now - lastRequestTime < 1000) {
        addMessage("Please wait a moment between questions.", 'bot');
        return;
      }
      setLastRequestTime(now);

      // Check knowledge base first
      const koluvuResponse = getKoluvuResponse(prompt);
      if (koluvuResponse) {
        await new Promise(resolve => setTimeout(resolve, 800));
        addMessage(koluvuResponse.response, 'bot');
        setSuggestions(koluvuResponse.suggestions);
        return;
      }

      // Gemini API Call
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API key not configured');
      }

      const isJobQuestion = prompt.toLowerCase().includes('job');
      const url = `https://generativelanguage.googleapis.com/${API_VERSION}/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: isJobQuestion 
                ? `As Koluvu's Job Posting Expert, provide specific advice about job posts/requirements. Key rules:
                  - Focus on inclusive, clear requirements
                  - Suggest optimal structure for Koluvu's platform
                  - Provide concrete examples
                  - Never repeat previous answers verbatim
                  - For technical issues, direct to support@koluvu.com
                  
                  Question: ${prompt}`
                : `As Koluvu Assistant, answer concisely:
                  - Be helpful and professional
                  - Maintain context: ${messages.slice(-2).map(m => m.text).join(' | ')}
                  - New question: ${prompt}`
            }]
          }],
          safetySettings: [{
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH"
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!responseText) {
        throw new Error('Empty response from API');
      }

      // Format response
      const cleanResponse = responseText
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .trim();

      addMessage(cleanResponse, 'bot');
      
      // Context-aware suggestions
      if (isJobQuestion) {
        setSuggestions(['More examples', 'Start posting', 'Contact support']);
      } else {
        setSuggestions(['More help', 'Related topics', 'Main menu']);
      }

    } catch (error) {
      console.error('API Error:', error);
      addMessage(
        "I'm having technical difficulties. For immediate help with job posts, email support@koluvu.com",
        'bot'
      );
      setSuggestions(['Try again', 'Email support', 'Main menu']);
    } finally {
      setIsTyping(false);
    }
  }, [addMessage, lastRequestTime, messages]);

  // Send message handler
  const sendMessage = useCallback(() => {
    const message = inputValue.trim();
    if (message) {
      addMessage(message, 'user');
      setInputValue('');
      setIsTyping(true);
      setIsNearBottom(true);
      processQuery(message);
    }
  }, [inputValue, addMessage, processQuery]);

  // Toggle chatbot visibility
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

  // Close chatbot
  const closeChatbot = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  // Handle enter key press
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  }, [sendMessage]);

  // Handle suggestion selection
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
          aria-label="Open chatbot"
          suppressHydrationWarning
        >
          <FaInfoCircle className="text-lg sm:text-xl" />
          {hasNotification && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              1
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div className="w-[90vw] max-w-xs sm:max-w-sm h-[24rem] sm:h-[28rem] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
          <div className="bg-blue-600 text-white p-3 sm:p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <FaInfoCircle className="text-lg sm:text-xl" />
              <h3 className="font-semibold text-sm sm:text-base">Koluvu Assistant</h3>
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
                placeholder="Ask about Koluvu..."
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

// Format links in messages
function formatLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
  
  let formattedText = text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
  formattedText = formattedText.replace(emailRegex, '<a href="mailto:$1" class="text-blue-500 hover:underline">$1</a>');
  formattedText = formattedText.replace(/\n/g, '<br/>');
  
  return formattedText;
}

// Get current time in 12-hour format
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

export default KoluvuChatbot;
