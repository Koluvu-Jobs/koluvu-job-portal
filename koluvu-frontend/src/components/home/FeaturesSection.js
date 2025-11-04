// src/components/home/FeaturesSection.js

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ShieldUser as UserShield, Bot, Compass, Bell, Zap, Filter, Sparkles, Target, Users, Shield, Clock, TrendingUp } from 'lucide-react';

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
    const particleCount = window.innerWidth < 768 ? 30 : 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
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
        ctx.fillStyle = `rgba(139, 69, 255, ${particle.opacity})`;
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

const FuturisticFeaturesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
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

  const features = [
    {
      icon: <UserShield className="w-6 h-6" />,
      title: "Authentic Profiles with Real Connections",
      description: "Koluvu verifies all candidate and employer profiles to establish trust and remove false listings. It provides a safe environment where real opportunities are matched with competent talent.",
      color: "from-cyan-400 to-blue-500",
      bgColor: "from-cyan-500/10 to-blue-500/10",
      stats: "99.9% Verified",
      badge: "Trusted"
    },
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Smarter Hiring & Job Searching Using AI-Powered Tools",
      description: "With intelligent resume builders, AI-powered mock interviews, and career recommendations, Koluvu harnesses sophisticated technology to support candidates and employers alike.",
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      stats: "95% Accuracy",
      badge: "AI-Powered"
    },
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Seamless and User-Centric Experience",
      description: "Navigation is easy with our clean, intuitive interface. Posting a job or finding a job to apply for is a breeze — hassle-free from the moment you start your day.",
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
      stats: "4.9/5 Rating",
      badge: "Intuitive"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Real-Time Alerts & Instant Updates",
      description: "Don't let a chance slip by. Koluvu alerts you instantly on job applications, interviews, new vacancies, and candidate matches to keep you updated at each step.",
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
      stats: "< 1min Alerts",
      badge: "Real-time"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Quicker Hiring within 24-Hour Turnaround",
      description: "Time is of the essence. Koluvu accelerates the hiring process by linking employers to qualified talent in just 24 hours — minimizing delays and accelerating recruitment.",
      color: "from-indigo-400 to-purple-500",
      bgColor: "from-indigo-500/10 to-purple-500/10",
      stats: "24hr Process",
      badge: "Lightning Fast"
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Advanced Candidate Filtering & ATS",
      description: "Our integrated Applicant Tracking System enables recruiters to shortlist the best-fit candidates instantly based on intelligent filtering of skills, experience, and jobs — saving time spent on manual screening.",
      color: "from-teal-400 to-cyan-500",
      bgColor: "from-teal-500/10 to-cyan-500/10",
      stats: "80% Time Saved",
      badge: "Smart Filter"
    }
  ];

  return (
    <div 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-pulse"></div>
        <ParticleField />
      </div>
      
      {/* Geometric Shapes - Reduced on mobile */}
      <div className="hidden sm:block absolute top-20 left-10 w-32 h-32 border border-cyan-400/30 rotate-45 animate-spin-slow"></div>
      <div className="hidden sm:block absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce-slow"></div>
      <div className="hidden sm:block absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 transform rotate-12 animate-float"></div>
      <div className="hidden sm:block absolute bottom-1/3 right-1/3 w-20 h-20 border border-purple-400/30 rounded-full animate-float"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Header Section */}
        <div className={`text-center mb-8 sm:mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 mb-4 sm:mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-400/30 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <span className="text-cyan-300 text-sm sm:text-base font-medium">Platform Features</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
            Why Choose
            <span className="text-5xl text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
              &nbsp;Koluvu?
            </span>
          </h1>
          
          <p className="text-slate-300 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed max-w-3xl mx-auto px-4">
            Discover the cutting-edge features that make our platform the ultimate destination for career advancement and talent acquisition.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group transform transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative h-full">
                {/* Glow Effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500`}></div>
                
                <div className="relative h-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:bg-slate-800/70 transition-all duration-300">
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white transform group-hover:scale-110 transition-transform duration-300`}>
                      {React.cloneElement(feature.icon, { className: "w-5 h-5 sm:w-6 sm:h-6" })}
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r ${feature.bgColor} rounded-full border border-white/10`}>
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-300 text-xs font-medium">{feature.badge}</span>
                      </div>
                      <div className="text-slate-400 text-xs mt-1">{feature.stats}</div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6">
                    {feature.description}
                  </p>

                  {/* Feature Highlights */}
                  <div className="grid grid-cols-3 gap-1 sm:gap-2 mt-auto">
                    {[
                      { icon: <Target className="w-3 h-3" />, label: "Precise" },
                      { icon: <Shield className="w-3 h-3" />, label: "Secure" },
                      { icon: <TrendingUp className="w-3 h-3" />, label: "Efficient" }
                    ].map((highlight, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-1 p-1 sm:p-2 bg-slate-900/50 rounded-lg border border-slate-700/30"
                      >
                        <div className="text-cyan-400">{highlight.icon}</div>
                        <span className="text-slate-400 text-xs">{highlight.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Hover Animation Bar */}
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color} rounded-b-2xl transition-all duration-500 ${
                    hoveredCard === index ? 'w-full' : 'w-0'
                  }`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats Section */}
        <div className={`mt-8 sm:mt-16 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 px-2 sm:px-0">
            {[
              { value: "100K+", label: "Active Users", icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
              { value: "50K+", label: "Jobs Posted", icon: <Target className="w-4 h-4 sm:w-5 sm:h-5" /> },
              { value: "95%", label: "Success Rate", icon: <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> },
              { value: "24/7", label: "Support", icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" /> }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="text-center p-3 sm:p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm border border-slate-600/50 rounded-xl"
              >
                <div className="flex items-center justify-center gap-1 sm:gap-2 text-cyan-400 mb-1 sm:mb-2">
                  {stat.icon}
                  <span className="text-xl sm:text-2xl font-bold">{stat.value}</span>
                </div>
                <div className="text-slate-400 text-xs sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`mt-8 sm:mt-12 text-center transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-400/20 rounded-2xl">
            <div className="text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">Ready to Experience the Future?</h3>
              <p className="text-slate-300 text-sm sm:text-base">Join thousands who&apos;ve transformed their careers with our innovative platform</p>
            </div>
            <button className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-cyan-500/25 whitespace-nowrap text-sm sm:text-base">
              Get Started Now
            </button>
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
      `}</style>
    </div>
  );
};

export default FuturisticFeaturesSection;
