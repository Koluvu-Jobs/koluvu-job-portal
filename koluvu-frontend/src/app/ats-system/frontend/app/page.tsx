// app/page.tsx
'use client';

import { useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface ATSResult {
  score: number;
  missing_keywords: string[];
  matched_keywords: string[];
  suggestions: string[];
  resume_text_preview: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'text/plain'
      ];
      
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please upload a PDF, DOCX, DOC, or TXT file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !jobDescription.trim()) {
      setError('Please provide both resume and job description');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await fetch('http://localhost:8000/api/analyze/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ATS Score Generator
          </h1>
          <p className="text-gray-600">
            Check how well your resume matches the job description
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Upload className="mr-2" size={24} />
              Upload Resume
            </h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <FileText size={48} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, DOCX, DOC, or TXT (Max 10MB)
                </span>
              </label>
            </div>

            {file && (
              <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-800 font-medium">
                  Selected: {file.name}
                </p>
                <p className="text-xs text-indigo-600">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}
          </div>

          {/* Job Description Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <textarea
              className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleSubmit}
            disabled={loading || !file || !jobDescription.trim()}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors inline-flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={20} />
                Analyzing...
              </>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>

            {/* Score Display */}
            <div className={`${getScoreBgColor(result.score)} rounded-lg p-6 mb-6`}>
              <div className="text-center">
                <p className="text-gray-700 font-medium mb-2">ATS Score</p>
                <p className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}%
                </p>
                <div className="mt-4 bg-white rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full ${
                      result.score >= 80
                        ? 'bg-green-500'
                        : result.score >= 60
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Matched Keywords */}
              <div>
                <h3 className="text-lg font-semibold text-green-700 mb-3">
                  ✓ Matched Keywords ({result.matched_keywords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matched_keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-3">
                  ✗ Missing Keywords ({result.missing_keywords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {result.suggestions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-indigo-700 mb-3">
                  💡 Suggestions for Improvement
                </h3>
                <ul className="space-y-2">
                  {result.suggestions.map((suggestion, idx) => (
                    <li
                      key={idx}
                      className="bg-indigo-50 p-3 rounded-lg text-gray-700"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}