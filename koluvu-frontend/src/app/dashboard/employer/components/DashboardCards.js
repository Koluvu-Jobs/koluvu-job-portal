// src/app/dashboard/employer/components/DashboardCards.js

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Calendar,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Building2,
} from "lucide-react";

export default function DashboardCards() {
  const [stats, setStats] = useState({
    openPositions: 0,
    candidates: 0,
    interviews: 0,
    hired: 0,
    loading: true,
  });

  // Simulate fetching real data
  useEffect(() => {
    const fetchDashboardStats = async () => {
      // Simulate API delay for loading effect
      setTimeout(() => {
        setStats({
          openPositions: 24,
          candidates: 156,
          interviews: 42,
          hired: 18,
          loading: false,
        });
      }, 1000);
    };

    fetchDashboardStats();
  }, []);

  const cards = [
    {
      title: "Open Positions",
      value: stats.openPositions,
      change: "+31",
      changePercent: "+12.8%",
      trend: "up",
      icon: Briefcase,
      color: "blue",
      gradient: "from-blue-500 to-indigo-600",
      bgGradient: "from-blue-50 via-indigo-50 to-purple-50",
      link: "/dashboard/employer/active-jobs",
      description: "Active job postings",
    },
    {
      title: "Total Candidates",
      value: stats.candidates,
      change: "+121",
      changePercent: "+43.5%",
      trend: "up",
      icon: Users,
      color: "emerald",
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 via-green-50 to-teal-50",
      description: "Applications received",
    },
    {
      title: "Interviews Scheduled",
      value: stats.interviews,
      change: "-5",
      changePercent: "-10.6%",
      trend: "down",
      icon: Calendar,
      color: "amber",
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 via-yellow-50 to-orange-50",
      description: "This week",
    },
    {
      title: "Successfully Hired",
      value: stats.hired,
      change: "+21",
      changePercent: "+38.9%",
      trend: "up",
      icon: UserCheck,
      color: "violet",
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 via-purple-50 to-pink-50",
      description: "This month",
    },
  ];

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-8 animate-pulse">
        <div className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl"></div>
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded w-20"></div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-12 w-12 bg-gray-300 rounded-xl"></div>
            </div>
            <div className="flex items-baseline space-x-2 mb-3">
              <div className="h-10 bg-gray-300 rounded w-16"></div>
              <div className="h-6 bg-gray-300 rounded w-12"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );

  if (stats.loading) {
    return <LoadingSkeleton />;
  }

  const StatCard = ({ card, index, isClickable = false }) => {
    const Icon = card.icon;
    const TrendIcon = card.trend === "up" ? TrendingUp : TrendingDown;

    const cardContent = (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: index * 0.15,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.2 },
        }}
        className={`
          relative overflow-hidden rounded-2xl p-6 h-full
          bg-gradient-to-br ${card.bgGradient}
          border border-white/20 backdrop-blur-sm
          shadow-lg hover:shadow-2xl
          transition-all duration-300 ease-out
          group cursor-pointer
        `}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-500"></div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="absolute top-4 right-6 w-4 h-4 text-white/40" />
          </motion.div>
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [0, -3, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Sparkles className="absolute bottom-6 left-6 w-3 h-3 text-white/30" />
          </motion.div>
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-gray-700 text-sm font-bold tracking-wide uppercase opacity-90">
                {card.title}
              </h3>
              <p className="text-gray-600 text-xs mt-1 opacity-75 font-medium">
                {card.description}
              </p>
            </div>
            <motion.div
              className={`
                p-3 rounded-xl bg-gradient-to-r ${card.gradient} 
                shadow-lg hover:shadow-xl
              `}
              whileHover={{
                scale: 1.1,
                rotate: 5,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
          </div>

          {/* Main Value */}
          <div className="flex items-baseline space-x-3 mb-4">
            <motion.span
              className="text-4xl font-black text-gray-900 tracking-tight"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15 + 0.4,
                type: "spring",
                stiffness: 200,
              }}
            >
              {card.value}
            </motion.span>
            <motion.div
              className={`
                flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-bold
                shadow-sm border
                ${
                  card.trend === "up"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                    : "bg-red-100 text-red-700 border-red-200"
                }
              `}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: index * 0.15 + 0.6,
                type: "spring",
              }}
            >
              <TrendIcon className="w-3 h-3" />
              <span>{card.changePercent}</span>
            </motion.div>
          </div>

          {/* Change indicator */}
          <motion.div
            className="flex items-center space-x-2 mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 + 0.7 }}
          >
            <span
              className={`text-sm font-semibold ${
                card.trend === "up" ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {card.change} from last period
            </span>
          </motion.div>

          {/* Progress bar animation */}
          <div className="w-full bg-gray-200/60 rounded-full h-2 overflow-hidden shadow-inner">
            <motion.div
              className={`h-full bg-gradient-to-r ${card.gradient} rounded-full shadow-sm`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((card.value / 200) * 100, 100)}%` }}
              transition={{
                duration: 1.5,
                delay: index * 0.15 + 0.8,
                ease: "easeOut",
              }}
            />
          </div>
        </div>

        {/* Subtle border glow effect */}
        <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-white/40 transition-colors duration-300"></div>
      </motion.div>
    );

    return isClickable ? (
      <Link href={card.link} className="block h-full">
        {cardContent}
      </Link>
    ) : (
      cardContent
    );
  };

  return (
    <div className="p-6 space-y-8">
      {/* Enhanced Header with company branding */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex items-center space-x-4 mb-8"
      >
        <motion.div
          className="p-4 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 rounded-2xl shadow-xl"
          whileHover={{
            scale: 1.05,
            rotate: 2,
            shadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
          transition={{ duration: 0.2 }}
        >
          <Building2 className="w-7 h-7 text-white" />
        </motion.div>
        <div>
          <motion.h1
            className="text-3xl font-black text-gray-900 tracking-tight"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Dashboard Overview
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg font-medium"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Real-time hiring metrics and insights
          </motion.p>
        </div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <StatCard
            key={index}
            card={card}
            index={index}
            isClickable={!!card.link}
          />
        ))}
      </div>

      {/* Enhanced Additional insights row */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div
          className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-2xl p-6 border border-blue-200/50 shadow-lg"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                Hire Rate
              </p>
              <p className="text-2xl font-black text-blue-700">11.5%</p>
              <p className="text-xs text-blue-600 font-medium">
                +2.3% vs last month
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200/50 shadow-lg"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-900 uppercase tracking-wide">
                Avg. Time to Hire
              </p>
              <p className="text-2xl font-black text-emerald-700">12 days</p>
              <p className="text-xs text-emerald-600 font-medium">
                -3 days improvement
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100 rounded-2xl p-6 border border-purple-200/50 shadow-lg"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-purple-900 uppercase tracking-wide">
                Quality Score
              </p>
              <p className="text-2xl font-black text-purple-700">8.9/10</p>
              <p className="text-xs text-purple-600 font-medium">
                Excellent performance
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
