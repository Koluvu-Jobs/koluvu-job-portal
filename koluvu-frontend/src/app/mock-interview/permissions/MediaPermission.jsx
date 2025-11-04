// src/app/main/mock-interview/permissions/MediaPermission.jsx

"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

export default function MediaPermission() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const scriptId = searchParams.get('scriptId');
  
  const [cameraPermission, setCameraPermission] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [microphoneStream, setMicrophoneStream] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [microphoneError, setMicrophoneError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);

  // Auto-check permissions on load
  useEffect(() => {
    checkExistingPermissions();
  }, []);

  const checkExistingPermissions = async () => {
    try {
      const permissions = await navigator.permissions.query({ name: 'camera' });
      if (permissions.state === 'granted') {
        await enableCamera();
      }
    } catch (error) {
      console.log('Permission check not supported');
    }

    try {
      const permissions = await navigator.permissions.query({ name: 'microphone' });
      if (permissions.state === 'granted') {
        await enableMicrophone();
      }
    } catch (error) {
      console.log('Permission check not supported');
    }
  };
  const enableCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      setCameraStream(stream);
      setCameraPermission(true);
      
      // Ensure video element shows the stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Play the video to ensure it starts
        videoRef.current.play().catch(console.error);
      }
    } catch (error) {
      console.error('Camera access denied:', error);
      setCameraError('Camera access denied. You can continue without camera.');
      setCameraPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const enableMicrophone = async () => {
    try {
      setIsLoading(true);
      setMicrophoneError('');
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneStream(stream);
      setMicrophonePermission(true);
      
      // Test microphone briefly
      setTimeout(() => {
        stream.getTracks().forEach(track => track.stop());
      }, 1000);
    } catch (error) {
      console.error('Microphone access denied:', error);
      setMicrophoneError('Microphone access denied. This is required for the interview.');
      setMicrophonePermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCamera = () => {
    if (cameraPermission) {
      // Turn off camera
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraPermission(false);
      setCameraError('Camera disabled');
    } else {
      // Turn on camera
      enableCamera();
    }
  };

  const toggleMicrophone = () => {
    if (microphonePermission) {
      setMicrophonePermission(false);
      setMicrophoneError('Microphone disabled');
    } else {
      enableMicrophone();
    }
  };

  const joinInterview = () => {
    if (!microphonePermission) {
      setMicrophoneError('Microphone is required to join the interview');
      return;
    }

    // Clean up streams before navigation
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    if (microphoneStream) {
      microphoneStream.getTracks().forEach(track => track.stop());
    }

    if (sessionId && scriptId) {
      router.push(`/main/mock-interview/conversational-room?sessionId=${sessionId}&scriptId=${scriptId}`);
    } else {
      alert('Missing session information. Please restart from the beginning.');
    }
  };

  const goBack = () => {
    // Clean up streams
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    if (microphoneStream) {
      microphoneStream.getTracks().forEach(track => track.stop());
    }
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Mock Interview</h1>
                <p className="text-blue-100 text-sm">Camera and microphone setup</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <div className="text-sm font-medium">Step 2 of 3</div>
              <div className="text-xs text-blue-100">Permissions</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-100 h-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 w-2/3 transition-all duration-500"></div>
        </div>

        <div className="p-8">
          {/* Info Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Ready for your interview?</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Please allow access to your camera and microphone. We'll test your setup to ensure the best interview experience.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Camera Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Camera
                </h3>
                <span className="text-sm text-gray-500">Optional</span>
              </div>
              
              <div className="relative">
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                  {cameraPermission && cameraStream ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-sm">Camera preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={toggleCamera}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  cameraPermission
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Testing Camera...' : cameraPermission ? 'Camera Enabled ✓' : 'Enable Camera'}
              </button>              {cameraError && (
                <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
                  ⚠️ {cameraError}
                </p>
              )}
            </div>            {/* Microphone Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Microphone
                </h3>
                <span className="text-sm text-red-500 font-medium">Required</span>
              </div>

              <div className="relative">
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                        microphonePermission ? 'bg-green-100 scale-110' : 'bg-gray-200'
                      }`}>
                        <svg className={`w-10 h-10 transition-colors duration-300 ${
                          microphonePermission ? 'text-green-600' : 'text-gray-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      
                      <p className={`text-sm font-medium mb-2 transition-colors duration-300 ${
                        microphonePermission ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {microphonePermission ? 'Microphone Active' : 'Microphone Test'}
                      </p>
                      
                      {microphonePermission && (
                        <div className="flex items-center justify-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className="w-1 bg-green-500 rounded-full animate-pulse"
                              style={{
                                height: `${Math.random() * 16 + 8}px`,
                                animationDelay: `${i * 0.15}s`,
                                animationDuration: '1s'
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={toggleMicrophone}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  microphonePermission
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Testing Microphone...' : microphonePermission ? 'Microphone Enabled ✓' : 'Enable Microphone'}
              </button>

              {microphoneError && (
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                  ❌ {microphoneError}
                </p>
              )}
            </div>
          </div>

          {/* Flow Information */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              What happens next?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <div>
                  <p className="font-medium text-blue-900">Grant permissions</p>
                  <p className="text-blue-700">Allow camera and microphone access</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <div>
                  <p className="font-medium text-blue-900">Start interview</p>
                  <p className="text-blue-700">AI will ask personalized questions</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <div>
                  <p className="font-medium text-blue-900">Get feedback</p>
                  <p className="text-blue-700">Receive detailed performance analysis</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={goBack}
              className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              ← Back to Setup
            </button>
            
            <button
              onClick={joinInterview}
              disabled={!microphonePermission}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg"
            >
              {microphonePermission ? 'Start Interview →' : 'Enable Microphone to Continue'}
            </button>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your privacy is protected. Camera and microphone access is only used during the interview and never stored or shared.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
