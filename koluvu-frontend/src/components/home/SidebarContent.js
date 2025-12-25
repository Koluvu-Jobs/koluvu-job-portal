// src/components/home/SidebarContent.js

"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFileAlt,
  FaGraduationCap,
  FaChartLine,
  FaQuestionCircle,
} from "react-icons/fa";
import {
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Zap,
  ArrowRight,
  Calendar,
  MapPin,
  ExternalLink,
} from "lucide-react";

// Floating particles animation component
const FloatingParticles = ({ count = 8, color = "blue" }) => {
  const containerRef = useRef(null);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute w-1 h-1 rounded-full bg-${color}-400/30 animate-pulse`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

// Enhanced image card with advanced animations
const AnimatedImageCard = ({ card, index, position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`group relative rounded-2xl shadow-lg transition-all duration-700 hover:shadow-2xl overflow-hidden mb-4 cursor-pointer transform hover:scale-[1.02] ${
        isVisible
          ? "translate-y-0 opacity-100"
          : position === "left"
          ? "-translate-x-10 opacity-0"
          : "translate-x-10 opacity-0"
      }`}
      style={{
        animationDelay: `${index * 200}ms`,
        transitionDelay: `${index * 100}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating particles on hover */}
      {isHovered && <FloatingParticles count={6} color="blue" />}

      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/20 group-hover:via-purple-400/20 group-hover:to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>

      {/* Main card content */}
      <div className="relative bg-white rounded-2xl overflow-hidden">
        {/* Image section with overlay effects */}
        <div className="relative w-full h-40 md:h-48 overflow-hidden">
          {/* Background shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>

          <Image
            src={card.src}
            alt={card.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
            priority
          />

          {/* Overlay with animated elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-medium">Explore Now</span>
              </div>
            </div>
          </div>

          {/* Animated corner accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-400/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
            <TrendingUp className="absolute top-2 right-2 w-4 h-4 text-white animate-bounce" />
          </div>
        </div>

        {/* Content section with enhanced styling */}
        <div
          className={`${card.gradient} p-4 text-white relative overflow-hidden`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 transform translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/10 transform -translate-x-12 translate-y-12"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold mb-1 group-hover:scale-105 transition-transform duration-300">
                  {card.title}
                </h3>
                <p className="text-xs font-medium opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                  {card.desc}
                </p>
              </div>

              {/* Animated action button */}
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0 hover:scale-110 cursor-pointer">
                <ArrowRight className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Progress bar animation */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/40 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced event card with scroll animations
const AnimatedEventCard = ({ event, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getBadgeStyle = (badge) => {
    switch (badge) {
      case "New":
        return "bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg shadow-green-400/25";
      case "Coming Soon":
        return "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-lg shadow-orange-400/25";
      case "Featured":
        return "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-400/25";
      default:
        return "bg-gradient-to-r from-blue-400 to-blue-500 text-white shadow-lg shadow-blue-400/25";
    }
  };

  return (
    <div
      ref={cardRef}
      className={`relative group p-3 md:p-4 hover:bg-slate-50 rounded-xl transition-all duration-500 border-b border-gray-100 last:border-0 cursor-pointer transform hover:scale-[1.02] ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
      style={{ animationDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover glow effect */}
      <div className="absolute -inset-1 bg-orange-50/50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

      <div className="relative">
        {/* Header with date and badge */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-blue-500 group-hover:text-blue-600 transition-colors" />
            <span className="font-medium text-blue-600 text-xs group-hover:text-blue-700 transition-colors">
              {event.date}
            </span>
          </div>
          {event.badge && (
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium transform group-hover:scale-105 transition-all duration-300 ${getBadgeStyle(
                event.badge
              )}`}
            >
              {event.badge}
              {isHovered && (
                <Sparkles className="inline w-3 h-3 ml-1 animate-pulse" />
              )}
            </span>
          )}
        </div>

        {/* Event title with animation */}
        <h4 className="font-semibold text-sm text-gray-900 mb-2 group-hover:text-gray-800 transition-colors duration-300">
          {event.title}
          <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500 mt-1"></div>
        </h4>

        {/* Location with icon */}
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-3 h-3 text-gray-500 group-hover:text-blue-500 transition-colors" />
          <p className="text-gray-700 text-xs group-hover:text-gray-800 transition-colors">
            {event.location}
          </p>
        </div>

        {/* Action link with enhanced animation */}
        <Link
          href={event.link}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-xs font-medium group-hover:gap-3 transition-all duration-300"
        >
          <span>Learn More</span>
          <div className="flex items-center">
            <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1 transition-transform duration-300" />
            {isHovered && (
              <ExternalLink className="h-3 w-3 ml-1 animate-bounce" />
            )}
          </div>
        </Link>

        {/* Progress indicator */}
        <div className="absolute left-0 top-0 w-1 h-0 bg-gradient-to-b from-orange-400 to-orange-500 group-hover:h-full transition-all duration-500 rounded-r-full"></div>
      </div>
    </div>
  );
};

