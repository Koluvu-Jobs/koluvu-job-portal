// app/not-found.js

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  const [timeLeft, setTimeLeft] = useState({
    days: 29,
    hours: 3,
    minutes: 7,
    seconds: 12,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        let { days, hours, minutes, seconds } = prevTime;

        seconds--;

        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }

        if (minutes < 0) {
          minutes = 59;
          hours--;
        }

        if (hours < 0) {
          hours = 23;
          days--;
        }

        if (days < 0) {
          clearInterval(timer);
          return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const counterVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "backOut",
      },
    },
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(7, 145, 132, 0.3)",
        "0 0 40px rgba(7, 145, 132, 0.6)",
        "0 0 20px rgba(7, 145, 132, 0.3)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-teal-500/20 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 right-16 w-48 h-48 bg-purple-500/20 rounded-full blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-24 h-24 bg-cyan-400/20 rounded-full blur-lg"
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex items-center justify-center min-h-screen px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.h3
              className="text-lg md:text-xl text-teal-300 font-medium tracking-[0.3em] uppercase"
              variants={itemVariants}
            >
             THIS PAGE IS
            </motion.h3>
          </motion.div>

          {/* Coming Soon */}
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-wider"
            variants={itemVariants}
          >
            COMING SOON
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-gray-300 text-base md:text-lg lg:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
            variants={itemVariants}
          >
            We are almost there! If you would like to be notified when the
            website goes live, please subscribe to our newsletter.
          </motion.p>

          {/* Inspirational Quote */}
          <motion.div className="mb-12" variants={itemVariants}>
            <motion.blockquote
              className="text-teal-300 text-lg md:text-xl italic font-light max-w-3xl mx-auto relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="text-4xl text-teal-400 absolute -top-4 -left-4 opacity-60"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                &quot;
              </motion.span>
              The future belongs to those who believe in the beauty of their
              dreams.
              <motion.span
                className="text-4xl text-teal-400 absolute -bottom-4 -right-4 opacity-60"
                animate={{
                  rotate: [0, -5, 5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
              >
                &quot;
              </motion.span>
            </motion.blockquote>
            <motion.cite
              className="text-gray-400 text-sm md:text-base mt-4 block font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              — Eleanor Roosevelt
            </motion.cite>
          </motion.div>

          {/* Countdown Timer */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12"
            variants={itemVariants}
          >
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <motion.div
                key={unit}
                className="flex flex-col items-center"
                variants={counterVariants}
                custom={index}
              >
                <motion.div
                  className="relative bg-gradient-to-br from-teal-500 to-cyan-600 p-4 md:p-6 rounded-2xl shadow-2xl border border-teal-400/30"
                  variants={glowVariants}
                  animate="animate"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="text-3xl md:text-4xl lg:text-5xl font-black text-white block min-w-[60px] md:min-w-[80px] text-center"
                    key={value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {value.toString().padStart(2, "0")}
                  </motion.span>
                </motion.div>
                <motion.span
                  className="text-sm md:text-base text-teal-300 mt-3 font-medium capitalize tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {unit}
                </motion.span>
              </motion.div>
            ))}
          </motion.div>

          {/* Navigation */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <Link href="/">
              <motion.button
                className="px-8 py-3 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300 font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Home
              </motion.button>
            </Link>
            <motion.button
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-medium"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
            >
              Try Again ↻
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Particles */}
      {mounted &&
        [...Array(6)].map((_, i) => {
          // Fixed positions to avoid hydration mismatch
          const positions = [
            { left: 15, top: 20 },
            { left: 75, top: 60 },
            { left: 35, top: 85 },
            { left: 85, top: 25 },
            { left: 55, top: 45 },
            { left: 25, top: 70 },
          ];

          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-teal-400 rounded-full opacity-60"
              style={{
                left: `${positions[i].left}%`,
                top: `${positions[i].top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          );
        })}
    </div>
  );
}
