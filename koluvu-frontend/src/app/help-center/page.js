// src/app/help-center/page.js

'use client';
import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Clock, MapPin, Users, ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

// FAQ Data
const faqData = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'How do I post a new job?',
        answer: 'Navigate to your employer dashboard and click "Post New Job". Fill in the job details including title, description, requirements, and compensation. Review your posting and click "Publish" to make it live.',
      },
      {
        question: 'How can I schedule interviews?',
        answer: 'Go to "Applications" in your dashboard, select a candidate, and click "Schedule Interview". Choose your preferred date and time, add interview details, and send the invitation.',
      },
      {
        question: 'How can I get my account verified?',
        answer: 'Click on your profile settings and select "Verify Account". Upload valid business documents such as business license, tax ID, or incorporation papers. Verification typically takes 1-2 business days.',
      },
    ]
  },
  {
    category: 'Search & Filtering',
    questions: [
      {
        question: 'What is Boolean Search?',
        answer: 'Boolean Search uses logical operators (AND, OR, NOT) to refine candidate search results. For example, use "Java AND Python" to find candidates with both skills, or "Manager NOT Assistant" to exclude certain roles.',
      },
      {
        question: 'How do I use advanced filters?',
        answer: 'Access advanced filters from the search page. You can filter by location, experience level, education, skills, salary range, and availability. Save your filter combinations for future use.',
      },
    ]
  },
  {
    category: 'Account Management',
    questions: [
      {
        question: 'How do I edit my company profile?',
        answer: 'Navigate to Settings > Company Profile. Update your company information, logo, description, and contact details. Changes are saved automatically and appear immediately on your public profile.',
      },
      {
        question: 'Can I cancel my subscription?',
        answer: 'Yes, you can cancel your subscription at any time from Account Settings > Billing. Your account will remain active until the end of your current billing period.',
      },
      {
        question: 'How do I manage team members?',
        answer: 'Go to Settings > Team Management to add, remove, or modify team member permissions. You can assign different access levels including Admin, Recruiter, and Viewer roles.',
      },
    ]
  },
  {
    category: 'Billing & Support',
    questions: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise accounts. All payments are processed securely through our encrypted payment system.',
      },
      {
        question: 'How can I contact support?',
        answer: 'You can reach our support team 24/7 via live chat, email at support@company.com, or phone at 1-800-SUPPORT. Premium subscribers get priority support with faster response times.',
      },
    ]
  },
];

// Documentation Data
const docSections = [
  {
    title: "🔹 Employer Dashboard Guide",
    anchor: "dashboard-guide",
    items: [
      { subtitle: "Getting Started", description: "Step-by-step guide on account setup, verification, and profile completion." },
      { subtitle: "Posting Jobs", description: "Instructions on how to create, edit, and publish job posts." },
      { subtitle: "Manage Applications", description: "Learn how to view, shortlist, reject, and schedule interviews with candidates." },
      { subtitle: "Boolean Search", description: "Use advanced filters to narrow down candidates using logic-based search." },
      { subtitle: "ATS Integration", description: "Guide to using the ATS for filtering, scoring, and managing applicants." },
      { subtitle: "Interview Scheduler", description: "Automate interviews via Koluvu Video Call or Zoom." },
    ],
  },
  {
    title: "🔹 Subscription Plans",
    anchor: "subscription-plans",
    items: [
      { subtitle: "Plan Types", description: "Understand plan types (Monthly, Quarterly, Half-Yearly, Yearly)." },
      { subtitle: "Manage Subscription", description: "How to upgrade, renew, or cancel a subscription." },
      { subtitle: "Premium Access", description: "Access to Boolean search, job boosts, analytics, etc." },
    ],
  },
  {
    title: "🔹 AI Features",
    anchor: "ai-features",
    items: [
      { subtitle: "Resume Parsing & Matching", description: "Extract and match key resume data to job roles." },
      { subtitle: "Candidate Ranking", description: "AI-generated scoring and ranking of top candidates." },
      { subtitle: "Smart Job Suggestions", description: "AI-driven job recommendations for candidates." },
      { subtitle: "Interview Question Generation", description: "Auto-generate relevant interview questions." },
    ],
  },
];

const ContactSupport = () => {
  const handlePhoneCall = () => {
    window.open('tel:+919866875709', '_self');
  };
  const handleEmailClick = () => {
    window.open('mailto:bhuvihhr@outlook.com', '_self');
  };
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919866875709', '_blank');
  };
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-12 mb-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h2 className="text-2xl font-bold text-white flex items-center">
          <Users className="mr-2" size={24} />
          Contact Support
        </h2>
        <p className="text-blue-100 mt-1">We're here to help you 24/7</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div onClick={handlePhoneCall} className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 cursor-pointer transition-colors duration-200">
            <Phone className="w-6 h-6 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Phone Support</p>
              <p className="text-lg font-semibold text-green-600">+91 9866875709</p>
            </div>
          </div>
          <div onClick={handleEmailClick} className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors duration-200">
            <Mail className="w-6 h-6 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Email Support</p>
              <p className="text-lg font-semibold text-blue-600">bhuvihhr@outlook.com</p>
            </div>
          </div>
          <div onClick={handleWhatsAppClick} className="flex items-center p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 cursor-pointer transition-colors duration-200">
            <MessageCircle className="w-6 h-6 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">WhatsApp</p>
              <p className="text-lg font-semibold text-green-500">+91 9866875709</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <Clock className="w-6 h-6 text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Business Hours</p>
              <p className="text-sm text-gray-600">Mon - Fri: 9:00 AM - 6:00 PM IST</p>
            </div>
          </div>
          <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <MapPin className="w-6 h-6 text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Location</p>
              <p className="text-sm text-gray-600">Hyderabad, Telangana, India</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">Choose your preferred method to get in touch with our support team</p>
      </div>
    </div>
  );
};

