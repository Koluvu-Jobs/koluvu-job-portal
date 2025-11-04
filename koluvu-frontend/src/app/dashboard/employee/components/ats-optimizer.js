// src/app/main/dashboard/employee/components/ats-optimizer.js

'use client';

import { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from 'next/dynamic';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const resultsVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

const EmployeeSidebar = () => {
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      const header = document.querySelector('header');
      if (header) setHeaderHeight(header.offsetHeight);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const navItems = [
    {
      name: "Resume Builder",
      icon: "📝",
      path: "/main/resume-builder",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-700"
    },
    {
      name: "Mock Interview",
      icon: "💬",
      path: "/main/dashboard/employee/components/mock-interview",
      bgColor: "bg-green-50 hover:bg-green-100",
      textColor: "text-green-700"
    }
  ];

  if (!isClient) return null;

  if (isMobile) {
    return (
      <>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed right-4 bottom-4 z-50 p-4 bg-indigo-600 text-white rounded-full shadow-lg lg:hidden"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 w-3/4 h-full bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Employee Tools</h3>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex-1 flex flex-col">
                  {navItems.map((item, index) => (
                    <Link key={index} href={item.path} passHref legacyBehavior>
                      <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center p-4 ${item.bgColor} ${item.textColor} transition-colors cursor-pointer border-b border-gray-100 last:border-b-0`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="text-2xl mr-3">{item.icon}</span>
                        <span className="font-medium">{item.name}</span>
                      </motion.a>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </>
    );
  }

  return (
    <div 
      className="hidden lg:flex flex-col w-64 bg-white shadow-lg border-l border-gray-200 z-40"
      style={{
        position: 'sticky',
        top: `${headerHeight}px`,
        height: `calc(100vh - ${headerHeight}px)`,
        alignSelf: 'flex-start'
      }}
    >
      <h3 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200">
        Employee Tools
      </h3>
      
      <div className="grid grid-rows-2 h-full">
        {navItems.map((item, index) => (
          <Link key={index} href={item.path} passHref legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center ${item.bgColor} ${item.textColor} transition-colors cursor-pointer border-b border-gray-100 last:border-b-0`}
            >
              <span className="text-2xl mr-3">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </motion.a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default function AtsOptimizer() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [matchScore, setMatchScore] = useState(null);
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState("single");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pdfjsLib, setPdfjsLib] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      import('pdfjs-dist').then((module) => {
        setPdfjsLib(module);
        setupPDFWorker(module);
      });
    }
  }, []);

  const analyzeResume = (resumeText, jobDesc) => {
    if (!resumeText || !jobDesc) {
      return { error: "Please provide both resume and job description", score: null, keywords: [] };
    }

    const resumeWords = resumeText.toLowerCase().split(/\W+/).filter(word => word.length > 0);
    const jobWords = jobDesc.toLowerCase().split(/\W+/).filter(word => word.length > 0);
    const jobKeywords = new Set(jobWords.filter(word => word.length > 2));

    if (jobKeywords.size === 0) {
      return { error: "No valid keywords found in job description", score: null, keywords: [] };
    }

    const matched = resumeWords.filter(word => jobKeywords.has(word));
    const uniqueMatched = [...new Set(matched)];
    const score = Math.min(100, Math.round((uniqueMatched.length / jobKeywords.size) * 100));

    return { score, keywords: uniqueMatched, error: null };
  };

  const setupPDFWorker = async (pdfjs) => {
    if (typeof window !== 'undefined' && pdfjs) {
      try {
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        console.log('PDF.js worker initialized successfully');
      } catch (error) {
        console.error('Failed to initialize PDF.js worker:', error);
      }
    }
  };

  const parsePDFClientSide = async (file) => {
    if (typeof window === 'undefined' || !pdfjsLib) return '';
    
    try {
      const arrayBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });

      const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
      let text = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(' ') + '\n';
      }
      
      return text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Failed to parse PDF file');
    }
  };

  const parseDocument = async (file) => {
    try {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!validTypes.includes(file.type) && !file.name.endsWith('.docx')) {
        throw new Error('Unsupported file type. Only PDF and DOCX are supported.');
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/parse-resume', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `Server responded with ${res.status}`);
        }

        const contentType = res.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error('Invalid response format from server');
        }

        const { text, error } = await res.json();
        if (error) throw new Error(error);
        if (!text) throw new Error('No text content found in document');

        return text;
      } catch (serverError) {
        console.warn("Server-side parsing failed, falling back to client-side:", serverError);
        
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          return await parsePDFClientSide(file);
        }
        
        throw new Error("Document parsing failed. Please try a different file.");
      }
    } catch (err) {
      console.error("Document parsing error:", err);
      throw new Error(`Failed to parse document: ${err.message}`);
    }
  };

  const performOCR = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const { data: { text } } = await Tesseract.recognize(
            reader.result,
            "eng",
            {
              logger: m => {
                if (m.status === 'recognizing text') {
                  setUploadProgress(Math.round(m.progress * 100));
                }
              }
            }
          );
          resolve(text.trim());
        } catch (err) {
          reject(new Error("Failed to extract text from image (OCR error)"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read image file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setResumeText("");
    setUploadProgress(0);

    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit");
      }

      if (file.type === "text/plain") {
        const text = await file.text();
        setResumeText(text.trim());
      } else if (file.type.startsWith("image/")) {
        const text = await performOCR(file);
        setResumeText(text);
      } else if (file.type === "application/pdf" || file.name.endsWith('.docx')) {
        const text = await parseDocument(file);
        setResumeText(text);
      } else {
        throw new Error("Unsupported file type. Please upload TXT, PDF, DOCX, or image files.");
      }
    } catch (err) {
      console.error("Processing error:", err);
      setError(err.message || "Failed to process file");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      if (!jobDesc) throw new Error("Please provide a job description");
      if (files.length === 0) throw new Error("Please upload at least one resume");

      const formData = new FormData();
      files.forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds 5MB limit`);
        }
        formData.append('resumes', file);
      });
      formData.append('jobDescription', jobDesc);

      const res = await fetch('/api/bulk-analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        let errorMsg = 'Bulk analysis failed';
        try {
          const errorData = await res.json();
          errorMsg = errorData.error || errorMsg;
        } catch (e) {
          errorMsg = res.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format');
      }

      setResults(await res.json());
    } catch (err) {
      console.error("Bulk upload error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const LoadingSpinner = ({ progress }) => (
    <div className="flex flex-col items-center py-4 space-y-2">
      <div className="relative w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span className="text-sm text-indigo-600">
        {progress < 100 ? `Processing... ${progress}%` : 'Finalizing...'}
      </span>
    </div>
  );

  const FilePreview = ({ files }) => (
    <div className="mt-3">
      <p className="text-sm font-medium text-gray-700">Selected files:</p>
      <ul className="list-disc pl-5 text-sm text-gray-600">
        {files.map((file, i) => (
          <li key={i}>
            {file.name} ({Math.round(file.size / 1024)} KB)
          </li>
        ))}
      </ul>
    </div>
  );

  if (!isMounted) return null;

  return (
    <div className="relative flex min-h-screen">
      <motion.div
        className="flex-1 max-w-6xl mx-auto p-4 sm:p-6 bg-gray-50"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
            ATS Resume Optimizer
          </h1>
          <p className="text-center text-sm sm:text-base text-gray-600 mb-6">
            Analyze your resume against job descriptions to improve your chances
          </p>
        </motion.div>

        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 text-sm sm:text-base ${
              activeTab === 'single' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('single')}
          >
            Single Resume
          </button>
          <button
            className={`flex-1 sm:flex-none py-3 px-4 sm:px-6 text-sm sm:text-base ${
              activeTab === 'bulk' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('bulk')}
          >
            Bulk Analysis
          </button>
        </div>

        {activeTab === 'single' && (
          <>
            <motion.div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6" variants={itemVariants}>
              <label className="block text-base sm:text-lg font-semibold mb-3 text-gray-700">
                Upload Resume (Max 5MB)
              </label>
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".txt,.pdf,.docx,image/*"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="block w-full text-xs sm:text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 sm:file:py-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {(loading || uploadProgress > 0) && <LoadingSpinner progress={uploadProgress} />}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <p className="text-xs sm:text-sm text-gray-500">
                  Supported formats: TXT, PDF, DOCX, JPG, PNG (Images will be processed with OCR)
                </p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <motion.div className="bg-white p-4 sm:p-6 rounded-lg shadow" variants={itemVariants}>
                <label className="block text-base sm:text-lg font-semibold mb-3 text-gray-700">
                  Resume Text
                </label>
                <textarea
                  className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 resize-none text-sm sm:text-base"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Resume content will appear here..."
                />
                {resumeText && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    {resumeText.split(/\s+/).filter(Boolean).length} words
                  </p>
                )}
              </motion.div>

              <motion.div className="bg-white p-4 sm:p-6 rounded-lg shadow" variants={itemVariants}>
                <label className="block text-base sm:text-lg font-semibold mb-3 text-gray-700">
                  Job Description
                </label>
                <textarea
                  className="w-full h-48 sm:h-64 p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 resize-none text-sm sm:text-base"
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Paste the job description here..."
                />
                {jobDesc && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    {jobDesc.split(/\s+/).filter(Boolean).length} words
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div className="flex justify-center mb-6 sm:mb-8" variants={itemVariants}>
              <button
                onClick={() => {
                  const analysis = analyzeResume(resumeText, jobDesc);
                  if (analysis.error) {
                    setError(analysis.error);
                    setMatchScore(null);
                    setMatchedKeywords([]);
                  } else {
                    setError(null);
                    setMatchScore(analysis.score);
                    setMatchedKeywords(analysis.keywords);
                  }
                }}
                disabled={loading || !resumeText || !jobDesc}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow-md text-sm sm:text-base transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Analyze Resume
              </button>
            </motion.div>
          </>
        )}

        {activeTab === 'bulk' && (
          <>
            <motion.div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6" variants={itemVariants}>
              <label className="block text-base sm:text-lg font-semibold mb-3 text-gray-700">
                Job Description
              </label>
              <textarea
                className="w-full h-32 p-3 sm:p-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 resize-none text-sm sm:text-base"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                placeholder="Paste job description for bulk analysis..."
              />
              {jobDesc && (
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  {jobDesc.split(/\s+/).filter(Boolean).length} words
                </p>
              )}
            </motion.div>

            <motion.div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6" variants={itemVariants}>
              <label className="block text-base sm:text-lg font-semibold mb-3 text-gray-700">
                Upload Resumes (Max 5MB each)
              </label>
              <form onSubmit={handleBulkUpload}>
                <div className="space-y-4">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.docx"
                    onChange={(e) => setFiles([...e.target.files])}
                    className="block w-full text-xs sm:text-sm text-gray-500 file:mr-2 file:py-1.5 file:px-3 sm:file:py-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {files.length > 0 && <FilePreview files={files} />}
                  <button
                    type="submit"
                    disabled={loading || files.length === 0 || !jobDesc}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 sm:py-3 sm:px-8 rounded-lg shadow-md text-sm sm:text-base transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Analyze Resumes'}
                  </button>
                  {(loading || uploadProgress > 0) && <LoadingSpinner progress={uploadProgress} />}
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <p className="text-xs sm:text-sm text-gray-500">
                    Supported formats: PDF, DOCX (Max 10 files at once)
                  </p>
                </div>
              </form>
            </motion.div>
          </>
        )}

        <AnimatePresence>
          {activeTab === 'single' && matchScore !== null && (
            <motion.div
              className="bg-white border-t-4 border-indigo-600 p-4 sm:p-6 rounded-lg shadow-lg mb-6"
              variants={resultsVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-2">
                  ATS Score: {matchScore}%
                </h2>
                <div className="mb-4">
                  {matchScore < 60 && (
                    <p className="text-orange-600 font-medium">Needs improvement - add more keywords</p>
                  )}
                  {matchScore >= 60 && matchScore < 85 && (
                    <p className="text-yellow-600 font-medium">Good match - could be stronger</p>
                  )}
                  {matchScore >= 85 && (
                    <p className="text-green-600 font-medium">Excellent match!</p>
                  )}
                </div>
              </div>

              <div className="mt-4 sm:mt-6">
                <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-700">
                  Matched Keywords:
                </h4>
                <div className="flex flex-wrap gap-1 sm:gap-2 max-h-48 overflow-y-auto p-1 sm:p-2">
                  {matchedKeywords.length > 0 ? (
                    matchedKeywords.map((word, i) => (
                      <motion.span
                        key={i}
                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                        whileHover={{ scale: 1.05 }}
                      >
                        {word}
                      </motion.span>
                    ))
                  ) : (
                    <p className="text-gray-500">No keywords matched</p>
                  )}
                </div>
              </div>

              {matchScore < 85 && (
                <div className="mt-4 sm:mt-6 bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-1 sm:mb-2 text-sm sm:text-base">
                    Recommendations:
                  </h4>
                  <ul className="list-disc pl-5 text-sm sm:text-base text-blue-700 space-y-1">
                    <li>Incorporate more keywords from the job description naturally</li>
                    <li>Highlight relevant skills and experiences</li>
                    <li>Use the exact terminology from the job posting</li>
                    <li>Add metrics and quantifiable achievements</li>
                  </ul>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'bulk' && results.length > 0 && (
            <motion.div
              className="bg-white border-t-4 border-indigo-600 p-4 sm:p-6 rounded-lg shadow-lg"
              variants={resultsVariants}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-center text-indigo-700 mb-4 sm:mb-6">
                Bulk Analysis Results
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                {results.map((result, i) => (
                  <motion.div
                    key={i}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <h3 className="font-semibold text-lg mb-2">Resume {i + 1}</h3>
                    <div className="flex items-center mb-2">
                      <span className="font-medium mr-2">ATS Score:</span>
                      <span className={`font-bold ${
                        result.score < 60 ? 'text-orange-600' :
                        result.score < 85 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {result.score}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-2">
                      <p>{result.feedback}</p>
                      {result.missingKeywords && result.missingKeywords.length > 0 && (
                        <div>
                          <p className="font-medium">Top Missing Keywords:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.missingKeywords.slice(0, 5).map((word, j) => (
                              <span key={j} className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs">
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 sm:mt-6 bg-blue-50 p-3 sm:p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                  Bulk Analysis Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-600">Top Candidates</p>
                    <p className="text-xl font-bold text-indigo-600">
                      {results.filter(r => r.score >= 85).length}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                    <p className="text-xl font-bold text-indigo-600">
                      {Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)}%
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-600">Common Missing Keywords</p>
                    <p className="text-xl font-bold text-indigo-600">
                      {Array.from(
                        results.reduce((acc, r) => {
                          r.missingKeywords?.forEach(kw => acc.add(kw));
                          return acc;
                        }, new Set())
                      ).slice(0, 3).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500" variants={itemVariants}>
          <p>For best results: Use exact keywords from the job description and quantify achievements</p>
        </motion.div>
      </motion.div>

      <EmployeeSidebar />
    </div>
  );
}
