// src/app/main/dashboard/employee/helpcenter.js

'use client';
import React, { useState } from 'react';
import {
  FaQuestionCircle,
  FaSearch,
  FaRocket,
  FaBriefcase,
  FaRobot,
  FaCalendarAlt,
  FaCreditCard,
  FaArrowRight,
  FaEnvelope,
  FaPhoneAlt,
  FaHeadset,
  FaLightbulb,
} from 'react-icons/fa';

const HelpCenterPage = ({ isDarkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAccordion, setActiveAccordion] = useState('collapseOne');

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    alert(`Searching for: ${searchTerm}`);
  };

  const handleSupport = (type) => {
    alert(`Initiating ${type} support request`);
  };

  const popularTopics = [
    'Getting Started',
    'Posting Jobs',
    'AI Matching',
    'Interviews',
    'Billing',
    'Account Settings',
    'Candidate Management',
    'Reports',
  ];

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-blue-50'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-blue-600 to-indigo-800'} text-white rounded-t-xl p-8 shadow-lg mb-0`}>
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <FaQuestionCircle className="mr-3" />
            Help Center
          </h1>
          <p className="opacity-90">Find answers to your questions or contact our support team</p>
        </div>

        {/* Search */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-b-xl p-8 shadow-md mb-8`}>
          <div className="relative">
            <input
              type="text"
              className={`w-full px-6 py-4 border-2 rounded-full focus:ring-2 transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600 focus:border-blue-400 focus:ring-blue-800 text-white' : 'border-gray-200 focus:border-blue-400 focus:ring-blue-200'}`}
              placeholder="Search help articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className={`absolute right-2 top-2 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all flex items-center ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-gradient-to-r from-blue-600 to-indigo-800'}`}
            >
              <FaSearch className="mr-2" />
              Search
            </button>
          </div>
        </div>

        {/* Popular Topics */}
        <div className="mb-8">
          <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : ''}`}>Popular Topics</h2>
          <div className="flex flex-wrap gap-2">
            {popularTopics.map((topic, index) => (
              <a
                key={index}
                href={`#${topic.replace(/\s+/g, '').toLowerCase()}`}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${isDarkMode ? 'bg-gray-700 text-blue-300 hover:bg-gray-600' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              >
                {topic}
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Getting Started */}
          <div className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className={`${isDarkMode ? 'bg-blue-700' : 'bg-gradient-to-r from-blue-600 to-indigo-800'} text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4`}>
              <FaRocket />
            </div>
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : ''}`}>Getting Started</h3>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Learn how to set up your account and post your first job listing.
            </p>
            <a
              href="#gettingstarted"
              className={`font-medium inline-flex items-center transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              View Guide <FaArrowRight className="ml-2" />
            </a>
          </div>

          {/* Job Management */}
          <div className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className={`${isDarkMode ? 'bg-blue-700' : 'bg-gradient-to-r from-blue-600 to-indigo-800'} text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4`}>
              <FaBriefcase />
            </div>
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : ''}`}>Job Management</h3>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              How to post, edit, and manage your job listings effectively.
            </p>
            <a
              href="#postingjobs"
              className={`font-medium inline-flex items-center transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              View Guide <FaArrowRight className="ml-2" />
            </a>
          </div>

          {/* AI Tools */}
          <div className={`p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border h-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
            <div className={`${isDarkMode ? 'bg-blue-700' : 'bg-gradient-to-r from-blue-600 to-indigo-800'} text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4`}>
              <FaRobot />
            </div>
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : ''}`}>AI Tools</h3>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Maximize our AI candidate matching and screening features.
            </p>
            <a
              href="#aimatching"
              className={`font-medium inline-flex items-center transition-colors ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              View Guide <FaArrowRight className="ml-2" />
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div className={`rounded-xl shadow-md overflow-hidden mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : ''}`}>Frequently Asked Questions</h2>
          </div>
          <div className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {/* Getting Started */}
            <div id="gettingstarted" className={`p-6 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleAccordion('collapseOne')}
              >
                <div className="flex items-center">
                  <FaQuestionCircle className="text-blue-600 mr-3" />
                  <span className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Getting Started with Koluvu</span>
                </div>
                <span className={isDarkMode ? 'text-white' : ''}>{activeAccordion === 'collapseOne' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'collapseOne' && (
                <div className="mt-4 pl-9">
                  <p className={isDarkMode ? 'text-gray-300' : ''}>Welcome to Koluvu! Here's how to get started:</p>
                  <ol className={`list-decimal pl-5 space-y-2 mt-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
                    <li>Create your employer profile by filling in your company details</li>
                    <li>Set up your hiring preferences and job requirements</li>
                    <li>Post your first job listing using our simple form</li>
                    <li>Review applications and manage candidates through your dashboard</li>
                  </ol>
                  <p className={`mt-3 ${isDarkMode ? 'text-gray-300' : ''}`}>
                    For more detailed instructions, check our{' '}
                    <a href="#" className={`${isDarkMode ? 'text-blue-400 hover:underline' : 'text-blue-600 hover:underline'}`}>
                      Getting Started Guide
                    </a>
                    .
                  </p>
                  <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <div className="flex items-start">
                      <FaLightbulb className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div className={isDarkMode ? 'text-gray-300' : ''}>
                        <strong>Pro Tip:</strong> Complete your company profile to increase candidate
                        trust and application rates.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Posting Jobs */}
            <div id="postingjobs" className={`p-6 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleAccordion('collapseTwo')}
              >
                <div className="flex items-center">
                  <FaBriefcase className="text-blue-600 mr-3" />
                  <span className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Posting and Managing Jobs</span>
                </div>
                <span className={isDarkMode ? 'text-white' : ''}>{activeAccordion === 'collapseTwo' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'collapseTwo' && (
                <div className="mt-4 pl-9">
                  <h6 className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Posting a New Job:</h6>
                  <ol className={`list-decimal pl-5 space-y-2 mt-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
                    <li>Go to the "Post Job" section in your dashboard</li>
                    <li>Fill in all required details about the position</li>
                    <li>Use our AI autofill feature to speed up the process</li>
                    <li>Preview and submit your job posting</li>
                  </ol>

                  <h6 className={`font-semibold mt-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Managing Jobs:</h6>
                  <ul className={`list-disc pl-5 space-y-2 mt-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
                    <li>View all your active jobs in the "Active Jobs" section</li>
                    <li>Edit job details anytime before the posting expires</li>
                    <li>Renew expired jobs if needed</li>
                    <li>Close positions when filled</li>
                  </ul>

                  <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <div className="flex items-start">
                      <FaLightbulb className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div className={isDarkMode ? 'text-gray-300' : ''}>
                        <strong>Pro Tip:</strong> Use our job template library to quickly create
                        consistent, effective job postings.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Matching */}
            <div id="aimatching" className={`p-6 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleAccordion('collapseThree')}
              >
                <div className="flex items-center">
                  <FaRobot className="text-blue-600 mr-3" />
                  <span className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Using AI Candidate Matching</span>
                </div>
                <span className={isDarkMode ? 'text-white' : ''}>{activeAccordion === 'collapseThree' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'collapseThree' && (
                <div className="mt-4 pl-9">
                  <p className={isDarkMode ? 'text-gray-300' : ''}>Our AI Candidate Matching system helps you find the best candidates:</p>
                  <ul className={`list-disc pl-5 space-y-2 mt-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
                    <li>The system analyzes job requirements and candidate profiles</li>
                    <li>Matches are ranked by relevance score (ATS Score)</li>
                    <li>View detailed match analysis for each candidate</li>
                    <li>Save your favorite candidates for future reference</li>
                  </ul>
                  <p className={`mt-3 ${isDarkMode ? 'text-gray-300' : ''}`}>
                    To improve matches, ensure your job descriptions are detailed and include all
                    required skills.
                  </p>

                  <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <div className="flex items-start">
                      <FaLightbulb className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div className={isDarkMode ? 'text-gray-300' : ''}>
                        <strong>Pro Tip:</strong> Use the "Preferred Skills" section to prioritize
                        must-have qualifications.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Interviews */}
            <div id="interviews" className={`p-6 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleAccordion('collapseFour')}
              >
                <div className="flex items-center">
                  <FaCalendarAlt className="text-blue-600 mr-3" />
                  <span className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Interview Scheduling</span>
                </div>
                <span className={isDarkMode ? 'text-white' : ''}>{activeAccordion === 'collapseFour' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'collapseFour' && (
                <div className="mt-4 pl-9">
                  <h6 className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Scheduling Interviews:</h6>
                  <ol className={`list-decimal pl-5 space-y-2 mt-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
                    <li>Select candidates from your applicant list</li>
                    <li>Click "Schedule Interview"</li>
                    <li>Choose date, time, and interview type (in-person/virtual)</li>
                    <li>Add interview details and notes</li>
                    <li>Send invitation to candidate</li>
                  </ol>

                  <h6 className={`font-semibold mt-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Managing Interviews:</h6>
                  <ul className={`list-disc pl-5 space-y-2 mt-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
                    <li>View all scheduled interviews in your calendar</li>
                    <li>Reschedule or cancel interviews as needed</li>
                    <li>Add interview feedback after completion</li>
                    <li>Track candidate progress through hiring stages</li>
                  </ul>

                  <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <div className="flex items-start">
                      <FaLightbulb className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div className={isDarkMode ? 'text-gray-300' : ''}>
                        <strong>Pro Tip:</strong> Use our interview question bank to quickly prepare
                        for candidate interviews.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Billing */}
            <div id="billing" className={`p-6 transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
              <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => toggleAccordion('collapseFive')}
              >
                <div className="flex items-center">
                  <FaCreditCard className="text-blue-600 mr-3" />
                  <span className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>Subscription & Billing</span>
                </div>
                <span className={isDarkMode ? 'text-white' : ''}>{activeAccordion === 'collapseFive' ? '−' : '+'}</span>
              </button>
              {activeAccordion === 'collapseFive' && (
                <div className="mt-4 pl-9">
                  <h6 className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Subscription Plans:</h6>
                  <p className={isDarkMode ? 'text-gray-300' : ''}>We offer flexible subscription plans to meet your hiring needs:</p>
                  <ul className={`list-disc pl-5 space-y-2 mt-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
                    <li>
                      <strong>Basic:</strong> 5 job postings/month, limited candidates
                    </li>
                    <li>
                      <strong>Professional:</strong> 15 job postings/month, advanced features
                    </li>
                    <li>
                      <strong>Enterprise:</strong> Unlimited postings, full feature access
                    </li>
                  </ul>

                  <h6 className={`font-semibold mt-4 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Billing Information:</h6>
                  <ul className={`list-disc pl-5 space-y-2 mt-2 ${isDarkMode ? 'text-gray-300' : ''}`}>
                    <li>Monthly or annual billing options available</li>
                    <li>Secure payment processing</li>
                    <li>Download invoices from your account</li>
                    <li>Upgrade or downgrade anytime</li>
                  </ul>

                  <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <div className="flex items-start">
                      <FaLightbulb className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                      <div className={isDarkMode ? 'text-gray-300' : ''}>
                        <strong>Pro Tip:</strong> Annual plans save you 20% compared to monthly
                        billing.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Support Card */}
        <div className={`rounded-xl shadow-lg p-8 text-center border-t-4 border-blue-600 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-2xl font-semibold mb-3 flex items-center justify-center ${isDarkMode ? 'text-white' : ''}`}>
            <FaHeadset className="text-blue-600 mr-3" />
            Need More Help?
          </h3>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Our support team is available 24/7 to assist you with any questions or issues.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => handleSupport('email')}
              className={`text-white px-6 py-3 rounded-full transition-colors flex items-center justify-center ${isDarkMode ? 'bg-blue-700 hover:bg-blue-800' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <FaEnvelope className="mr-2" />
              Email Support
            </button>
            <button
              onClick={() => handleSupport('call')}
              className="bg-teal-400 hover:bg-teal-500 text-white px-6 py-3 rounded-full transition-colors flex items-center justify-center"
            >
              <FaPhoneAlt className="mr-2" />
              Call Support +91 98668 75709
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
