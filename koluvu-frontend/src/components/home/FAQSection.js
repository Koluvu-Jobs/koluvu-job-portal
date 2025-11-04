// src/components/home/FAQSection.js

"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronDown,
  HelpCircle,
  Zap,
  Users,
  Brain,
  Shield,
  Star,
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
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
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
        ctx.fillStyle = `rgba(139, 69, 255, ${particle.opacity})`;
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

const FuturisticFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
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

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is Koluvu Job Portal?",
      answer:
        "Koluvu is an advanced job portal connecting job seekers with employers. It offers job search, AI-powered mock interviews, resume screening, applicant tracking, and more to streamline the hiring process for both candidates and companies.",
      icon: <Zap className="w-5 h-5" />,
      color: "from-cyan-400 to-blue-500",
    },
    {
      question: "How do I register and apply for jobs?",
      answer:
        "Job seekers can sign up by providing basic details like name, email, and creating a password. Once registered, you can complete your profile, upload your resume, and start applying for jobs with just one click. Employers can post jobs after verifying their company details.",
      icon: <Users className="w-5 h-5" />,
      color: "from-purple-400 to-pink-500",
    },
    {
      question: "Is Koluvu free to use?",
      answer:
        "Basic job search and applications are completely free for job seekers. Employers can post a limited number of jobs for free, while premium features like AI Resume Screening, Featured Listings, and Advanced Analytics require a subscription.",
      icon: <Star className="w-5 h-5" />,
      color: "from-yellow-400 to-orange-500",
    },
    {
      question:
        "How does AI-powered resume screening and mock interviews work?",
      answer:
        "Our AI analyzes your resume against job descriptions to suggest improvements and increase visibility. The mock interview simulator asks common interview questions, analyzes your responses, and provides feedback on areas like confidence, clarity, and content.",
      icon: <Brain className="w-5 h-5" />,
      color: "from-green-400 to-emerald-500",
    },
    {
      question: "How can employers find and manage candidates?",
      answer:
        "Employers can post jobs, search our extensive resume database, use AI-powered screening to shortlist candidates, and manage the entire hiring process through our Applicant Tracking System (ATS) dashboard with features like interview scheduling and collaborative hiring.",
      icon: <Shield className="w-5 h-5" />,
      color: "from-indigo-400 to-purple-500",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
    >
      {/* Animated Background */}
      {/* Geometric Shapes - Reduced on mobile */}

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Side - Hero Content */}
          <div className="lg:w-1/2 lg:sticky lg:top-24">
            <div
              className={`transform transition-all duration-1000 ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-10 opacity-0"
              }`}
            >
              {/* Main Title */}
              <div className="text-center lg:text-left mb-6 sm:mb-8">
                <div className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-400/30 backdrop-blur-sm">
                  <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  <span className="text-cyan-300 text-xs sm:text-sm font-medium">
                    Support Center
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
                  Frequently Asked
                  <br />
                  <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-3xl sm:text-4xl lg:text-5xl xl:text-6xl">
                    Questions
                  </span>
                </h1>

                <p className="text-slate-300 text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
                  Discover everything you need to know about our cutting-edge
                  platform and advanced features.
                </p>
              </div>

              {/* Feature Cards */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {[
                  {
                    icon: <Brain className="w-5 h-5 sm:w-6 sm:h-6" />,
                    title: "AI-Powered",
                    desc: "Smart Solutions",
                  },
                  {
                    icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
                    title: "Lightning Fast",
                    desc: "Instant Results",
                  },
                  {
                    icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
                    title: "Secure",
                    desc: "Protected Data",
                  },
                  {
                    icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
                    title: "Community",
                    desc: "Global Network",
                  },
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className={`p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105 animate-fade-in-up`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="text-cyan-400 mb-1 sm:mb-2">
                      {feature.icon}
                    </div>
                    <h3 className="text-white font-semibold text-xs sm:text-sm">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-xxs sm:text-xs">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - FAQ Items */}
          <div className="lg:w-1/2 w-full">
            <div className="space-y-3 sm:space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`group transform transition-all duration-500 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "translate-x-10 opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    {/* Glow Effect */}
                    <div
                      className={`absolute -inset-0.5 bg-gradient-to-r ${faq.color} rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500`}
                    ></div>

                    <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden">
                      {/* Question Header */}
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-white/5 transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div
                            className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-r ${faq.color} text-white`}
                          >
                            {React.cloneElement(faq.icon, {
                              className: "w-4 h-4 sm:w-5 sm:h-5",
                            })}
                          </div>
                          <span className="text-white font-semibold text-sm sm:text-base lg:text-lg group-hover:text-cyan-300 transition-colors">
                            {faq.question}
                          </span>
                        </div>

                        <ChevronDown
                          className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-all duration-300 ${
                            activeIndex === index
                              ? "rotate-180 text-cyan-400"
                              : "group-hover:text-white"
                          }`}
                        />
                      </button>

                      {/* Answer Content */}
                      <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          activeIndex === index
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="p-4 sm:p-6 pt-0">
                          <div className="bg-slate-900/50 rounded-xl p-3 sm:p-4 border-l-4 border-gradient-to-b from-cyan-400 to-purple-400">
                            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-400/20 rounded-2xl text-center">
              <h3 className="text-white font-semibold text-lg sm:text-xl mb-1 sm:mb-2">
                Still have questions?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mb-3 sm:mb-4">
                Our support team is here to help you 24/7
              </p>
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-cyan-500/25 text-sm sm:text-base">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

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
            transform: translateY(0) rotate(12deg);
          }
          50% {
            transform: translateY(-10px) rotate(12deg);
          }
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

export default FuturisticFAQ;
