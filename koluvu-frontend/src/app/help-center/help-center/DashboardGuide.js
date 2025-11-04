'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { employerGuideContent } from './guides/employerGuide';
import { employeeGuideContent } from './guides/employeeGuide';
import { trainingGuideContent } from './guides/trainingGuide';

const GuideSection = ({ section }) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-blue-800 mb-4">{section.title}</h3>
      <p className="text-gray-600 mb-4">{section.content}</p>
      {section.subsections && (
        <div className="space-y-6">
          {section.subsections.map((subsection, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
              <h4 className="text-lg font-semibold text-blue-700 mb-3">{subsection.title}</h4>
              <p className="text-gray-600 mb-4">{subsection.content}</p>
              {subsection.features && (
                <ul className="space-y-2">
                  {subsection.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-blue-500 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const DashboardGuide = ({ type }) => {
  let guideContent;
  switch (type) {
    case 'employer':
      guideContent = employerGuideContent;
      break;
    case 'employee':
      guideContent = employeeGuideContent;
      break;
    case 'training':
      guideContent = trainingGuideContent;
      break;
    default:
      guideContent = employerGuideContent;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">{guideContent.title}</h2>
          {guideContent.sections.map((section, idx) => (
            <GuideSection key={idx} section={section} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardGuide;