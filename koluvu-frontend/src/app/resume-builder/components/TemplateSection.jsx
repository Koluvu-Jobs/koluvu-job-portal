import React, { useState } from "react";
import {
  allTemplates,
  modernTemplates,
  classicTemplates,
  executiveTemplates,
  fresherTemplates,
} from "../templates.js";

const TemplateSection = ({ selectedTemplate, setSelectedTemplate }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);

  const categories = [
    { name: "All", templates: allTemplates },
    { name: "Modern", templates: modernTemplates },
    { name: "Classic", templates: classicTemplates },
    { name: "Executive", templates: executiveTemplates },
    { name: "Fresher", templates: fresherTemplates },
  ];

  const getCurrentTemplates = () => {
    return categories.find((cat) => cat.name === activeCategory)?.templates || allTemplates;
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    if (typeof window !== "undefined") {
      localStorage.setItem("resumeBuilder.selectedTemplate", templateId);
    }
  };

  const currentTemplates = getCurrentTemplates();
  const currentTemplate = currentTemplates[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? currentTemplates.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev === currentTemplates.length - 1 ? 0 : prev + 1
    );
  };

  if (currentTemplates.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          No templates found
        </h3>
        <p className="text-gray-600">
          Try adjusting your search terms or selecting a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full relative flex flex-col" style={{ background: '#ecf0f3' }}>
      {/* Header Section */}
      <div className="mb-6">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                setActiveCategory(category.name);
                setCurrentIndex(0);
              }}
              className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 outline-none text-sm ${
                activeCategory === category.name ? 'text-blue-600' : 'text-gray-600'
              }`}
              style={{
                background: '#ecf0f3',
                boxShadow: activeCategory === category.name
                  ? 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff'
                  : '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
              }}
            >
              {category.name}
              <span className="ml-2 text-xs opacity-70">
                ({category.templates.length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Card Container */}
      <div className="flex items-center justify-center relative">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          disabled={currentTemplates.length <= 1}
          className="absolute left-4 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed outline-none"
          style={{
            background: '#ecf0f3',
            boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
          }}
          onMouseEnter={(e) => {
            if (currentTemplates.length > 1) {
              e.currentTarget.style.boxShadow = 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff';
          }}
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          disabled={currentTemplates.length <= 1}
          className="absolute right-4 z-20 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed outline-none"
          style={{
            background: '#ecf0f3',
            boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
          }}
          onMouseEnter={(e) => {
            if (currentTemplates.length > 1) {
              e.currentTarget.style.boxShadow = 'inset 3px 3px 6px #d1d9e6, inset -3px -3px 6px #ffffff';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff';
          }}
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Single Template Card */}
        <div 
          className="w-full max-w-5xl mx-auto transition-all duration-700 ease-in-out"
          style={{
            animation: 'fadeIn 0.5s ease-in-out',
          }}
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: '#ecf0f3',
              boxShadow: '15px 15px 30px #d1d9e6, -15px -15px 30px #ffffff',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2" style={{ height: '480px' }}>
              {/* Left Side - Preview */}
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
                {currentTemplate?.preview ? (
                  <img
                    src={currentTemplate.preview}
                    alt={currentTemplate.name}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-all duration-700"
                    style={{
                      boxShadow: '10px 10px 20px #a8adb5, -10px -10px 20px #ffffff',
                      maxHeight: '400px',
                    }}
                  />
                ) : (
                  <div className="w-48 h-72 rounded-xl flex items-center justify-center"
                    style={{
                      background: '#ecf0f3',
                      boxShadow: 'inset 6px 6px 12px #d1d9e6, inset -6px -6px 12px #ffffff',
                    }}
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center"
                        style={{
                          background: '#ecf0f3',
                          boxShadow: '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
                        }}
                      >
                        <span className="text-3xl font-bold text-gray-700">
                          {currentTemplate?.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-base text-gray-700 font-bold">
                        {currentTemplate?.name}
                      </p>
                    </div>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {currentTemplate?.featured && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-orange-600"
                      style={{
                        background: '#ecf0f3',
                        boxShadow: '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
                      }}
                    >
                      ⭐ FEATURED
                    </span>
                  )}
                  {currentTemplate?.new && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold text-green-600"
                      style={{
                        background: '#ecf0f3',
                        boxShadow: '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
                      }}
                    >
                      ✨ NEW
                    </span>
                  )}
                </div>

                {/* Rating */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold text-gray-700"
                  style={{
                    background: '#ecf0f3',
                    boxShadow: '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
                  }}
                >
                  ⭐ {currentTemplate?.rating}
                </div>
              </div>

              {/* Right Side - Details */}
              <div className="p-8 flex flex-col justify-center">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    {currentTemplate?.name}
                  </h2>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-blue-600"
                      style={{
                        background: '#ecf0f3',
                        boxShadow: 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff',
                      }}
                    >
                      {currentTemplate?.category}
                    </span>
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-gray-600"
                      style={{
                        background: '#ecf0f3',
                        boxShadow: 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff',
                      }}
                    >
                      {currentTemplate?.pages} Page{currentTemplate?.pages > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 font-semibold">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {currentTemplate?.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 mb-1 font-semibold">
                      Best For
                    </p>
                    <p className="text-sm text-gray-800 font-semibold">
                      {currentTemplate?.bestFor}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => handleTemplateSelect(currentTemplate?.id)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 outline-none ${
                      selectedTemplate === currentTemplate?.id
                        ? 'text-green-600'
                        : 'text-blue-600'
                    }`}
                    style={{
                      background: '#ecf0f3',
                      boxShadow: selectedTemplate === currentTemplate?.id
                        ? 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff'
                        : '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTemplate !== currentTemplate?.id) {
                        e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTemplate !== currentTemplate?.id) {
                        e.currentTarget.style.boxShadow = '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff';
                      }
                    }}
                  >
                    {selectedTemplate === currentTemplate?.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Selected
                      </span>
                    ) : (
                      "Select Template"
                    )}
                  </button>

                  {selectedTemplate === currentTemplate?.id && (
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="px-5 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all duration-300 text-red-600 outline-none"
                      style={{
                        background: '#ecf0f3',
                        boxShadow: '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '6px 6px 12px #d1d9e6, -6px -6px 12px #ffffff';
                      }}
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Progress Indicator */}
                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-2">
                    Template {currentIndex + 1} of {currentTemplates.length}
                  </p>
                  <div className="flex justify-center gap-1.5">
                    {currentTemplates.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className="w-1.5 h-1.5 rounded-full transition-all duration-300 outline-none"
                        style={{
                          background: currentIndex === index ? '#4b70e2' : '#d1d9e6',
                          boxShadow: currentIndex === index
                            ? '0 0 6px rgba(75, 112, 226, 0.5)'
                            : 'none',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default TemplateSection;
