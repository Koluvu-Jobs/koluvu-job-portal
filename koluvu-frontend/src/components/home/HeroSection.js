// src/components/home/HeroSection.js

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          src="/videos/homepage.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.9)" }}
        />
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          {/* Left Content */}
          <div
            className={`space-y-5 sm:space-y-6 md:space-y-8 transform transition-all duration-1000 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-full opacity-0"
            }`}
          >
            {/* Main Heading */}
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-4xl xs:text-5xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-white leading-snug md:leading-tight drop-shadow-lg">
                Connecting Jobs, <br /> Creating Futures
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl md:text-2xl lg:text-2xl text-slate-100 drop-shadow-md max-w-md">
                Your gateway to finding the right job and building a brighter
                future.
              </p>
            </div>

            {/* CTA Buttons - Adjusted width for medium and small screens */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full max-w-xs sm:max-w-sm mx-auto sm:mx-0">
              <Link href="/auth/register/employee" className="w-full">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg text-sm sm:text-base">
                  Find Dream Job
                </button>
              </Link>

              <Link href="/auth/register/employer" className="w-full">
                <button className="w-full bg-transparent hover:bg-white/10 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg font-semibold border-2 border-white transition-all transform hover:scale-105 shadow text-sm sm:text-base">
                  Post Job Opening
                </button>
              </Link>
            </div>

            {/* Stats - Responsive for mobile and small screens */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6 pt-4 md:pt-6">
              <div className="text-center min-w-[80px] sm:min-w-[90px]">
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold text-orange-500">10K+</div>
                <div className="text-slate-200 text-xs sm:text-sm">Active Jobs</div>
              </div>
              <div className="text-center min-w-[80px] sm:min-w-[90px]">
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold text-orange-500">5K+</div>
                <div className="text-slate-200 text-xs sm:text-sm">Companies</div>
              </div>
              <div className="text-center min-w-[80px] sm:min-w-[90px]">
                <div className="text-2xl sm:text-2xl md:text-3xl font-bold text-orange-500">50K+</div>
                <div className="text-slate-200 text-xs sm:text-sm">Job Seekers</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image - Visible on small screens and up */}
          <div
            className={`relative transform transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div className="relative">
              {/* Decorative Elements - Smaller for mobile */}
              <div className="absolute -top-3 -left-3 w-16 h-16 sm:w-20 sm:h-20 bg-orange-500/20 rounded-full opacity-40 animate-pulse"></div>
              <div className="absolute -bottom-3 -right-3 w-20 h-20 sm:w-24 sm:h-24 bg-green-500/20 rounded-full opacity-30 animate-pulse delay-1000"></div>

              {/* Main Image Container - Adjusted padding */}
              <div className="relative bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl sm:shadow-2xl border border-white/20">
                <Image
                  src="/images/career_success.jpg"
                  alt="Career Success"
                  width={500}
                  height={350}
                  className="rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl w-full h-auto object-cover"
                  priority
                  sizes="(max-width: 359px) 359px, 350px"
                />

                {/* Floating Cards - Smaller for mobile */}
                <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-sm rounded-md sm:rounded-lg p-2 sm:p-3 shadow-lg animate-float">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-800 font-medium text-xs sm:text-sm">
                      1,234 Jobs Today
                    </span>
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-md sm:rounded-lg p-2 sm:p-3 shadow-lg animate-float-delayed">
                  <div className="text-center">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">98%</div>
                    <div className="text-2xs sm:text-xs md:text-sm opacity-90">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
        <div className="w-4 h-6 sm:w-5 sm:h-8 border-2 border-white/70 rounded-full flex justify-center">
          <div className="w-1 h-1.5 sm:h-2 bg-white/90 rounded-full mt-1 animate-pulse"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease-in-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite 1.5s;
        }
      `}</style>
    </div>
  );
}
