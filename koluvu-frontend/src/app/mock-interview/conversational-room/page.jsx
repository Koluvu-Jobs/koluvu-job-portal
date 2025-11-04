// src/app/main/mock-interview/conversatioal/page.jsx

"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Video, VideoOff, Settings, LogOut, Play, Send, MessageCircle } from 'lucide-react';
import { useConversationalInterview } from '@koluvu/hooks/useConversationalInterview';
import { useSearchParams } from 'next/navigation';

const ConversationalInterviewRoom = () => {
  const searchParams = useSearchParams();
  const scriptId = searchParams.get('scriptId');
    const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.85,
    pitch: 0.95,
    volume: 0.9,
    voice: null
  });
  const [availableVoices, setAvailableVoices] = useState([]);
  const videoRef = useRef(null);
  const chatEndRef = useRef(null);
  // Conversational interview hook
  const {
    isSessionActive,
    currentMessage,
    conversationHistory,
    isListening,
    isSpeaking,
    transcript,
    phase,
    progress,
    error,
    isProcessing,
    startConversation,
    endConversation,
    startListening,
    stopListening,
    sendMessage,
    skipSpeaking,
    sessionId
  } = useConversationalInterview(scriptId, voiceSettings);
  // Setup camera and voice list
  useEffect(() => {
    const setupMedia = async () => {
      if (isCameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false, // We handle audio through speech recognition
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
        }
      } else {
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    };

    // Load available voices
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      const humanLikeVoices = voices.filter(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.includes('Google') || 
         voice.name.includes('Microsoft') ||
         voice.name.includes('Natural') ||
         voice.name.includes('Premium') ||
         !voice.localService)
      );
      setAvailableVoices(humanLikeVoices);
      
      // Set default voice to most natural one
      if (humanLikeVoices.length > 0 && !voiceSettings.voice) {
        setVoiceSettings(prev => ({ ...prev, voice: humanLikeVoices[0] }));
      }
    };

    setupMedia();
    loadVoices();
    
    // Load voices when they become available
    speechSynthesis.onvoiceschanged = loadVoices;
  }, [isCameraOn, voiceSettings.voice]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // Handle manual input submission
  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualInput.trim() && !isProcessing) {
      sendMessage(manualInput.trim());
      setManualInput('');
    }
  };

  // Get phase display info
  const getPhaseInfo = () => {
    switch (phase) {
      case 'greeting':
        return { label: 'Introduction', color: 'bg-blue-500' };
      case 'questioning':
        return { label: 'Interview Questions', color: 'bg-green-500' };
      case 'deep_dive':
        return { label: 'Deep Dive', color: 'bg-orange-500' };
      case 'closing':
        return { label: 'Closing', color: 'bg-purple-500' };
      default:
        return { label: 'Interview', color: 'bg-gray-500' };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900 font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-3 bg-white shadow-sm z-10 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-800">
            AI Conversational Interview
          </h1>
          <span className={`text-white text-xs font-medium px-2 py-0.5 rounded-full ${isSessionActive ? 'bg-red-500' : 'bg-gray-500'}`}>
            {isSessionActive ? 'LIVE' : 'READY'}
          </span>
          {isSessionActive && (
            <div className="flex items-center space-x-3">
              <span className={`text-xs font-medium px-2 py-1 rounded-full text-white ${phaseInfo.color}`}>
                {phaseInfo.label}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Progress:</span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">          <button 
            onClick={() => setShowChat(!showChat)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            <MessageCircle size={20} />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={isSessionActive ? endConversation : () => window.history.back()}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-md transition-colors duration-200"
          >
            <LogOut size={16} className="inline-block mr-1" /> 
            {isSessionActive ? 'End Interview' : 'Leave'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden bg-gray-50">
        {/* Left Section: Video Feeds and Conversation */}
        <div className={`flex flex-col p-4 space-y-4 transition-all duration-300 ${showChat ? 'w-2/3' : 'w-full'}`}>
          {/* Video Grid */}
          <div className="flex-1 grid grid-cols-2 gap-4 min-h-96">
            {/* AI Interviewer Video Card */}
            <div className="relative bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center shadow-lg">              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 opacity-80 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-6xl mb-2">👩‍💼</div>
                  <div className="text-lg font-semibold">Sarah</div>
                  <div className="text-sm opacity-80">AI Interviewer</div>
                </div>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm font-medium flex items-center">
                <span>Sarah (AI)</span>
                {isSpeaking && <span className="ml-2 animate-pulse">🗣️</span>}
                {isProcessing && <span className="ml-2 animate-spin">⚙️</span>}
              </div>
              {isSpeaking && (
                <div className="absolute bottom-0 left-0 w-full h-2 bg-blue-500 animate-pulse"></div>
              )}
            </div>

            {/* User Video Card */}
            <div className="relative bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center shadow-lg">
              {isCameraOn ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-lg"></video>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <span className="text-6xl">👨‍🎓</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded-md text-sm font-medium flex items-center">
                <span>You</span>
                {isListening && <span className="ml-2 animate-pulse">🎤</span>}
              </div>
              {isListening && (
                <div className="absolute bottom-0 left-0 w-full h-6 bg-green-500 animate-pulse opacity-70"></div>
              )}
            </div>
          </div>

          {/* Current Conversation Display */}
          <div className="bg-white rounded-lg p-4 min-h-32 shadow-md border border-gray-200">            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <div className="flex items-center justify-between">
                  <span>Error: {error}</span>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            
            {/* Debug info */}
            {debugMode && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4 text-sm">
                <div className="flex items-center justify-between mb-2">
                  <strong>Debug Info:</strong>
                  <button
                    onClick={() => setDebugMode(false)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    ✕
                  </button>
                </div>
                <div>Session: {sessionId}</div>
                <div>Phase: {phase}</div>
                <div>Progress: {progress}%</div>
                <div>Is Speaking: {isSpeaking ? 'Yes' : 'No'}</div>
                <div>Is Listening: {isListening ? 'Yes' : 'No'}</div>
                <div>Is Processing: {isProcessing ? 'Yes' : 'No'}</div>
                <div>Voice: {voiceSettings.voice?.name || 'Default'}</div>
              </div>
            )}
            
            {!isSessionActive ? (
              <div className="text-center">                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready to Meet Sarah</h3>
                <p className="text-gray-600 mb-4">Sarah is your AI interviewer who will conduct a natural, flowing conversation. She'll ask personalized questions, follow up naturally, and create a realistic interview experience.</p>
                <button
                  onClick={startConversation}
                  disabled={!scriptId || isProcessing}
                  className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  <Play size={16} className="inline-block mr-2" />
                  {isProcessing ? 'Starting...' : 'Start AI Interview'}
                </button>
                {!scriptId && (
                  <p className="text-red-500 text-sm mt-2">No script ID found. Please go through setup first.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Current AI Message */}                <div className="bg-blue-50 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-blue-600 font-medium">👩‍💼 Sarah (AI Interviewer):</p>
                    {isSpeaking && (
                      <button
                        onClick={skipSpeaking}
                        className="text-xs text-blue-500 hover:text-blue-700"
                      >
                        Skip Speaking
                      </button>
                    )}
                  </div>
                  <p className="text-gray-800">{currentMessage}</p>
                </div>
                
                {/* Live Transcript */}
                {(isListening || transcript) && (
                  <div className="bg-green-50 p-4 rounded-md border border-green-200">
                    <p className="text-sm text-green-600 font-medium mb-2">🎤 You're saying:</p>
                    <p className="text-gray-800 min-h-6">
                      {transcript || (isListening ? "Listening..." : "")}
                    </p>
                  </div>
                )}
                
                {/* Manual Input */}
                <form onSubmit={handleManualSubmit} className="flex space-x-2">
                  <input
                    type="text"
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    placeholder="Type your response here..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isProcessing}
                  />
                  <button
                    type="submit"
                    disabled={!manualInput.trim() || isProcessing}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
                  >
                    <Send size={16} />
                  </button>
                </form>
                  {/* Status and Controls */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <span className={`flex items-center ${isSpeaking ? 'text-blue-600' : 'text-gray-500'}`}>
                      🤖 Sarah: {isSpeaking ? 'Speaking...' : isProcessing ? 'Thinking...' : 'Ready'}
                    </span>
                    <span className={`flex items-center ${isListening ? 'text-green-600' : 'text-gray-500'}`}>
                      🎤 You: {isListening ? 'Listening...' : 'Ready'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Manual voice controls */}
                    {isSessionActive && (
                      <>
                        {!isListening ? (
                          <button
                            onClick={startListening}
                            disabled={isSpeaking || isProcessing}
                            className="text-xs bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-2 py-1 rounded"
                          >
                            🎤 Start Talking
                          </button>
                        ) : (
                          <button
                            onClick={stopListening}
                            className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          >
                            🔇 Stop Talking
                          </button>                        )}
                      </>
                    )}
                    <button
                      onClick={() => setDebugMode(!debugMode)}
                      className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                      title="Toggle debug info"
                    >
                      🐛
                    </button>
                    <span className="text-xs">Session: {sessionId?.slice(-8)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>        {/* Right Section: Chat History or Settings */}
        {(showChat || showSettings) && (
          <div className="w-1/3 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">
                {showSettings ? 'Voice Settings' : 'Conversation History'}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowChat(!showChat)}
                  className={`px-3 py-1 text-xs rounded ${showChat ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Chat
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`px-3 py-1 text-xs rounded ${showSettings ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  Voice
                </button>
              </div>
            </div>
            
            {showSettings ? (
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Voice Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Voice
                  </label>
                  <select
                    value={voiceSettings.voice?.name || ''}
                    onChange={(e) => {
                      const selectedVoice = availableVoices.find(v => v.name === e.target.value);
                      setVoiceSettings(prev => ({ ...prev, voice: selectedVoice }));
                    }}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    {availableVoices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Speech Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speaking Speed: {voiceSettings.rate.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={voiceSettings.rate}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, rate: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Slow</span>
                    <span>Natural</span>
                    <span>Fast</span>
                  </div>
                </div>
                
                {/* Pitch */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Pitch: {voiceSettings.pitch.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={voiceSettings.pitch}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, pitch: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Lower</span>
                    <span>Natural</span>
                    <span>Higher</span>
                  </div>
                </div>
                
                {/* Volume */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume: {Math.round(voiceSettings.volume * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.3"
                    max="1.0"
                    step="0.05"
                    value={voiceSettings.volume}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
                  {/* Test Voice */}
                <button
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance("Hi there! I'm Sarah, your AI interviewer. This is how I'll sound during our conversation. I'm excited to learn more about your experience and discuss this opportunity with you!");
                    utterance.voice = voiceSettings.voice;
                    utterance.rate = voiceSettings.rate;
                    utterance.pitch = voiceSettings.pitch;
                    utterance.volume = voiceSettings.volume;
                    speechSynthesis.speak(utterance);
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-sm"
                >
                  🎤 Test Voice
                </button>
                
                {/* Presets */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Presets
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setVoiceSettings({ rate: 0.85, pitch: 0.95, volume: 0.9, voice: voiceSettings.voice })}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      Professional (Recommended)
                    </button>
                    <button
                      onClick={() => setVoiceSettings({ rate: 0.75, pitch: 0.9, volume: 0.8, voice: voiceSettings.voice })}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      Calm & Reassuring
                    </button>
                    <button
                      onClick={() => setVoiceSettings({ rate: 0.95, pitch: 1.05, volume: 0.9, voice: voiceSettings.voice })}
                      className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      Energetic & Friendly
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {conversationHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.speaker === 'interviewer' 
                        ? 'bg-blue-100 text-blue-900' 
                        : 'bg-green-100 text-green-900 ml-auto'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {msg.speaker === 'interviewer' ? '🤖 Sarah' : '👤 You'}
                    </div>
                    <div className="text-sm">{msg.message}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <footer className="flex items-center justify-center p-3 bg-white shadow-lg z-10 border-t border-gray-100">
        <div className="flex space-x-4">
          {/* Mic Toggle */}
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={`flex flex-col items-center p-3 rounded-md w-28 ${isMicOn ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'} text-gray-800 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 ${isMicOn ? 'focus:ring-gray-400' : 'focus:ring-red-400'}`}
          >
            {isMicOn ? (
              <Mic size={24} />
            ) : (
              <MicOff size={24} />
            )}
            <span className="text-xs mt-1">Mic</span>
          </button>

          {/* Camera Toggle */}
          <button
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`flex flex-col items-center p-3 rounded-md w-28 ${isCameraOn ? 'bg-gray-200 hover:bg-gray-300' : 'bg-red-500 hover:bg-red-600'} text-gray-800 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 ${isCameraOn ? 'focus:ring-gray-400' : 'focus:ring-red-400'}`}
          >
            {isCameraOn ? (
              <Video size={24} />
            ) : (
              <VideoOff size={24} />
            )}
            <span className="text-xs mt-1">Camera</span>
          </button>

          {/* Voice Controls */}
          {isSessionActive && (
            <>
              {/* Start/Stop Speaking */}
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isSpeaking || isProcessing}
                className={`flex flex-col items-center p-3 rounded-md w-32 ${
                  isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } text-white transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isListening ? (
                  <MicOff size={24} />
                ) : (
                  <Mic size={24} />
                )}
                <span className="text-xs mt-1">
                  {isListening ? 'Stop Talking' : 'Start Talking'}
                </span>
              </button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};

export default ConversationalInterviewRoom;
