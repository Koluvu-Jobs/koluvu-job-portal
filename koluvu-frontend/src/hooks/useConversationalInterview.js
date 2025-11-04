import { useState, useEffect, useRef, useCallback } from 'react';

export const useConversationalInterview = (scriptId, voiceSettings = {}) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [phase, setPhase] = useState('greeting');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Web Speech API refs
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 3;
        
        recognitionRef.current.onresult = (event) => {
          let interim = '';
          let final = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence;
            
            if (event.results[i].isFinal && confidence > 0.7) {
              final += transcript;
            } else if (confidence > 0.5) {
              interim += transcript;
            }
          }
          
          setInterimTranscript(interim);
          
          if (final) {
            setTranscript(prev => prev + final);
            clearTimeout(silenceTimeoutRef.current);
            
            const isComplete = final.match(/[.!?]$/) || 
                              final.length > 50 || 
                              final.includes(' and ') || 
                              final.includes(' so ') ||
                              final.includes(' well ') ||
                              final.includes(' basically ');
            
            const silenceDelay = isComplete ? 1500 : 3000;
            
            silenceTimeoutRef.current = setTimeout(() => {
              if ((transcript + final).trim()) {
                console.log('🎤 Auto-sending after silence...');
                handleSendMessage(transcript + final);
              }
            }, silenceDelay);
          }
          
          // Allow interruption of AI speech
          if ((final || interim) && isSpeaking) {
            console.log('🔇 User interrupted AI speech');
            if (synthesisRef.current) {
              synthesisRef.current.cancel();
              setIsSpeaking(false);
            }
          }
        };        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          
          // Handle different error types
          if (event.error === 'not-allowed') {
            setError('Microphone permission denied. Please allow microphone access.');
          } else if (event.error === 'no-speech') {
            // Don't show error for no speech, just stop listening
            console.log('No speech detected, stopping recognition');
          } else if (event.error === 'aborted') {
            // Recognition was aborted, usually intentional
            console.log('Speech recognition aborted');
          } else {
            setError('Speech recognition error: ' + event.error);
          }
          
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
          setInterimTranscript('');
        };

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
          setIsListening(true);
          setError(null); // Clear any previous errors
        };
      } else {
        setError('Speech recognition not supported in this browser');
      }

      // Speech Synthesis
      synthesisRef.current = window.speechSynthesis;
    }    return () => {
      console.log('Cleaning up speech APIs...');
      
      // Clean up speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.onresult = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onstart = null;
        } catch (err) {
          console.error('Error cleaning up recognition:', err);
        }
      }
      
      // Clean up speech synthesis
      if (synthesisRef.current) {
        try {
          synthesisRef.current.cancel();
        } catch (err) {
          console.error('Error cleaning up synthesis:', err);
        }
      }
      
      // Clear timeouts
      if (speechTimeoutRef.current) {
        clearTimeout(speechTimeoutRef.current);
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Generate unique session ID
  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  // Start conversational interview
  const startConversation = useCallback(async () => {
    try {
      setError(null);
      setIsProcessing(true);
      
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      
      const response = await fetch('/api/conversational-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scriptId, 
          action: 'start',
          sessionId: newSessionId
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsSessionActive(true);
        setCurrentMessage(data.message);
        setPhase(data.phase);
        setProgress(10);
        
        const newMessage = {
          speaker: 'interviewer',
          message: data.message,
          timestamp: new Date().toISOString()
        };
        setConversationHistory([newMessage]);
        
        setTimeout(() => {
          speakMessage(data.message);
        }, 1000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to start conversational interview');
    } finally {
      setIsProcessing(false);
    }
  }, [scriptId]);

  // Speak message using Web Speech API with enhanced human-like voice
  const speakMessage = useCallback((message) => {
    if (synthesisRef.current && message) {
      synthesisRef.current.cancel();
      
      let cleanMessage = message
        .replace(/[*_`#]/g, '')
        .replace(/\b(um|uh|er)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      cleanMessage = cleanMessage
        .replace(/\. /g, '. ... ')
        .replace(/\? /g, '? ... ')
        .replace(/\, /g, ', .. ')
        .replace(/: /g, ': .. ');
      
      const utterance = new SpeechSynthesisUtterance(cleanMessage);
      
      // Use custom voice settings or defaults
      utterance.rate = voiceSettings.rate || 0.85;
      utterance.pitch = voiceSettings.pitch || 0.95;
      utterance.volume = voiceSettings.volume || 0.9;
      
      // Use selected voice or find best available
      if (voiceSettings.voice) {
        utterance.voice = voiceSettings.voice;
      } else {
        const voices = synthesisRef.current.getVoices();
        const preferredVoices = [
          voices.find(voice => voice.name.includes('Google US English') && voice.name.includes('Female')),
          voices.find(voice => voice.name.includes('Microsoft Aria Online')),
          voices.find(voice => voice.name.includes('Microsoft Jenny Online')),
          voices.find(voice => voice.name.includes('Samantha')),
          voices.find(voice => voice.name.includes('Microsoft Zira')),
          voices.find(voice => voice.name.includes('Google')),
          voices.find(voice => !voice.localService),
          voices.find(voice => voice.lang.startsWith('en-US')),
        ].filter(Boolean);
        
        if (preferredVoices.length > 0) {
          utterance.voice = preferredVoices[0];
          console.log('🗣️ Using voice:', preferredVoices[0].name);
        }
      }
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('🗣️ AI started speaking...');
      };
        utterance.onend = () => {
        setIsSpeaking(false);
        console.log('✅ AI finished speaking');
        // Auto-start listening after AI finishes speaking with natural delay
        speechTimeoutRef.current = setTimeout(() => {
          if (!isListening && !isProcessing) {
            startListening();
          }
        }, Math.random() * 1000 + 1000);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        // Still try to start listening even if speech fails
        setTimeout(() => {
          if (!isListening && !isProcessing) {
            startListening();
          }
        }, 1500);
      };
      
      utterance.onboundary = (event) => {
        if (Math.random() < 0.1) {
          utterance.rate = 0.8 + Math.random() * 0.2;
        }
      };
      
      synthesisRef.current.speak(utterance);
    }
  }, [voiceSettings]);
  // Start listening for user's response
  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening && !isSpeaking && !isProcessing) {
      setTranscript('');
      setInterimTranscript('');
      setError(null);
      
      try {
        // First stop any existing recognition
        recognitionRef.current.stop();
        
        // Wait a bit then start new recognition
        setTimeout(() => {
          if (recognitionRef.current && !isListening && !isSpeaking && !isProcessing) {
            try {
              recognitionRef.current.start();
            } catch (err) {
              console.error('Error starting recognition after timeout:', err);
              // If still failing, try once more after a longer delay
              setTimeout(() => {
                if (recognitionRef.current && !isListening) {
                  try {
                    recognitionRef.current.start();
                  } catch (e) {
                    console.error('Final recognition start attempt failed:', e);
                  }
                }
              }, 500);
            }
          }
        }, 100);
      } catch (err) {
        console.error('Error preparing recognition:', err);
      }
    }
  }, [isListening, isSpeaking, isProcessing]);
  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        if (isListening) {
          console.log('Stopping speech recognition...');
          recognitionRef.current.stop();
        }
        clearTimeout(silenceTimeoutRef.current);
        setIsListening(false);
      } catch (err) {
        console.error('Error stopping recognition:', err);
        setIsListening(false);
      }
    }
  }, [isListening]);

  // Send message to AI
  const handleSendMessage = useCallback(async (message) => {
    if (!message?.trim() || isProcessing || !sessionId) return;
    
    try {
      setIsProcessing(true);
      stopListening();
      
      const userMessage = {
        speaker: 'candidate',
        message: message.trim(),
        timestamp: new Date().toISOString()
      };
      setConversationHistory(prev => [...prev, userMessage]);
      setTranscript('');
      
      const response = await fetch('/api/conversational-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scriptId,
          sessionId,
          action: 'chat',
          userMessage: message.trim()
        })
      });

      const data = await response.json();
      if (data.success) {
        setCurrentMessage(data.message);
        setPhase(data.phase);
        setProgress(data.progress);
        
        const aiMessage = {
          speaker: 'interviewer',
          message: data.message,
          timestamp: new Date().toISOString()
        };
        setConversationHistory(prev => [...prev, aiMessage]);
        
        if (data.completed) {
          setIsSessionActive(false);
          setProgress(100);
        }
        
        setTimeout(() => {
          speakMessage(data.message);
        }, 500);
        
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsProcessing(false);
    }
  }, [scriptId, sessionId, isProcessing, stopListening, speakMessage]);

  // Manual send (for typing)
  const sendMessage = useCallback((message) => {
    handleSendMessage(message);
  }, [handleSendMessage]);

  // End conversation
  const endConversation = useCallback(async () => {
    try {
      if (sessionId) {
        await fetch('/api/conversational-interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scriptId,
            sessionId,
            action: 'end'
          })
        });
      }

      setIsSessionActive(false);
      setSessionId(null);
      setCurrentMessage('');
      setPhase('greeting');
      setProgress(100);
      
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthesisRef.current) synthesisRef.current.cancel();
      
    } catch (err) {
      setError('Failed to end conversation properly');
    }
  }, [scriptId, sessionId]);

  // Skip current AI response
  const skipSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    // State
    isSessionActive,
    currentMessage,
    conversationHistory,
    isListening,
    isSpeaking,
    transcript: transcript + interimTranscript,
    phase,
    progress,
    error,
    isProcessing,
    
    // Actions
    startConversation,
    endConversation,
    startListening,
    stopListening,
    sendMessage,
    skipSpeaking,
    
    // Utils
    sessionId
  };
};
