// src/components/home/SuccessStories.js

'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, Trophy, Zap, Target, Users, ArrowRight } from 'lucide-react';
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

const FuturisticSuccessStories = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);
  const timerRef = useRef(null);

  const successStories = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "Software Engineer",
      company: "Google",
      quote: "Koluvu helped me land my dream job at Google within 2 months of searching! The AI-powered resume screening gave me the edge I needed.",
      avatar: "/stories_images/Rahul_Sharma.jpg",
      stats: { applications: 45, interviews: 12, offers: 3 },
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "Product Manager",
      company: "Amazon",
      quote: "The job recommendations were spot on. Found the perfect role for my skills and the mock interviews prepared me perfectly.",
      avatar: "/stories_images/Priya_Patel.jpg",
      stats: { applications: 32, interviews: 8, offers: 2 },
      gradient: "from-purple-400 to-pink-500"
    },
    {
      id: 3,
      name: "Amit Singh",
      role: "Data Scientist",
      company: "Microsoft",
      quote: "The interview prepration resources were invaluable for my career transition. The AI feedback helped me improve significantly.",
      avatar: "/stories_images/Amit_Singh.jpg",
      stats: { applications: 28, interviews: 10, offers: 4 },
      gradient: "from-green-400 to-emerald-500"
    },
    {
      id: 4,
      name: "Neha Gupta",
      role: "UX Designer",
      company: "Adobe",
      quote: "Koluvu's networking features connected me with the right people in my industry. The platform is truly revolutionary.",
      avatar: "/stories_images/Neha_Gupta.jpg",
      stats: { applications: 38, interviews: 15, offers: 5 },
      gradient: "from-orange-400 to-red-500"
    },
    {
      id: 5,
      name: "Sarah",
      role: "DevOps Engineer",
      company: "Netflix",
      quote: "From resume building to job offers, Koluvu was with me every step of the way. The support was incredible throughout.",
      avatar: "/stories_images/Sarah.jpg",
      stats: { applications: 42, interviews: 9, offers: 2 },
      gradient: "from-indigo-400 to-purple-500"
    }
  ];

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

  const nextStory = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % successStories.length);
      setIsAnimating(false);
    }, 300);
  }, [successStories.length]);

  const prevStory = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + successStories.length) % successStories.length);
      setIsAnimating(false);
    }, 300);
  }, [successStories.length]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(nextStory, 6000);
  }, [nextStory]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetTimer]);

  const currentStory = successStories[currentIndex];

  return (
    <div 
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
    >
      {/* Animated Background */}
      {/* Geometric Shapes - Adjusted for mobile */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          
          {/* Left Side - Story Card */}
          <div className={`w-full transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="relative">
              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${currentStory.gradient} rounded-3xl blur opacity-75 animate-pulse`}></div>
              
              <div className={`relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 md:p-8 transform transition-all duration-500 ${
                isAnimating ? 'scale-95 opacity-70' : 'scale-100 opacity-100'
              }`}>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Trophy className="w-5 h-5 md:w-6 md:h-6 text-yellow-400" />
                    <span className="text-yellow-400 font-semibold text-sm md:text-base">Success Story</span>
                  </div>
                  <div className="text-slate-400 text-xs md:text-sm">#{currentStory.id}</div>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="relative">
                    <div className={`absolute -inset-2 bg-gradient-to-r ${currentStory.gradient} rounded-full blur opacity-60 animate-pulse`}></div>
                    <Image
                      src={currentStory.avatar}
                      alt={currentStory.name}
                      width={80}
                      height={80}
                      className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white/20 object-cover"
                      onError={(e) => {
                        e.target.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face`;
                      }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-6 md:h-6 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{currentStory.name}</h3>
                    <p className="text-slate-300 text-sm md:text-base mb-2">{currentStory.role}</p>
                    <div className={`inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 bg-gradient-to-r ${currentStory.gradient} rounded-full text-white text-xs md:text-sm font-medium`}>
                      <Zap className="w-3 h-3 md:w-4 md:h-4" />
                      {currentStory.company}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative mb-6 md:mb-8">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 md:w-8 md:h-8 text-purple-400/50" />
                  <blockquote className="text-base md:text-lg text-slate-200 leading-relaxed pl-4 md:pl-6 italic">
                    &quot;{currentStory.quote}&quot;
                  </blockquote>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
                  {[
                    { label: 'Applications', value: currentStory.stats.applications, icon: <Target className="w-3 h-3 md:w-4 md:h-4" /> },
                    { label: 'Interviews', value: currentStory.stats.interviews, icon: <Users className="w-3 h-3 md:w-4 md:h-4" /> },
                    { label: 'Offers', value: currentStory.stats.offers, icon: <Trophy className="w-3 h-3 md:w-4 md:h-4" /> }
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center p-2 md:p-3 bg-slate-900/50 rounded-xl border border-slate-700/50">
                      <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
                        {stat.icon}
                        <span className="font-bold text-sm md:text-xl">{stat.value}</span>
                      </div>
                      <div className="text-slate-400 text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current animate-twinkle" style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className={`w-full transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 md:gap-3 mb-3 md:mb-4 px-3 md:px-4 py-1 md:py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30 backdrop-blur-sm">
                <Trophy className="w-6 h-6 md:w-8 md:h-12 text-purple-400" />
                <span className="text-purple-300 text-lg md:text-2xl font-medium">Career Transformations</span>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-300 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight">
                Success
                <span className="text-3xl md:text-5xl lg:text-6xl text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text">
                &nbsp;Stories
                </span>
              </h1>
              
              <p className="text-slate-300 text-base md:text-lg lg:text-xl leading-relaxed max-w-lg">
                Discover how professionals transformed their careers with our cutting-edge platform and AI-powered tools.
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
              <button
                onClick={prevStory}
                className="p-2 md:p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-xl transition-all duration-200 hover:scale-105 group"
              >
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-white" />
              </button>
              
              <div className="flex-1 flex items-center gap-1 md:gap-2">
                {successStories.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      idx === currentIndex 
                        ? `bg-gradient-to-r ${currentStory.gradient} flex-1` 
                        : 'bg-slate-600 w-4 md:w-8'
                    }`}
                  />
                ))}
              </div>
              
              <button
                onClick={nextStory}
                className="p-2 md:p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/50 rounded-xl transition-all duration-200 hover:scale-105 group"
              >
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate-300 group-hover:text-white" />
              </button>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-2 gap-2 md:gap-4 mb-6 md:mb-8">
              {[
                { title: "AI Matching", desc: "Smart job matches", icon: <Zap className="w-4 h-4 md:w-5 md:h-5" /> },
                { title: "Interview Prepration", desc: "Mock interviews", icon: <Users className="w-4 h-4 md:w-5 md:h-5" /> },
                { title: "Resume Tools", desc: "AI-enhanced", icon: <Target className="w-4 h-4 md:w-5 md:h-5" /> },
                { title: "Career Growth", desc: "Development", icon: <Trophy className="w-4 h-4 md:w-5 md:h-5" /> }
              ].map((feature, idx) => (
                <div 
                  key={idx}
                  className="p-2 md:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-cyan-400 mb-1 md:mb-2">{feature.icon}</div>
                  <h4 className="text-white font-semibold text-xs md:text-sm mb-1">{feature.title}</h4>
                  <p className="text-slate-400 text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button className="group flex items-center justify-center md:justify-start gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25 text-sm md:text-base">
              Start Your Success Story
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
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

        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
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

        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }

        @media (max-width: 440px) {
          .text-3xl.md\:text-5xl.lg\:text-6xl {
            font-size: 2.5rem;
            line-height: 1.2;
          }
        }
      `}</style>
    </div>
  );
};

export default FuturisticSuccessStories;
