import React, { useState } from 'react';
import { FileCode, CheckCircle, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';

export default function CareerFieldsAnalysis() {
  const [activeTab, setActiveTab] = useState('overview');

  const analysis = {
    overview: {
      title: "Component Overview",
      items: [
        {
          label: "Component Type",
          value: "Interactive Career Explorer",
          icon: <FileCode className="w-5 h-5" />
        },
        {
          label: "Main Features",
          value: "Search, filter, expandable cards, detailed views",
          icon: <CheckCircle className="w-5 h-5" />
        },
        {
          label: "Data Structure",
          value: "6 career fields with comprehensive metadata",
          icon: <TrendingUp className="w-5 h-5" />
        },
        {
          label: "UI Framework",
          value: "Tailwind CSS + Framer Motion animations",
          icon: <Lightbulb className="w-5 h-5" />
        }
      ]
    },
    strengths: [
      "Rich visual design with gradient effects and glassmorphism",
      "Comprehensive career data including salary, growth rates, and skills",
      "Smooth animations using Framer Motion for better UX",
      "Responsive grid layout adapting to different screen sizes",
      "Real-time search filtering across multiple fields",
      "Interactive expandable cards showing detailed information",
      "Trending indicators for high-growth career fields",
      "Clear call-to-action buttons for user engagement"
    ],
    issues: [
      {
        severity: "high",
        title: "Missing Dependency in useEffect",
        description: "The useEffect hook doesn't include 'careerFields' in its dependency array, which could cause stale closures",
        fix: "Add careerFields to the dependency array or move it outside the component"
      },
      {
        severity: "medium",
        title: "No Search Results Feedback",
        description: "When search returns no results, the grid is empty with no user feedback",
        fix: "Add a 'No results found' message when filteredFields.length === 0"
      },
      {
        severity: "medium",
        title: "Accessibility Concerns",
        description: "Interactive cards lack proper keyboard navigation and ARIA labels",
        fix: "Add keyboard event handlers, role attributes, and aria-expanded states"
      },
      {
        severity: "low",
        title: "Hardcoded Data",
        description: "Career fields data is hardcoded in the component",
        fix: "Consider moving to a separate data file or fetching from an API"
      }
    ],
    improvements: [
      {
        category: "Performance",
        suggestions: [
          "Memoize the careerFields array using useMemo",
          "Debounce the search input to reduce filter operations",
          "Use React.memo for individual field cards to prevent unnecessary re-renders"
        ]
      },
      {
        category: "Functionality",
        suggestions: [
          "Add filter options (by salary range, growth rate, trending)",
          "Implement sort functionality (alphabetical, by salary, by job count)",
          "Add 'favorite' or 'save' feature for career fields",
          "Include a comparison mode to compare multiple career fields"
        ]
      },
      {
        category: "Accessibility",
        suggestions: [
          "Add keyboard navigation (Tab, Enter, Escape)",
          "Include focus indicators for keyboard users",
          "Add aria-labels and aria-describedby attributes",
          "Ensure color contrast meets WCAG AA standards"
        ]
      },
      {
        category: "User Experience",
        suggestions: [
          "Add loading skeleton while data loads",
          "Include breadcrumb navigation",
          "Add transition when closing expanded view",
          "Show toast notifications for actions",
          "Add a 'Share' button for career fields"
        ]
      }
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'strengths', label: 'Strengths' },
    { id: 'issues', label: 'Issues' },
    { id: 'improvements', label: 'Improvements' }
  ];

  const severityColors = {
    high: 'border-red-500/50 bg-red-500/10',
    medium: 'border-yellow-500/50 bg-yellow-500/10',
    low: 'border-blue-500/50 bg-blue-500/10'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Career Fields Component Analysis
          </h1>
          <p className="text-slate-300 text-lg">
            Comprehensive review of the CareerFieldsSection component
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-slate-800/50 rounded-xl border border-slate-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {analysis.overview.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50"
                >
                  <div className="text-cyan-400 mt-1">{item.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{item.label}</h3>
                    <p className="text-slate-300">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'strengths' && (
            <div className="space-y-3">
              {analysis.strengths.map((strength, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/30"
                >
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-200">{strength}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'issues' && (
            <div className="space-y-4">
              {analysis.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className={`p-5 rounded-lg border ${severityColors[issue.severity]}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-white font-semibold">{issue.title}</h3>
                    <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${
                      issue.severity === 'high' ? 'bg-red-500/20 text-red-300' :
                      issue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {issue.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">{issue.description}</p>
                  <div className="pl-4 border-l-2 border-cyan-500/30">
                    <p className="text-sm text-cyan-300">
                      <span className="font-semibold">Fix: </span>
                      {issue.fix}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'improvements' && (
            <div className="space-y-6">
              {analysis.improvements.map((category, idx) => (
                <div key={idx} className="space-y-3">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    {category.category}
                  </h3>
                  <div className="space-y-2 pl-7">
                    {category.suggestions.map((suggestion, sIdx) => (
                      <div
                        key={sIdx}
                        className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50"
                      >
                        <p className="text-slate-200">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Card */}
        <div className="mt-6 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-400/20 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-2">Overall Assessment</h3>
          <p className="text-slate-300 mb-4">
            This is a well-designed component with excellent visual appeal and user interaction. 
            The main areas for improvement are accessibility, performance optimization, and adding 
            more interactive features. Addressing the dependency array issue should be a priority.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
              <span className="text-green-300 font-medium">8 Strengths</span>
            </div>
            <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <span className="text-yellow-300 font-medium">4 Issues</span>
            </div>
            <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <span className="text-blue-300 font-medium">13 Improvements</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}