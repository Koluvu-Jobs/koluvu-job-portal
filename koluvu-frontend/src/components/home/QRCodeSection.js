// src/components/home/QRCodeSection.js

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Smartphone, Download, ArrowRight, Zap, Users, Target, Trophy } from 'lucide-react';
import Image from 'next/image';

const ParticleField = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 20 : 40;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

const QRCodeSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleQRScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div 
      ref={sectionRef}
      className="relative min-h-screen bg-slate-50 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 via-white/30 to-slate-100/50"></div>
        <ParticleField />
      </div>
      
      {/* Geometric Shapes - Hidden on mobile */}
      <div className="hidden md:block absolute top-20 left-10 w-24 md:w-32 h-24 md:h-32 border border-orange-200 rotate-45 animate-spin-slow"></div>
      <div className="hidden md:block absolute bottom-20 right-10 w-20 md:w-24 h-20 md:h-24 bg-orange-100 rounded-full animate-bounce-slow"></div>
      <div className="hidden md:block absolute top-1/2 right-1/4 w-12 md:w-16 h-12 md:h-16 bg-slate-100 transform rotate-12 animate-float"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-16 items-center">
          
          {/* Left Side - Content */}
          <div className="w-full lg:w-1/2">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              
              {/* Header */}
              <div className="mb-6 md:mb-8">
                <div className="inline-flex items-center gap-2 md:gap-3 mb-3 md:mb-4 px-3 md:px-4 py-1 md:py-2 bg-orange-50 rounded-full border border-orange-200">
                  <QrCode className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                  <span className="text-orange-600 text-xs md:text-sm font-medium">Mobile Access</span>
                </div>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 md:mb-6 leading-tight">
                  Take Your Career
                  <span className="text-3xl md:text-5xl lg:text-6xl text-orange-500">
                    &nbsp;On The Go
                  </span>
                </h1>
                
                <p className="text-slate-600 text-base md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-8">
                  Access Koluvu&apos;s powerful job search platform anywhere, anytime. Scan the QR code to unlock your professional potential with our mobile-optimized experience.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
                {[
                  { icon: <Smartphone className="w-5 h-5 md:w-6 md:h-6" />, title: "Mobile Ready", desc: "Optimized" },
                  { icon: <Zap className="w-5 h-5 md:w-6 md:h-6" />, title: "Instant Access", desc: "Quick Search" },
                  { icon: <Users className="w-5 h-5 md:w-6 md:h-6" />, title: "Real-time", desc: "Alerts" },
                  { icon: <Target className="w-5 h-5 md:w-6 md:h-6" />, title: "AI Matching", desc: "Smart Recs" }
                ].map((feature, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 md:p-4 bg-white border border-slate-200 rounded-xl hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 animate-fade-in-up`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="text-orange-500 mb-1 md:mb-2">{feature.icon}</div>
                    <h3 className="text-slate-900 font-semibold text-xs md:text-sm">{feature.title}</h3>
                    <p className="text-slate-600 text-xs">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
                {[
                  { value: "10K+", label: "Daily Users" },
                  { value: "95%", label: "Success" },
                  { value: "24/7", label: "Support" }
                ].map((stat, idx) => (
                  <div 
                    key={idx}
                    className="text-center p-2 md:p-3 bg-white rounded-xl border border-slate-200"
                  >
                    <div className="text-xl md:text-2xl font-bold text-orange-500 mb-1">{stat.value}</div>
                    <div className="text-slate-600 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button className="group flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-orange-500/25 text-sm md:text-base">
                <Download className="w-4 h-4 md:w-5 md:h-5" />
                Download Mobile App
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side - QR Code */}
          <div className="w-full lg:w-1/2 flex justify-center mt-8 md:mt-0">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <div className="relative">
                
                {/* Outer Glow Ring */}
                <div className={`absolute -inset-4 md:-inset-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full blur-xl opacity-30 ${isScanning ? 'animate-ping' : 'animate-pulse'}`}></div>
                
                {/* Main QR Container */}
                <div className="relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-lg">
                  
                  {/* Header */}
                  <div className="text-center mb-4 md:mb-6">
                    <div className="inline-flex items-center gap-2 mb-2 md:mb-3 px-2 md:px-3 py-1 bg-orange-50 rounded-full border border-orange-200">
                      <QrCode className="w-3 h-3 md:w-4 md:h-4 text-orange-500" />
                      <span className="text-orange-600 text-xs md:text-sm font-medium">Scan to Access</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1 md:mb-2">Quick Access Portal</h3>
                    <p className="text-slate-600 text-xs md:text-sm">Scan with your phone camera</p>
                  </div>

                  {/* QR Code with Glow Effect */}
                  <div className="relative group cursor-pointer" onClick={handleQRScan}>
                    <div className={`absolute -inset-2 md:-inset-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500 ${isScanning ? 'opacity-50 animate-pulse' : ''}`}></div>
                    
                    <div className="relative bg-white p-3 md:p-4 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                      <Image
                        src="/images/qrcode.png"
                        alt="QR Code - Scan to access Koluvu mobile"
                        width={200}
                        height={200}
                        className="mx-auto rounded-lg w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
                      />
                      
                      {/* Scanning Animation Overlay */}
                      {isScanning && (
                        <div className="absolute inset-0 bg-orange-400/20 rounded-2xl flex items-center justify-center">
                          <div className="w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-scan"></div>
                        </div>
                      )}
                    </div>

                    {/* Corner Decorations */}
                    <div className="absolute -top-1 -left-1 md:-top-2 md:-left-2 w-4 h-4 md:w-6 md:h-6 border-l-2 border-t-2 border-orange-400 rounded-tl-lg"></div>
                    <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 border-r-2 border-t-2 border-orange-400 rounded-tr-lg"></div>
                    <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 w-4 h-4 md:w-6 md:h-6 border-l-2 border-b-2 border-orange-400 rounded-bl-lg"></div>
                    <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-4 h-4 md:w-6 md:h-6 border-r-2 border-b-2 border-orange-400 rounded-br-lg"></div>
                  </div>

                  {/* Instructions */}
                  <div className="mt-4 md:mt-6 text-center">
                    <div className="flex items-center justify-center gap-1 md:gap-2 text-slate-600 text-xs md:text-sm mb-2 md:mb-3">
                      <Smartphone className="w-3 h-3 md:w-4 md:h-4" />
                      <span>Point your camera at the QR code</span>
                    </div>
                    
                    <div className="text-xs text-slate-500">
                      Compatible with all smartphones
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center justify-center mt-3 md:mt-4">
                    <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 bg-green-500/20 border border-green-400/30 rounded-full">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 text-xs font-medium">Active & Ready</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 md:-top-4 md:-right-4 w-5 h-5 md:w-8 md:h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full animate-bounce-slow opacity-80"></div>
                <div className="absolute -bottom-2 -left-2 md:-bottom-4 md:-left-4 w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-float opacity-60"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-12 md:mt-16 text-center">
          <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-6 bg-white border border-orange-200 rounded-xl md:rounded-2xl shadow-lg">
              <div className="text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1 md:mb-2">Ready to Transform Your Career?</h3>
                <p className="text-slate-600 text-sm md:text-base">Join thousands of professionals who found their dream jobs with Koluvu</p>
              </div>
              <button className="px-6 md:px-8 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-orange-500/25 whitespace-nowrap text-sm md:text-base">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(12deg); }
          50% { transform: translateY(-10px) rotate(12deg); }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite;
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default QRCodeSection;