// Enhanced quick link with micro-animations
const AnimatedQuickLink = ({ link, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const linkRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (linkRef.current) {
      observer.observe(linkRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={linkRef}
      href={link.path}
      className={`group relative flex items-center gap-3 md:gap-4 p-3 md:p-4 text-gray-800 hover:text-blue-600 rounded-xl transition-all duration-500 overflow-hidden cursor-pointer transform hover:scale-[1.02] ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50/0 via-orange-50/0 to-orange-50/0 group-hover:from-orange-50/80 group-hover:via-orange-50/40 group-hover:to-orange-50/80 transition-all duration-500"></div>

      {/* Animated border */}
      <div className="absolute inset-0 border border-transparent group-hover:border-blue-200/50 rounded-xl transition-all duration-500"></div>

      {/* Icon container with enhanced animations */}
      <div className="relative">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600 flex items-center justify-center group-hover:from-orange-500 group-hover:to-orange-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-3 group-hover:scale-110">
          {link.icon}

          {/* Pulse effect on hover */}
          {isHovered && (
            <div className="absolute inset-0 rounded-xl bg-orange-400/30 animate-ping"></div>
          )}
        </div>

        {/* Floating sparkle */}
        {isHovered && (
          <Zap className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-bounce" />
        )}
      </div>

      {/* Text content */}
      <div className="relative flex-1">
        <span className="font-medium text-sm md:text-base group-hover:font-semibold transition-all duration-300">
          {link.text}
        </span>

        {/* Animated underline */}
        <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500 mt-1"></div>
      </div>

      {/* Arrow with animation */}
      <div className="relative">
        <ArrowRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 group-hover:text-orange-600 transform group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />

        {/* Trail effect */}
        {isHovered && (
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-1 bg-orange-400 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute inset-0 transform scale-0 group-active:scale-100 bg-orange-400/20 transition-transform duration-200 rounded-xl"></div>
      </div>
    </Link>
  );
};

const imageCards = [
  {
    id: 1,
    title: "Latest Opportunities",
    src: "/images/latest_opportunities.jpg",
    desc: "Discover the newest job openings and career opportunities",
    gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700",
  },
  {
    id: 2,
    title: "Resume Building",
    src: "/images/resume_building.jpg",
    desc: "Learn how to create a resume that stands out",
    gradient: "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700",
  },
  {
    id: 3,
    title: "Community",
    src: "/images/community.jpg",
    desc: "Join our professional network and connect with industry experts",
    gradient: "bg-gradient-to-br from-green-500 via-green-600 to-green-700",
  },
  {
    id: 4,
    title: "Career Growth",
    src: "/images/career_growth.jpg",
    desc: "Strategies for advancing in your career",
    gradient: "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700",
  },
  {
    id: 5,
    title: "HR Threads",
    src: "/images/hr_threads.jpg",
    desc: "Insights and discussions from HR professionals",
    gradient: "bg-gradient-to-br from-green-500 via-green-600 to-green-700",
  },
  {
    id: 6,
    title: "Interview Tips",
    src: "/images/interview_tips.jpg",
    desc: "Master your interview skills with proven techniques",
    gradient: "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700",
  },
];

const events = [
  {
    id: 2,
    date: "June 22, 2025",
    title: "Metro Cities Expansion",
    location: "All the Metro Cities",
    link: "#",
    badge: "Coming Soon",
  },
  {
    id: 3,
    date: "July 22, 2025",
    title: "Major Cities Expansion",
    location: "All Major Cities Across India",
    link: "#",
  },
  {
    id: 4,
    date: "August 19, 2025",
    title: "Pan-India Launch",
    location: "All Over India",
    link: "#",
    badge: "Featured",
  },
];

const quickLinks = [
  {
    icon: <FaFileAlt className="w-5 h-5" />,
    text: "Resume Builder",
    path: "/resume-builder",
  },
  {
    icon: <FaGraduationCap className="w-5 h-5" />,
    text: "Training Programs",
    path: "/training",
  },
  {
    icon: <FaChartLine className="w-5 h-5" />,
    text: "Career Opportunities",
    path: "/career-opportunities",
  },
  {
    icon: <FaQuestionCircle className="w-5 h-5" />,
    text: "Interview Prepration",
    path: "/mock-interview",
  },
];

export default function SidebarContent({ position, className }) {
  const leftContent = position === "left";

  return (
    <div
      className={`w-full ${
        leftContent ? "lg:w-1/4" : "lg:w-1/4"
      } ${className} relative`}
    >
      {/* Static container (desktop) - NO SCROLLERS */}
      <div
        className={`hidden lg:flex flex-col gap-4 md:gap-6 relative rounded-2xl ${
          leftContent ? "" : ""
        }`}
        style={{
          overflow: "visible !important",
          height: "auto !important",
          maxHeight: "none !important",
          minHeight: "auto !important",
        }}
      >
        <div
          className="relative w-full"
          style={{
            overflow: "visible !important",
            height: "auto !important",
            maxHeight: "none !important",
          }}
        >
          {/* Remove gradient fade masks as there's no scrolling */}
          <div
            className="flex flex-col gap-4 md:gap-6 pb-4 pt-1"
            style={{
              overflow: "visible !important",
              height: "auto !important",
              maxHeight: "none !important",
            }}
          >
            {leftContent ? (
              <>
                {/* Left sidebar content with enhanced animations */}
                <div className="space-y-4 md:space-y-6">
                  {imageCards.slice(0, 3).map((card, index) => (
                    <AnimatedImageCard
                      key={card.id}
                      card={card}
                      index={index}
                      position="left"
                    />
                  ))}
                </div>

                {/* Enhanced Events Section */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 md:p-6 animate-fadeIn overflow-hidden">
                  {/* Background decorative elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-200/30 to-transparent rounded-full transform translate-x-8 -translate-y-8"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full transform -translate-x-4 translate-y-4"></div>

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                          Upcoming Events
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full font-medium border border-blue-200/50">
                          {events.length} Events
                        </span>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      {events.map((event, index) => (
                        <AnimatedEventCard
                          key={event.id}
                          event={event}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Right sidebar content with enhanced animations */}
                <div className="space-y-4 md:space-y-6">
                  {imageCards.slice(3).map((card, index) => (
                    <AnimatedImageCard
                      key={card.id}
                      card={card}
                      index={index}
                      position="right"
                    />
                  ))}
                </div>

                {/* Enhanced Quick Links Section */}
                <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 md:p-6 animate-fadeIn overflow-hidden">
                  {/* Background decorative elements */}
                  <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-green-200/30 to-transparent rounded-full transform -translate-x-6 -translate-y-6"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-200/30 to-transparent rounded-full transform translate-x-8 translate-y-8"></div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4 md:mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800">
                        Quick Links
                      </h3>
                      <div className="ml-auto">
                        <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                      </div>
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      {quickLinks.map((link, index) => (
                        <AnimatedQuickLink
                          key={index}
                          link={link}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* /flex column inner content */}
        </div>
        {/* /static container */}
      </div>
      {/* /desktop wrapper */}

      {/* Enhanced Mobile-only content */}
      <div className="lg:hidden">
        {leftContent && (
          <>
            {/* Mobile image cards with stagger animation */}
            <div className="space-y-4">
              {imageCards.map((card, index) => (
                <AnimatedImageCard
                  key={card.id}
                  card={card}
                  index={index}
                  position="mobile"
                />
              ))}
            </div>

            {/* Mobile events section - removed extra spacing */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-orange-200/50 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-500" />
                  Events
                </h3>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                  {events.length}
                </span>
              </div>
              <div className="space-y-3">
                {events.map((event, index) => (
                  <AnimatedEventCard
                    key={event.id}
                    event={event}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export { AnimatedQuickLink };
