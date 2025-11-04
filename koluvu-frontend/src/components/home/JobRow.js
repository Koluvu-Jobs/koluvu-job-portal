// src/components/home/JobRow.js

'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  ArrowRight, 
  Briefcase, 
  Zap, 
  Star,
  Users,
  Building,
  Sparkles,
  Heart,
  ExternalLink,
  Eye
} from 'lucide-react';

const ParticleEffect = ({ isVisible }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!isVisible) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
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
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [isVisible]);
  
  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

const JobCard = ({ job, index, onHover, onLeave, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const cardRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover(index);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    onLeave();
  };
  
  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);
    onClick(job);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };
  
  const getIconByType = (type) => {
    switch (type.toLowerCase()) {
      case 'full-time': return <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'part-time': return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'internship': return <Users className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'contract': return <Building className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Briefcase className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'full-time': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'part-time': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'internship': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'contract': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };
  
  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/70 backdrop-blur-xl border border-slate-700/50 transition-all duration-700 transform cursor-pointer min-h-[200px] sm:min-h-[240px] ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
      } ${
        isClicked ? 'scale-95' : 'hover:scale-[1.02]'
      } ${
        isHovered ? 'border-blue-500/50 shadow-2xl shadow-blue-500/10' : ''
      }`}
      style={{ 
        animationDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Enhanced Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md ${
        isHovered ? 'animate-pulse' : ''
      }`}></div>
      
      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/50 via-purple-500/50 to-cyan-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
           style={{ 
             background: 'linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)',
             animation: isHovered ? 'shimmer 2s ease-in-out infinite' : 'none'
           }}>
      </div>

      {/* Badge */}
      {job.badge && (
        <div className="absolute top-3 right-3 z-20">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm transform transition-all duration-300 ${
            job.badge === 'New' ? 'bg-green-500/90 text-white' :
            job.badge === 'Hot' ? 'bg-red-500/90 text-white' :
            'bg-yellow-500/90 text-white'
          } ${isHovered ? 'scale-110 rotate-3' : ''}`}>
            {job.badge === 'New' && <Sparkles className="w-3 h-3" />}
            {job.badge === 'Hot' && <Zap className="w-3 h-3" />}
            {job.badge}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="absolute top-3 left-3 z-20">
        <button
          onClick={handleSave}
          className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform ${
            isSaved 
              ? 'bg-red-500/90 text-white scale-110' 
              : 'bg-slate-700/80 text-slate-300 hover:bg-slate-600/80 hover:scale-110'
          } ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <Heart className={`w-3 h-3 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>
      
      <div className="relative p-3 sm:p-4 md:p-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          {/* Company Logo */}
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-all duration-500 shadow-lg">
            {job.logo ? (
              <Image
                src={job.logo}
                alt={job.company}
                fill
                sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                className="object-contain p-2 transition-all duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <Building className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-slate-400 transition-colors duration-300 group-hover:text-blue-400" />
            )}
            
            {/* Enhanced Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
              isHovered ? 'shadow-lg shadow-blue-500/25' : ''
            }`}></div>
          </div>
          
          {/* Job Info */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-bold text-sm sm:text-base md:text-lg text-white mb-1 group-hover:text-blue-300 transition-colors duration-300 leading-tight ${
              job.titleStyle || ''
            }`} style={{ fontSize: '12px' }}>
              {job.title}
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base mb-2 font-medium truncate group-hover:text-slate-200 transition-colors duration-300" style={{ fontSize: '12px' }}>
              {job.company}
            </p>
          </div>
        </div>
        
        {/* Enhanced Job Type Badge - Moved to left */}
        <div className="mb-3">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${getTypeColor(job.type)} ${
            isHovered ? 'scale-105 shadow-lg' : ''
          }`}>
            {getIconByType(job.type)}
            <span className="font-semibold">{job.type}</span>
          </div>
        </div>
        
        {/* Job Details */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm group-hover:text-slate-200 transition-colors duration-300">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 flex-shrink-0" />
            <span className="truncate font-medium">{job.location}</span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-300 text-xs sm:text-sm group-hover:text-slate-200 transition-colors duration-300">
            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-green-400 flex-shrink-0" />
            <span className="truncate font-semibold text-green-300">{job.salary}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 px-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 group/btn text-xs shadow-lg hover:shadow-xl" style={{ fontSize: '10px' }}>
            <span className="flex items-center justify-center gap-2">
              Apply Now
              <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </span>
          </button>
          
          <button className="p-2 rounded-xl bg-slate-700/80 hover:bg-slate-600/80 text-slate-300 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95">
            <Eye className="w-3 h-3" />
          </button>
        </div>

        {/* Quick Actions on Hover */}
        <div className={`absolute bottom-16 sm:bottom-20 left-4 right-4 flex gap-2 transition-all duration-500 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}>
          <div className="flex-1 h-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full"></div>
        </div>
      </div>
      
      {/* Enhanced Hover Animation Dots */}
      <div className={`absolute top-2 left-2 w-2 h-2 bg-blue-400 rounded-full transition-all duration-300 ${
        isHovered ? 'opacity-100 animate-ping' : 'opacity-0'
      }`}></div>
      <div className={`absolute bottom-2 right-2 w-2 h-2 bg-purple-400 rounded-full transition-all duration-500 ${
        isHovered ? 'opacity-100 animate-ping' : 'opacity-0'
      }`} 
      style={{ animationDelay: '0.2s' }}></div>
      <div className={`absolute top-1/2 right-2 w-1.5 h-1.5 bg-cyan-400 rounded-full transition-all duration-700 ${
        isHovered ? 'opacity-100 animate-pulse' : 'opacity-0'
      }`} 
      style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default function JobRow({ title, icon, jobs, className }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
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
  
  const handleCardHover = (index) => {
    setHoveredIndex(index);
  };
  
  const handleCardLeave = () => {
    setHoveredIndex(null);
  };
  
  const handleCardClick = (job) => {
    console.log('Job clicked:', job);
    // Handle job application logic here
  };
  
  const getIconComponent = (iconName) => {
    const iconMap = {
      'user-graduate': <Users className="w-5 h-5 md:w-6 md:h-6" />,
      'user-tie': <Briefcase className="w-5 h-5 md:w-6 md:h-6" />,
      'laptop-house': <Building className="w-5 h-5 md:w-6 md:h-6" />,
      'briefcase': <Briefcase className="w-5 h-5 md:w-6 md:h-6" />,
      'clock': <Clock className="w-5 h-5 md:w-6 md:h-6" />
    };
    return iconMap[iconName] || <Briefcase className="w-5 h-5 md:w-6 md:h-6" />;
  };
  
  return (
    <div 
      ref={sectionRef}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 transition-all duration-1000 ${className} ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
      }`}
    >
      {/* Background Particles */}
      <ParticleEffect isVisible={isVisible} />
      
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 opacity-70"></div>
      
      {/* Animated Geometric Shapes */}
      <div className="absolute top-4 right-4 w-8 h-8 md:w-12 md:h-12 border-2 border-blue-400/30 rotate-45 animate-spin-slow"></div>
      <div className="absolute bottom-4 left-4 w-4 h-4 md:w-6 md:h-6 bg-purple-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-8 w-3 h-3 bg-cyan-400/30 rotate-45 animate-bounce"></div>
      
      <div className="relative p-4 sm:p-6 lg:p-8">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform transition-all duration-500 hover:scale-110 hover:rotate-6">
              {getIconComponent(icon)}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white flex items-center gap-3 mb-1" style={{ fontSize: '16px' }}>
                {title}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current animate-twinkle" />
                  <span className="text-sm md:text-base text-slate-400 font-medium">({jobs.length})</span>
                </div>
              </h3>
              <p className="text-slate-400 text-sm md:text-base" style={{ fontSize: '14px' }}>Latest opportunities in this category</p>
            </div>
          </div>
          
          <a 
            href="/jobs" 
            className="group flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/40 hover:to-purple-600/40 text-blue-300 hover:text-white rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 text-sm md:text-base backdrop-blur-sm"
          >
            <span className="font-semibold">View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
        </div>

        {/* Enhanced Jobs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {jobs.map((job, index) => (
            <JobCard
              key={job.id || index}
              job={job}
              index={index}
              onHover={handleCardHover}
              onLeave={handleCardLeave}
              onClick={handleCardClick}
            />
          ))}
        </div>
        
        {/* Enhanced Bottom Stats */}
        <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-slate-700/50">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm md:text-base">
            <div className="flex items-center gap-2 text-slate-300 hover:text-slate-200 transition-colors duration-300 cursor-pointer">
              <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">New jobs daily</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 hover:text-slate-200 transition-colors duration-300 cursor-pointer">
              <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <span className="font-medium">AI-matched opportunities</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 hover:text-slate-200 transition-colors duration-300 cursor-pointer">
              <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <span className="font-medium">Verified employers</span>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.2); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
