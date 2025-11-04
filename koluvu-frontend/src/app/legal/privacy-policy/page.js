// src/app/legal/privacy-policy/page.js
'use client';
import Header from '@koluvu/components/Header/Header';
import Footer from '@koluvu/components/Footer/Footer';
import styles from '@koluvu/styles/components/legal/policy.module.css';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';

const PrivacyPolicy = () => {
  const lastUpdatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const [activeSection, setActiveSection] = useState('introduction');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentSection = 'introduction';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
          currentSection = section.id;
        }
      });
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>Privacy Policy | Koluvu</title>
        <meta name="description" content="Koluvu's Privacy Policy outlining how we collect, use, and protect your information." />
      </Head>
      
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className={`${styles.title} text-4xl md:text-5xl font-bold mb-6`}
            >
              Privacy Policy
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed"
            >
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
            >
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10 hover:bg-white/30 transition-all duration-300">
                <span className="font-semibold">Effective:</span> {lastUpdatedDate}
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/10 hover:bg-white/30 transition-all duration-300">
                <span className="font-semibold">Last Updated:</span> {lastUpdatedDate}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Policy Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents */}
            <div className="lg:w-1/4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="sticky top-24 bg-white p-6 rounded-xl shadow-md border border-gray-100 hidden lg:block"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {[
                    { id: 'introduction', title: 'Introduction' },
                    { id: 'information-we-collect', title: 'Information We Collect' },
                    { id: 'how-we-use', title: 'How We Use Your Information' },
                    { id: 'legal-bases', title: 'Legal Bases for Processing' },
                    { id: 'sharing', title: 'Sharing of Information' },
                    { id: 'cookies', title: 'Cookies & Tracking' },
                    { id: 'security', title: 'Data Security' },
                    { id: 'retention', title: 'Data Retention' },
                    { id: 'rights', title: 'Your Rights' },
                    { id: 'children', title: "Children's Privacy" },
                    { id: 'third-party', title: 'Third-Party Integrations' },
                    { id: 'international', title: 'International Transfers' },
                    { id: 'updates', title: 'Policy Updates' },
                    { id: 'contact', title: 'Contact Information' }
                  ].map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${activeSection === item.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                      <span className="text-indigo-600 font-medium mr-2">{index + 1}.</span>
                      {item.title}
                    </button>
                  ))}
                </nav>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="bg-white shadow-xl rounded-xl overflow-hidden"
              >
                <div className="p-8 md:p-12">
                  {/* Introduction */}
                  <motion.section 
                    id="introduction"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>1</span> Introduction
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-6 text-lg leading-relaxed">
                      <motion.p variants={fadeIn}>
                        Welcome to Koluvu, accessible at www.koluvu.com, a digital platform powered by Bhuvih HR Solutions Private Limited. We are committed to respecting your privacy and safeguarding your personal data.
                      </motion.p>
                      <motion.p variants={fadeIn}>
                        This Privacy Policy describes how we collect, use, disclose, store, and protect your data when you use our platform, mobile applications, or interact with us through other services. By accessing or using our services, you consent to the practices described herein.
                      </motion.p>
                    </div>
                  </motion.section>

                  {/* Information We Collect */}
                  <motion.section 
                    id="information-we-collect"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>2</span> Information We Collect
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-8">
                      <motion.p variants={fadeIn}>
                        We collect the following categories of information to provide our services effectively and securely:
                      </motion.p>

                      <motion.div 
                        variants={fadeIn}
                        className="bg-blue-50 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow duration-300"
                      >
                        <h3 className="font-bold text-xl text-blue-800 mb-4 flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          A. Personally Identifiable Information (PII) – Job Seekers
                        </h3>
                        <p className="text-blue-700 mb-4 font-medium">Collected during registration, profile updates, and job applications:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            'Full Name', 'Email Address', 'Mobile Number', 'Residential Address (optional)',
                            'Gender and Date of Birth', 'Profile Picture (optional)', 'Educational Background & Certifications',
                            'Resume/CV and Cover Letters', 'Employment History', 'Job Preferences and Career Goals',
                            'Social Media Integrations (LinkedIn, GitHub, Google Sign-In)', 'Government-Issued IDs (for special verifications, if applicable)'
                          ].map((item, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-start bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              whileHover={{ scale: 1.02 }}
                            >
                              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-gray-700">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div 
                        variants={fadeIn}
                        className="bg-purple-50 p-8 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow duration-300"
                      >
                        <h3 className="font-bold text-xl text-purple-800 mb-4 flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          B. Employer or Recruiter Information
                        </h3>
                        <p className="text-purple-700 mb-4 font-medium">When companies or recruiters register to hire talent:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            'Organization Name and Website', 'Official Email Address and Contact Number',
                            'GST Number / Corporate Registration ID', 'Recruiter Name and Designation',
                            'Company Logo, Mission, and Industry Description', 'Hiring History and Job Posting Details'
                          ].map((item, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-start bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              whileHover={{ scale: 1.02 }}
                            >
                              <svg className="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-gray-700">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div 
                        variants={fadeIn}
                        className="bg-green-50 p-8 rounded-xl border border-green-200 hover:shadow-lg transition-shadow duration-300"
                      >
                        <h3 className="font-bold text-xl text-green-800 mb-4 flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                          </svg>
                          C. Usage Data & Technical Metadata
                        </h3>
                        <p className="text-green-700 mb-4 font-medium">Automatically collected data from user interactions:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            'IP Address and Approximate Location', 'Device Type, Operating System, and Browser',
                            'Session Duration, Login Timestamps', 'Pages Visited, Buttons Clicked, Navigation History',
                            'Job Searches, Applications Submitted, Resume Upload Logs'
                          ].map((item, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-start bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                              whileHover={{ scale: 1.02 }}
                            >
                              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-gray-700">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </motion.section>

                  {/* How We Use Your Information */}
                  <motion.section 
                    id="how-we-use"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>3</span> How We Use Your Information
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-8">
                      <motion.p variants={fadeIn}>We use the information collected to:</motion.p>

                      <div className="space-y-8">
                        <motion.div 
                          variants={fadeIn}
                          className="p-8 bg-indigo-50 rounded-xl border border-indigo-200 hover:shadow-lg transition-shadow"
                        >
                          <h3 className="font-bold text-xl text-indigo-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            A. Deliver Core Services
                          </h3>
                          <ul className="list-disc pl-6 space-y-3 text-gray-700">
                            {[
                              'Register and manage user/employer accounts',
                              'Allow job applications and employer postings',
                              'Enable personalized dashboards and job suggestions',
                              'Power communication between job seekers and recruiters'
                            ].map((item, index) => (
                              <motion.li 
                                key={index}
                                whileHover={{ x: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                {item}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>

                        <motion.div 
                          variants={fadeIn}
                          className="p-8 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow"
                        >
                          <h3 className="font-bold text-xl text-blue-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            B. Enable AI-Driven Features
                          </h3>
                          <ul className="list-disc pl-6 space-y-3 text-gray-700">
                            {[
                              'NLP-based Resume Parsing and Scoring',
                              'Career Path Mapping and ML-based Job Matching',
                              'Skill Gap Analysis and relevant course suggestions',
                              'Salary Prediction Engine based on role, industry, and experience',
                              'AI Mock Interviews, scheduling tools, and feedback analytics'
                            ].map((item, index) => (
                              <motion.li 
                                key={index}
                                whileHover={{ x: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                {item}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>

                        <motion.div 
                          variants={fadeIn}
                          className="p-8 bg-purple-50 rounded-xl border border-purple-200 hover:shadow-lg transition-shadow"
                        >
                          <h3 className="font-bold text-xl text-purple-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            C. Communication Purposes
                          </h3>
                          <ul className="list-disc pl-6 space-y-3 text-gray-700">
                            {[
                              'Notify users about application status and system updates',
                              'Respond to user inquiries or feedback',
                              'Send newsletters, job alerts, or marketing emails (only with consent)'
                            ].map((item, index) => (
                              <motion.li 
                                key={index}
                                whileHover={{ x: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                {item}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>

                        <motion.div 
                          variants={fadeIn}
                          className="p-8 bg-green-50 rounded-xl border border-green-200 hover:shadow-lg transition-shadow"
                        >
                          <h3 className="font-bold text-xl text-green-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            D. Service Improvement & Research
                          </h3>
                          <ul className="list-disc pl-6 space-y-3 text-gray-700">
                            {[
                              'Monitor platform performance and behavior',
                              'Analyze usage trends for enhancing UX',
                              'Conduct internal testing and AI model training (fully anonymized)'
                            ].map((item, index) => (
                              <motion.li 
                                key={index}
                                whileHover={{ x: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                {item}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>

                        <motion.div 
                          variants={fadeIn}
                          className="p-8 bg-red-50 rounded-xl border border-red-200 hover:shadow-lg transition-shadow"
                        >
                          <h3 className="font-bold text-xl text-red-800 mb-4 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            E. Legal & Security Obligations
                          </h3>
                          <ul className="list-disc pl-6 space-y-3 text-gray-700">
                            {[
                              'Prevent fraud, unauthorized access, or abuse',
                              'Ensure data integrity and comply with government regulations',
                              'Enforce terms of service and manage legal claims'
                            ].map((item, index) => (
                              <motion.li 
                                key={index}
                                whileHover={{ x: 5 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                              >
                                {item}
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      </div>
                    </div>
                  </motion.section>

                  {/* Legal Bases for Data Processing */}
                  <motion.section 
                    id="legal-bases"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>4</span> Legal Bases for Data Processing
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-6 text-lg leading-relaxed">
                      <motion.p variants={fadeIn}>Your data is processed based on:</motion.p>
                      <motion.ul 
                        variants={fadeIn}
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {[
                          {
                            title: 'Consent',
                            description: 'For marketing, newsletter subscriptions, etc.',
                            icon: '✍️',
                            bg: 'bg-indigo-50',
                            border: 'border-indigo-200'
                          },
                          {
                            title: 'Contractual Necessity',
                            description: 'To provide services you registered for',
                            icon: '📝',
                            bg: 'bg-blue-50',
                            border: 'border-blue-200'
                          },
                          {
                            title: 'Legal Obligation',
                            description: 'To comply with Indian laws or global data mandates',
                            icon: '⚖️',
                            bg: 'bg-purple-50',
                            border: 'border-purple-200'
                          },
                          {
                            title: 'Legitimate Interest',
                            description: 'To improve user experience, prevent fraud, and enhance security',
                            icon: '🔍',
                            bg: 'bg-green-50',
                            border: 'border-green-200'
                          }
                        ].map((item, index) => (
                          <motion.li 
                            key={index}
                            className={`${item.bg} ${item.border} p-6 rounded-xl border hover:shadow-lg transition-shadow`}
                            whileHover={{ y: -5 }}
                          >
                            <div className="flex items-start">
                              <span className="text-3xl mr-4">{item.icon}</span>
                              <div>
                                <h3 className="font-bold text-lg text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-gray-700">{item.description}</p>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </motion.section>

                  {/* Sharing of Information */}
                  <motion.section 
                    id="sharing"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>5</span> Sharing of Information
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-8">
                      <motion.p variants={fadeIn}>
                        We do not sell or lease your data. However, we may share it under the following scenarios:
                      </motion.p>

                      <motion.div 
                        variants={fadeIn}
                        className="bg-yellow-50 p-8 rounded-xl border border-yellow-200 hover:shadow-lg transition-shadow"
                      >
                        <h3 className="font-bold text-xl text-yellow-800 mb-4 flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          A. With Employers/Recruiters
                        </h3>
                        <ul className="list-disc pl-6 space-y-3 text-gray-700">
                          <motion.li whileHover={{ x: 5 }}>When you apply for jobs or allow your profile to be viewed</motion.li>
                          <motion.li whileHover={{ x: 5 }}>Your resume, profile details, and career preferences will be shared</motion.li>
                        </ul>
                      </motion.div>

                      <motion.div 
                        variants={fadeIn}
                        className="bg-blue-50 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow"
                      >
                        <h3 className="font-bold text-xl text-blue-800 mb-4 flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                          </svg>
                          B. With Service Providers (Processors)
                        </h3>
                        <ul className="list-disc pl-6 space-y-3 text-gray-700">
                          <motion.li whileHover={{ x: 5 }}>Cloud Storage Providers (AWS S3, MongoDB Atlas, etc.)</motion.li>
                          <motion.li whileHover={{ x: 5 }}>AI and Analytics Partners (resume parsing, scoring tools)</motion.li>
                          <motion.li whileHover={{ x: 5 }}>Communication Providers (SMS/email APIs)</motion.li>
                          <motion.li whileHover={{ x: 5 }}>Payment Gateways for subscription transactions</motion.li>
                        </ul>
                        <motion.p 
                          className="mt-4 text-gray-600 bg-white/70 p-4 rounded-lg"
                          whileHover={{ scale: 1.01 }}
                        >
                          All third parties are bound by strict confidentiality agreements and adhere to GDPR, PDP Bill, and other applicable data privacy laws.
                        </motion.p>
                      </motion.div>

                      <motion.div 
                        variants={fadeIn}
                        className="bg-red-50 p-8 rounded-xl border border-red-200 hover:shadow-lg transition-shadow"
                      >
                        <h3 className="font-bold text-xl text-red-800 mb-4 flex items-center">
                          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          C. With Legal or Regulatory Authorities
                        </h3>
                        <ul className="list-disc pl-6 space-y-3 text-gray-700">
                          <motion.li whileHover={{ x: 5 }}>When required by law or court order</motion.li>
                          <motion.li whileHover={{ x: 5 }}>To investigate fraudulent activity or threats to user security</motion.li>
                        </ul>
                      </motion.div>
                    </div>
                  </motion.section>

                  {/* Cookies & Tracking Technologies */}
                  <motion.section 
                    id="cookies"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>6</span> Cookies &amp; Tracking Technologies
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-6 text-lg leading-relaxed">
                      <motion.p variants={fadeIn}>We use cookies, pixels, and local storage to:</motion.p>
                      <motion.ul 
                        variants={fadeIn}
                        className="list-disc pl-6 space-y-3"
                      >
                        {[
                          'Maintain session continuity',
                          'Remember login and site preferences',
                          'Show personalized job recommendations',
                          'Measure platform performance'
                        ].map((item, index) => (
                          <motion.li 
                            key={index}
                            whileHover={{ x: 5 }}
                          >
                            {item}
                          </motion.li>
                        ))}
                      </motion.ul>
                      <motion.p 
                        variants={fadeIn}
                        className="mt-6 bg-gray-100 p-5 rounded-lg"
                      >
                        You can manage cookie preferences through your browser settings. Disabling cookies may affect the site&apos;s functionality.
                      </motion.p>
                    </div>
                  </motion.section>

                  {/* Data Security Measures */}
                  <motion.section 
                    id="security"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>7</span> Data Security Measures
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-6">
                      <motion.p variants={fadeIn}>We implement best-in-class security practices, including:</motion.p>
                      <motion.ul 
                        variants={fadeIn}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {[
                          {
                            title: 'End-to-End HTTPS Encryption',
                            icon: '🔒',
                            bg: 'bg-gray-100'
                          },
                          {
                            title: 'JWT & OAuth Authentication',
                            icon: '🔑',
                            bg: 'bg-gray-100'
                          },
                          {
                            title: 'Encrypted Resume Storage on AWS S3',
                            icon: '💾',
                            bg: 'bg-gray-100'
                          },
                          {
                            title: 'Role-Based Access Control (RBAC)',
                            icon: '👥',
                            bg: 'bg-gray-100'
                          },
                          {
                            title: 'Regular Security Audits & Testing',
                            icon: '🛡️',
                            bg: 'bg-gray-100'
                          },
                          {
                            title: 'Automated Backups',
                            icon: '🔄',
                            bg: 'bg-gray-100'
                          }
                        ].map((item, index) => (
                          <motion.li 
                            key={index}
                            className={`${item.bg} p-4 rounded-lg flex items-center`}
                            whileHover={{ scale: 1.02 }}
                          >
                            <span className="text-2xl mr-3">{item.icon}</span>
                            <span>{item.title}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                      <motion.p 
                        variants={fadeIn}
                        className="mt-6 bg-blue-50 p-5 rounded-lg border border-blue-200"
                      >
                        However, users must also follow personal security practices like not sharing passwords and logging out from public devices.
                      </motion.p>
                    </div>
                  </motion.section>

                  {/* Data Retention Policy */}
                  <motion.section 
                    id="retention"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>8</span> Data Retention Policy
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-6 text-lg leading-relaxed">
                      <motion.p variants={fadeIn}>Your data is retained:</motion.p>
                      <motion.ul 
                        variants={fadeIn}
                        className="list-disc pl-6 space-y-3"
                      >
                        <motion.li whileHover={{ x: 5 }}>As long as your account is active</motion.li>
                        <motion.li whileHover={{ x: 5 }}>As long as required to deliver the services you request</motion.li>
                        <motion.li whileHover={{ x: 5 }}>As needed to comply with legal, contractual, or audit obligations</motion.li>
                      </motion.ul>
                      <motion.p 
                        variants={fadeIn}
                        className="mt-6 bg-purple-50 p-5 rounded-lg border border-purple-200"
                      >
                        To request account deletion, email: bhuvihhr@outlook.com. Data will be deleted within 15 working days, except for logs required for legal purposes.
                      </motion.p>
                    </div>
                  </motion.section>

                  {/* Your Rights */}
                  <motion.section 
                    id="rights"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>9</span> Your Rights (GDPR &amp; Indian Data Protection Bill)
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-6">
                      <motion.p variants={fadeIn}>You have the right to:</motion.p>
                      <motion.div 
                        variants={fadeIn}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      >
                        {[
                          { 
                            icon: '👁️', 
                            title: 'Access', 
                            description: 'View your personal data we process' 
                          },
                          { 
                            icon: '✏️', 
                            title: 'Rectification', 
                            description: 'Correct inaccurate or outdated information' 
                          },
                          { 
                            icon: '🗑️', 
                            title: 'Erasure', 
                            description: 'Delete your profile (Right to be Forgotten)' 
                          },
                          { 
                            icon: '🚫', 
                            title: 'Withdraw Consent', 
                            description: 'For optional services and marketing' 
                          },
                          { 
                            icon: '⏸️', 
                            title: 'Restriction', 
                            description: 'Limit processing in specific scenarios' 
                          },
                          { 
                            icon: '📥', 
                            title: 'Data Portability', 
                            description: 'Download your data in machine-readable format' 
                          }
                        ].map((right, index) => (
                          <motion.div 
                            key={index} 
                            className="flex flex-col p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                            whileHover={{ y: -5 }}
                          >
                            <div className="text-4xl mb-4">{right.icon}</div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2">{right.title}</h3>
                            <p className="text-gray-600">{right.description}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                      <motion.p 
                        variants={fadeIn}
                        className="mt-8 bg-green-50 p-5 rounded-lg border border-green-200 text-center"
                      >
                        To exercise any of these rights, contact: <a href="mailto:bhuvihhr@outlook.com" className="text-blue-600 hover:underline">bhuvihhr@outlook.com</a>
                      </motion.p>
                    </div>
                  </motion.section>

                  {/* Children's Privacy */}
                  <motion.section 
                    id="children"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>10</span> Children&apos;s Privacy
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-6 text-lg leading-relaxed">
                      <motion.p variants={fadeIn}>
                        Koluvu is not intended for users under 16 years of age. We do not knowingly collect data from minors. If we learn that a user is underage, we will delete the account and associated data promptly.
                      </motion.p>
                    </div>
                  </motion.section>

                  {/* Third-Party Integrations and Links */}
                  <motion.section 
                    id="third-party"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>11</span> Third-Party Integrations and Links
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-6 text-lg leading-relaxed">
                      <motion.p variants={fadeIn}>Our platform may integrate or link with services such as:</motion.p>
                      <motion.ul 
                        variants={fadeIn}
                        className="list-disc pl-6 space-y-3"
                      >
                        <motion.li whileHover={{ x: 5 }}>Google Meet / Zoom for interview scheduling</motion.li>
                        <motion.li whileHover={{ x: 5 }}>LinkedIn, GitHub, or Google for login/signup</motion.li>
                        <motion.li whileHover={{ x: 5 }}>Online learning platforms or payment gateways</motion.li>
                      </motion.ul>
                      <motion.p 
                        variants={fadeIn}
                        className="mt-6 bg-yellow-50 p-5 rounded-lg border border-yellow-200"
                      >
                        We are not responsible for external platforms&apos; privacy policies. Users are encouraged to review them individually.
                      </motion.p>
                    </div>
                  </motion.section>

                  {/* International Data Transfers */}
                  <motion.section 
                    id="international"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>12</span> International Data Transfers
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-6 text-lg leading-relaxed">
                      <motion.p variants={fadeIn}>
                        If you are accessing Koluvu outside of India, your data may be stored or processed in India or other jurisdictions. We take adequate contractual and technical measures to ensure data security during international transfers.
                      </motion.p>
                    </div>
                  </motion.section>

                  {/* Updates to This Policy */}
                  <motion.section 
                    id="updates"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="mb-16 pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>13</span> Updates to This Policy
                    </h2>
                    <div className="prose max-w-none text-gray-700 space-y-6 text-lg leading-relaxed">
                      <motion.p variants={fadeIn}>
                        We may update this Privacy Policy to reflect changes in laws, technologies, or our practices. When we do, we will:
                      </motion.p>
                      <motion.ul 
                        variants={fadeIn}
                        className="list-disc pl-6 space-y-3"
                      >
                        <motion.li whileHover={{ x: 5 }}>Notify users via email or a platform alert</motion.li>
                        <motion.li whileHover={{ x: 5 }}>Revise the &quot;Last Updated&quot; date at the top</motion.li>
                      </motion.ul>
                      <motion.p 
                        variants={fadeIn}
                        className="mt-6 bg-blue-100 p-5 rounded-lg"
                      >
                        Please check this page periodically for updates.
                      </motion.p>
                    </div>
                  </motion.section>

                  {/* Contact Information */}
                  <motion.section 
                    id="contact"
                    initial="hidden"
                    animate="visible"
                    variants={sectionVariants}
                    className="pt-16 border-t border-gray-200"
                  >
                    <h2 className={`${styles.sectionHeading} text-2xl md:text-3xl font-bold text-gray-800 mb-8`}>
                      <span className={styles.sectionNumber}>14</span> Contact Information
                    </h2>
                    <div className="prose max-w-none text-gray-700">
                      <motion.p variants={fadeIn}>For privacy concerns, data requests, or complaints, please contact:</motion.p>
                      <motion.div 
                        variants={fadeIn}
                        className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-200 hover:shadow-lg transition-shadow"
                      >
                        <h3 className="font-bold text-xl text-gray-800 mb-6 flex items-center">
                          <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Bhuvih HR Solutions Private Limited
                        </h3>
                        <div className="space-y-4">
                          <motion.p 
                            className="flex items-start bg-white/70 p-4 rounded-lg"
                            whileHover={{ x: 5 }}
                          >
                            <span className="mr-3 text-gray-500">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </span>
                            <span>H-no 8-3-230/1/a/b, V Giri, Safi Residency, 2nd Floor, Yousufguda, Hyderabad, Khairatabad, Telangana – 500045</span>
                          </motion.p>
                          <motion.p 
                            className="flex items-center bg-white/70 p-4 rounded-lg"
                            whileHover={{ x: 5 }}
                          >
                            <span className="mr-3 text-gray-500">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </span>
                            <span>+91 9866875709</span>
                          </motion.p>
                          <motion.p 
                            className="flex items-center bg-white/70 p-4 rounded-lg"
                            whileHover={{ x: 5 }}
                          >
                            <span className="mr-3 text-gray-500">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </span>
                            <span>bhuvihhr@outlook.com</span>
                          </motion.p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.section>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
