import React, { useState } from "react";

const HelpModal = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const helpSections = {
    "getting-started": {
      title: "Getting Started",
      content: [
        "Choose between Fresh Graduate or Professional template based on your experience level",
        "Fill out required sections marked with red asterisks (*)",
        "Optional sections can enhance your resume but aren't mandatory",
        "Your progress is automatically saved every 30 seconds",
      ],
    },
    "personal-info": {
      title: "Personal Information",
      content: [
        "Use your full legal name as it appears on official documents",
        "Provide a professional email address (avoid nicknames)",
        "Include your current city and state/country",
        "LinkedIn profile should be your custom URL if available",
        "Only include a photo if specifically requested by the employer",
      ],
    },
    summary: {
      title: "Professional Summary",
      content: [
        "Write 2-3 sentences highlighting your key strengths",
        "Focus on what value you bring to potential employers",
        "Tailor your summary to match the job you're applying for",
        'Avoid generic phrases like "hard-working" or "team player"',
        "Include specific skills or achievements when possible",
      ],
    },
    skills: {
      title: "Skills Section",
      content: [
        "List skills that are relevant to your target job",
        "Separate technical skills from soft skills",
        "Be honest about your skill level - you may be tested",
        "Include programming languages, software, certifications",
        "Use commas to separate different skills",
      ],
    },
    experience: {
      title: "Work Experience",
      content: [
        "List experiences in reverse chronological order (most recent first)",
        "Use action verbs to start each bullet point",
        "Quantify achievements with numbers when possible",
        "Focus on accomplishments rather than just job duties",
        "Keep descriptions concise but impactful",
      ],
    },
    education: {
      title: "Education",
      content: [
        "Include your highest degree first",
        "Mention GPA only if it's 3.5 or higher",
        "Include relevant coursework for entry-level positions",
        "Add graduation date or expected graduation date",
        "Include academic honors or distinctions",
      ],
    },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Resume Builder Help</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
              aria-label="Close help modal"
            >
              ×
            </button>
          </div>
          <p className="mt-2 text-blue-100">
            Get tips and guidance for creating an outstanding resume
          </p>
        </div>

        <div className="flex h-[calc(80vh-120px)]">
          {/* Sidebar */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <nav className="p-4">
              {Object.entries(helpSections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                    activeSection === key
                      ? "bg-blue-100 text-blue-800 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {helpSections[activeSection].title}
            </h3>
            <ul className="space-y-3">
              {helpSections[activeSection].content.map((tip, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>

            {/* Additional tips based on section */}
            {activeSection === "getting-started" && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2">Pro Tip:</h4>
                <p className="text-yellow-700 text-sm">
                  Tailor your resume for each job application by emphasizing
                  relevant skills and experiences that match the job
                  description.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Need more help? Contact our support team.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
