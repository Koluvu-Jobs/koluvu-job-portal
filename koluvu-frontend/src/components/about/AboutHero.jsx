// src/components/AboutHero.jsx

import styles from "@koluvu/styles/components/about/about.module.css";

export default function AboutHero({ className }) {
  return (
    <section
      className={`relative overflow-hidden bg-white py-24 ${styles.lightHero}`}
    >
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${styles.heroPattern}`}></div>
        <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-blue-50/70 blur-[100px]"></div>
        <div className="absolute bottom-20 -right-20 w-80 h-80 rounded-full bg-blue-100/50 blur-[100px]"></div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          className={`${
            className || "text-6xl md:text-7xl lg:text-8xl"
          } !font-bold !text-gray-900 mb-6`}
        >
          <span className={`inline-block ${styles.fadeIn}`}>
            <span className="text-4xl">About </span>
            <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
              Koluvu
            </span>
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
          Revolutionizing hiring with intelligent, AI-powered job matching
          technology
        </p>

        {/* Scroll indicator */}
        <div className="mt-12 animate-bounce">
          <div className="w-8 h-12 border-2 border-blue-500/30 rounded-full flex justify-center mx-auto">
            <div className="w-1 h-3 bg-blue-500 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-white/0"></div>
    </section>
  );
}
