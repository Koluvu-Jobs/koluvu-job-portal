'use client';

import React from 'react';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { employerGuideContent } from '../employerGuide';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

export default function EmployerGuide() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link 
              href="/help-center" 
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Help Center
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-blue-800 mb-8">{employerGuideContent.title}</h1>
            {employerGuideContent.sections.map((section, idx) => (
              <div key={idx} className="mb-8">
                <h2 className="text-2xl font-semibold text-blue-800 mb-4">{section.title}</h2>
                <p className="text-gray-600 mb-6">{section.content}</p>
                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((subsection, sidx) => (
                      <div key={sidx} className="bg-gray-50 rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-blue-700 mb-3">{subsection.title}</h3>
                        <p className="text-gray-600 mb-4">{subsection.content}</p>
                        {subsection.features && (
                          <ul className="space-y-3">
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
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}