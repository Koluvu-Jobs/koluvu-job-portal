// src/app/main/dashboard/employee/components/subscriptions.js

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const plans = [
  {
    title: "💼 Koluvu Employee Subscription Plans",
    isHeader: true,
  },
  {
    title: "✅ 1. Profile Verification",
    price: "₹19 / Month",
    paymentLink: "https://payment-link-for-profile-verification.com",
    features: ["Verified Badge on Profile", "Priority Visibility to Employers"],
    icon: "✅",
    color: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    title: "📄 2. Professional Resume Unlock",
    price: "₹99 / 3 Months",
    paymentLink: "https://payment-link-for-resume-unlock.com",
    features: [
      "Access to Premium Resume Templates",
      "AI-Optimized Resume Suggestions",
      "Downloadable in PDF Format",
    ],
    icon: "📄",
    color: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    title: "🧠 3. AI Mock Interview",
    price: "₹199 / 3 Months",
    paymentLink: "https://payment-link-for-ai-mock-interview.com",
    features: [
      "Role-Based AI-Powered Interview Questions",
      "Instant Feedback & Scoring",
      "Practice Unlimited Times",
    ],
    icon: "🧠",
    color: "bg-purple-50",
    borderColor: "border-purple-200",
  },
  {
    title: "💡 Combo Pack – Most Popular",
    price: "₹249 only",
    paymentLink: "https://payment-link-for-combo-pack.com",
    isPopular: true,
    validity: "Validity: 3 Months for Resume & AI Interview, 1 Year for Profile Verification",
    features: [
      "Profile Verification",
      "Professional Resume",
      "AI Mock Interview",
      "Save ₹58!",
    ],
    icon: "💡",
    color: "bg-yellow-50",
    borderColor: "border-yellow-200",
  },
];

const PlanCard = ({ plan, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      whileHover={{ scale: 1.03 }}
      className={`rounded-2xl shadow-lg p-6 ${plan.color} relative border-2 ${plan.borderColor} transition-all duration-300 hover:shadow-xl`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-1 text-sm font-bold rounded-full shadow-md z-10">
          Most Popular
        </div>
      )}
      <div className="flex items-start mb-4">
        <span className="text-3xl mr-3">{plan.icon}</span>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{plan.title}</h3>
          <a
            href={plan.paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-extrabold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {plan.price}
          </a>
        </div>
      </div>
      {plan.validity && (
        <p className="text-sm text-gray-600 italic mb-4 bg-white/50 p-2 rounded">
          {plan.validity}
        </p>
      )}
      <ul className="space-y-2 mb-6">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <motion.a
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        href={plan.paymentLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`w-full block text-center py-3 px-4 rounded-lg font-bold ${
          plan.isPopular
            ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
            : "bg-indigo-600 text-white"
        } hover:shadow-md transition-all`}
      >
        Subscribe Now
      </motion.a>
    </motion.div>
  );
};

const PolicySection = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="bg-white p-6 rounded-xl shadow-md mt-10 max-w-5xl mx-auto"
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="bg-yellow-100 p-2 rounded-full mr-3">🔔</span>
        Renewal & Notification Policy
      </h3>
      <ul className="space-y-3">
        <li className="flex items-start">
          <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-3">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <span className="text-gray-700">Subscription expiry reminder sent 15 days in advance</span>
        </li>
        <li className="flex items-start">
          <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-3">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <span className="text-gray-700">Daily reminders continue until renewal is completed</span>
        </li>
        <li className="flex items-start">
          <span className="bg-blue-100 text-blue-800 p-1 rounded-full mr-3">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </span>
          <span className="text-gray-700">Notifications via Email, SMS, and In-App Alerts</span>
        </li>
      </ul>
    </motion.div>
  );
};

const EmployeeSidebar = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      const header = document.querySelector('header');
      if (header) setHeaderHeight(header.offsetHeight);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    {
      name: "Resume Builder",
      icon: "📝",
      path: "/main/resume-builder",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      name: "ATS Optimizer",
      icon: "🔍",
      path: "/main/dashboard/employee/components/ats-optimizer",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-700"
    },
    {
      name: "Mock Interview",
      icon: "💬",
      path: "/main/dashboard/employee/components/mock-interview",
      bgColor: "bg-green-50 hover:bg-green-100",
      textColor: "text-green-700"
    }
  ];

  if (!isClient) return null;

  if (isMobile) {
    return (
      <>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed right-4 bottom-4 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg lg:hidden"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 w-3/4 h-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Employee Tools</h3>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col">
                  {navItems.map((item, index) => (
                    <Link key={index} href={item.path} passHref legacyBehavior>
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center p-4 ${item.bgColor} ${item.textColor} transition-colors cursor-pointer border-b border-gray-100 last:border-b-0`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="text-2xl mr-3">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </motion.a>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </>
    );
  }

  return (
    <div 
      className="hidden lg:flex flex-col w-64 bg-white shadow-lg border-l border-gray-200 z-40"
      style={{
        position: 'sticky',
        top: `${headerHeight}px`,
        height: `calc(100vh - ${headerHeight}px)`,
        alignSelf: 'flex-start'
      }}
    >
      <h3 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200">
        Employee Tools
      </h3>
      
      <div className="grid grid-rows-3 h-full">
        {navItems.map((item, index) => (
          <Link key={index} href={item.path} passHref legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center ${item.bgColor} ${item.textColor} transition-colors cursor-pointer border-b border-gray-100 last:border-b-0`}
            >
              <span className="text-2xl mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </motion.a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="relative flex min-h-screen">
      <div className="flex-1 p-4 md:p-8 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={titleVariants}
            className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800"
          >
            Koluvu Employee Subscription Plans
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 md:gap-8">
            {plans
              .filter((plan) => !plan.isHeader)
              .map((plan, index) => (
                <PlanCard key={index} plan={plan} index={index} />
              ))}
          </div>

          <PolicySection />
        </div>
      </div>

      <EmployeeSidebar />
    </div>
  );
}
