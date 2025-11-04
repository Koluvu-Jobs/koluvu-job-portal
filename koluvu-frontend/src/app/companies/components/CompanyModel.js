//  src/app/companies/components/CompanyModel.js

'use client';

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Helper Motion components
const MotionDiv = motion.div;
const MotionButton = motion.button;

export default function CompanyModal({ company, onClose }) {
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const fallbackLogo = '/images/default-company-logo.png';

  // Close with fade out animation
  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  // Fade in when mounted
  useEffect(() => {
    setIsVisible(true);
    // Close modal with Escape key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Close if click backdrop
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  // Example: fill stats (replace with your real data as needed)
  const stats = [
    {
      icon: "🏢",
      label: "Industry",
      value: company.industry || "Not specified",
    },
    {
      icon: "👥",
      label: "Employees",
      value: company.employees || "Not specified",
    },
    {
      icon: "⭐",
      label: "Rating",
      value: company.rating ? company.rating.toFixed(1) : "—",
      special: "rating",
    }
  ];

  return (
    <MotionDiv
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleBackdropClick}
    >
      <MotionDiv
        className="relative w-full max-w-4xl overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.95))',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: `
            0 25px 60px rgba(99, 102, 241, 0.15),
            0 15px 35px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(255, 255, 255, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.6)
          `,
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{
          scale: isVisible ? 1 : 0.8,
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 50
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          duration: 0.4
        }}
      >
        {/* Gradient Background Overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)',
            borderRadius: 'inherit',
          }}
        />

        {/* Header Section */}
        <div className="relative p-8 pb-6">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-6">
              <MotionDiv
                className="relative overflow-hidden"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `
                    0 8px 25px rgba(0, 0, 0, 0.08),
                    inset 0 1px 0 rgba(255, 255, 255, 0.8)
                  `,
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
                    borderRadius: 'inherit',
                  }}
                />
                <Image
                  src={imageError ? fallbackLogo : company.logo}
                  alt={`${company.name} logo`}
                  width={50}
                  height={50}
                  className="object-contain relative z-10"
                  onError={() => setImageError(true)}
                  priority
                  quality={90}
                  sizes="80px"
                />
              </MotionDiv>

              <div>
                <h2
                  className="text-3xl font-bold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {company.name}
                </h2>
                <p className="text-slate-600 flex items-center gap-2 text-lg font-medium">
                  <span className="text-lg">📍</span>
                  {company.location}
                </p>
              </div>
            </div>

            <MotionButton
              onClick={handleClose}
              className="p-3 rounded-full transition-all duration-300"
              style={{
                background: 'rgba(248, 250, 252, 0.8)',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                color: '#64748b',
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </MotionButton>
          </div>
        </div>

        {/* Content Section */}
        <div className="relative px-8 pb-8 overflow-y-auto">
          <div className="space-y-8">
            {/* About Section */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <h3
                className="text-xl font-bold mb-4"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                About Company
              </h3>
              <div
                className="p-6 rounded-2xl"
                style={{
                  background: 'rgba(248, 250, 252, 0.6)',
                  border: '1px solid rgba(226, 232, 240, 0.8)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <p className="text-slate-700 leading-relaxed text-base">
                  {company.description || "This company is dedicated to providing excellent services and creating innovative solutions in their industry."}
                </p>
              </div>
            </MotionDiv>

            {/* Stats Section */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((item, idx) => (
                  <div key={idx} className="bg-white/70 rounded-xl p-5 shadow flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <p
                        className="font-semibold text-sm uppercase tracking-wider"
                        style={{ color: '#64748b' }}
                      >
                        {item.label}
                      </p>
                    </div>
                    <p
                      className={`font-bold text-lg ${item.special === 'rating' ? 'text-yellow-500' : ''}`}
                      style={{
                        color: item.special === 'rating' ? '#f59e0b' : '#1e293b',
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </MotionDiv>

            {/* Action Button */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="pt-4"
            >
              <MotionButton
                className="w-full py-4 px-6 rounded-2xl font-bold text-lg text-white relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                  border: 'none',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 15px 35px rgba(99, 102, 241, 0.3)',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #6366f1 100%)'
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 10
                }}
                onClick={() => window.location.href = `/companies/${company.id}/jobs`}
              >
                View {company.jobs} Open Positions <span>→</span>
              </MotionButton>
            </MotionDiv>
          </div>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
}
