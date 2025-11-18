// src/app/career-guidance/components/CareerGuidanceHero.js

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Compass,
  ArrowRight,
  Sparkles,
  Brain,
  Rocket,
} from "lucide-react";

const ParticleField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
};

export default function CareerGuidanceHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const sectionRef = useRef(null);

  const stats = [
    {
      value: "10K+",
      label: "Career Paths Mapped",
      icon: <Compass className="w-5 h-5" />,
    },
    {
      value: "95%",
      label: "Success Rate",
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      value: "50K+",
      label: "Professionals Guided",
      icon: <Users className="w-5 h-5" />,
    },
    {
      value: "24/7",
      label: "AI-Powered Support",
      icon: <Brain className="w-5 h-5" />,
    },
  ];

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Personalized Career Mapping",
      description:
        "AI-driven analysis of your skills, interests, and goals to create a customized career roadmap.",
      color: "from-cyan-400 to-blue-500",
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Skill Assessment & Development",
      description:
        "Comprehensive assessments to identify strengths and areas for improvement with targeted learning paths.",
      color: "from-purple-400 to-pink-500",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Mentorship",
      description:
        "Connect with industry professionals and experienced mentors for personalized guidance.",
      color: "from-green-400 to-emerald-500",
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Achievement Tracking",
      description:
        "Set goals, track progress, and celebrate milestones on your career journey.",
      color: "from-yellow-400 to-orange-500",
    },
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div ref={sectionRef} className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-cyan-600/10 animate-pulse"></div>
        <ParticleField />
      </div>

      {/* Geometric Shapes */}
      <div className="hidden sm:block absolute top-20 left-10 w-32 h-32 border border-cyan-400/30 rotate-45 animate-spin-slow"></div>
      <div className="hidden sm:block absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-bounce-slow"></div>
      <div className="hidden sm:block absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 transform rotate-12 animate-float"></div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-400/30 backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <span className="text-cyan-300 font-medium">
              AI-Powered Career Guidance
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
              Shape Your
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Career Future
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto mb-8">
            Discover your potential, explore career paths, and accelerate your
            professional growth with our comprehensive AI-driven career guidance
            platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 flex items-center gap-2">
              <Rocket className="w-5 h-5" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-cyan-400/50 text-cyan-300 font-semibold rounded-xl hover:bg-cyan-400/10 transition-all duration-300 backdrop-blur-sm">
              Explore Features
            </button>
          </div>
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: currentStat === index ? 1.05 : 1,
                opacity: 1,
              }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`text-center p-6 rounded-2xl backdrop-blur-sm border transition-all duration-500 ${
                currentStat === index
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50 shadow-lg shadow-cyan-500/25"
                  : "bg-slate-800/30 border-slate-700/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-cyan-400 mb-2">
                {stat.icon}
                <span className="text-2xl sm:text-3xl font-bold">
                  {stat.value}
                </span>
              </div>
              <div className="text-slate-300 text-sm sm:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500`}
              ></div>

              <div className="relative h-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-4 w-fit`}
                >
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-400/20 rounded-2xl">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Ready to Transform Your Career?
              </h3>
              <p className="text-slate-300 text-lg">
                Join thousands of professionals who have accelerated their
                careers with our guidance
              </p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-cyan-500/25 whitespace-nowrap flex items-center gap-2">
              <Target className="w-5 h-5" />
              Get Started Free
            </button>
          </div>
        </motion.div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(12deg);
          }
          50% {
            transform: translateY(-10px) rotate(12deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
