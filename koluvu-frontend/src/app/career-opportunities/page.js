// src/app/career-opportunities/page.js

"use client";

import React, { useState, useEffect } from "react";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";
import CareerGuidanceHero from "./components/CareerGuidanceHero";
import CareerFieldsSection from "./components/CareerFieldsSection";
import SkillAssessmentSection from "./components/SkillAssessmentSection";
import CareerPathsSection from "./components/CareerPathsSection";
import ResourcesSection from "./components/ResourcesSection";
import MentorshipSection from "./components/MentorshipSection";
import CareerGoalsSection from "./components/CareerGoalsSection";
import { motion } from "framer-motion";

export default function CareerGuidancePage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for smooth animations
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const sections = [
    { id: "overview", label: "Overview", icon: "🎯" },
    { id: "fields", label: "Career Fields", icon: "🏢" },
    { id: "assessments", label: "Skill Assessment", icon: "📊" },
    { id: "paths", label: "Career Paths", icon: "🛤️" },
    { id: "goals", label: "Career Goals", icon: "🎯" },
    { id: "mentorship", label: "Mentorship", icon: "👥" },
    { id: "resources", label: "Resources", icon: "📚" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading Career Guidance
          </h2>
          <p className="text-slate-300">
            Preparing your personalized career journey...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />

      {/* Navigation Tabs */}
      <div className="sticky top-16 z-40 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide py-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 mr-2 ${
                  activeSection === section.id
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {activeSection === "overview" && <CareerGuidanceHero />}
          {activeSection === "fields" && <CareerFieldsSection />}
          {activeSection === "assessments" && <SkillAssessmentSection />}
          {activeSection === "paths" && <CareerPathsSection />}
          {activeSection === "goals" && <CareerGoalsSection />}
          {activeSection === "mentorship" && <MentorshipSection />}
          {activeSection === "resources" && <ResourcesSection />}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
