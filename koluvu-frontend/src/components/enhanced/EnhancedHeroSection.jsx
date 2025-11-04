// src/components/enhanced/EnhancedHeroSection.jsx

import React from "react";

const EnhancedHeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your Dream Job
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Connect with top employers and discover opportunities that match your
          skills
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Find Jobs
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
            Post a Job
          </button>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