const HelpCenterDocs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const toggleSection = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };
  const filteredSections = docSections.map((section) => ({
    ...section,
    items: section.items.filter((item) =>
      item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  }));
  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto p-6 space-y-6 md:space-y-0 md:space-x-6">
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-blue-800 mb-4">📘 Documentation</h1>
        <p className="text-gray-600 mb-6">Everything you need to get started and manage your hiring with ease.</p>
        <input
          type="text"
          placeholder="Search topics..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-6 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-400"
        />
        {filteredSections.map((section, idx) => (
          <div key={idx} id={section.anchor} className="mb-6 border border-gray-200 rounded-2xl shadow-sm">
            <button className="w-full text-left p-4 bg-blue-100 rounded-t-2xl hover:bg-blue-200 transition" onClick={() => toggleSection(idx)}>
              <h2 className="text-xl font-semibold text-blue-800">{section.title}</h2>
            </button>
            {openIndex === idx && section.items.length > 0 && (
              <div className="bg-white px-6 py-4 space-y-4 rounded-b-2xl">
                {section.items.map((item, i) => (
                  <div key={i}>
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">📌 {item.subtitle}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
            {openIndex === idx && section.items.length === 0 && (
              <div className="bg-white px-6 py-4 text-gray-500 italic">No matching topics found.</div>
            )}
          </div>
        ))}
      </div>
      <aside className="w-full md:w-64 sticky top-20 h-fit border border-gray-200 rounded-2xl shadow-sm bg-white p-4">
        <h2 className="text-lg font-bold text-blue-700 mb-3">Quick Navigation</h2>
        <ul className="space-y-2 text-blue-600 text-sm">
          {docSections.map((sec, idx) => (
            <li key={idx}>
              <a href={`#${sec.anchor}`} className="hover:underline">{sec.title}</a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
};

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const allQuestions = faqData.flatMap(category => category.questions.map(q => ({ ...q, category: category.category })));
  const filteredQuestions = allQuestions.filter(item => {
    const matchesSearch = searchTerm === '' || item.question.toLowerCase().includes(searchTerm.toLowerCase()) || item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  const categories = ['all', ...faqData.map(cat => cat.category)];
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const clearSearch = () => {
    setSearchTerm('');
    setActiveCategory('all');
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <HelpCircle className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Find answers to common questions about our platform. Can't find what you're looking for? <span className="text-blue-600 cursor-pointer hover:underline ml-1">Contact our support team</span></p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <input type="text" placeholder="Search FAQs..." className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
            <div className="flex flex-wrap gap-2 w-full lg:w-auto">
              {categories.map(category => (
                <button key={category} onClick={() => setActiveCategory(category)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === category ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{category === 'all' ? 'All Categories' : category}</button>
              ))}
            </div>
          </div>
          {(searchTerm || activeCategory !== 'all') && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-gray-600">{filteredQuestions.length} result{filteredQuestions.length !== 1 ? 's' : ''} found</span>
              <button onClick={clearSearch} className="text-sm text-blue-600 hover:text-blue-800 underline">Clear filters</button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filteredQuestions.length ? (
            filteredQuestions.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <button onClick={() => toggleFAQ(index)} className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-xl transition-all duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{faq.category}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">{faq.question}</h3>
                    </div>
                    <div className="flex-shrink-0">{openIndex === index ? (<ChevronUp className="text-blue-600 transform transition-transform duration-200" size={24} />) : (<ChevronDown className="text-gray-400 transform transition-transform duration-200" size={24} />)}</div>
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Search className="mx-auto text-gray-300 mb-4" size={64} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500 mb-4">We couldn't find any FAQs matching "{searchTerm}" in {activeCategory === 'all' ? 'all categories' : activeCategory}</p>
              <button onClick={clearSearch} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">Clear search</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function HelpCenter() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-grow">
        <section className="py-12 bg-gradient-to-r from-blue-50 to-blue-100 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">Welcome to the Koluvu Help Center</h1>
          <p className="text-lg md:text-xl text-blue-700 max-w-2xl mx-auto">We're here to help you succeed. Browse FAQs, explore our documentation, or contact our support team for personalized assistance.</p>
        </section>
        <FAQs />
        <HelpCenterDocs />
        <ContactSupport />
      </main>
    </div>
  );
}
