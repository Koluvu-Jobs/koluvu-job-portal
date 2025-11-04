// src/app/main/dashboard/training/advancedssearch.jsx

'use client';
import React, { useState, useEffect } from 'react';
// Modal to show matched candidates
const MatchedCandidatesModal = ({ candidates, onClose }) => {
  if (!candidates || candidates.length === 0) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-2xl text-gray-900 mb-6">Matched Candidates</h2>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {candidates.map(candidate => (
            <div key={candidate.id} className="border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-white mb-2">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-12 h-12 flex items-center justify-center text-indigo-800 font-bold text-lg">
                  {candidate.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{candidate.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {candidate.location}
                  </p>
                </div>
                <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-lg ${candidate.matchScore >= 90 ? 'bg-emerald-500 text-white' : candidate.matchScore >= 80 ? 'bg-blue-500 text-white' : candidate.matchScore >= 70 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800'}`}>{candidate.matchScore}% match</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {candidate.skills.map(skill => (
                  <span key={skill} className="bg-indigo-50 text-indigo-700 font-medium px-2.5 py-1 rounded-full text-xs">{skill}</span>
                ))}
              </div>
              <div className="flex flex-col gap-1 text-xs text-gray-600 mb-2">
                <span><GraduationCap className="inline w-4 h-4 mr-1 text-indigo-500" /> {candidate.education}</span>
                <span><Briefcase className="inline w-4 h-4 mr-1 text-indigo-500" /> {candidate.experience === 0 ? 'Fresher' : `${candidate.experience} yrs exp`} <span className="ml-2">${candidate.salary}L</span></span>
                <span><Building className="inline w-4 h-4 mr-1 text-indigo-500" /> {candidate.designation}</span>
                <span><Users className="inline w-4 h-4 mr-1 text-indigo-500" /> {candidate.department} Department</span>
                {candidate.locationExperience && candidate.locationExperience.length > 0 && (
                  <span><Layers className="inline w-4 h-4 mr-1 text-indigo-500" /> {candidate.locationExperience.join(', ')}</span>
                )}
                <span><Clock className="inline w-4 h-4 mr-1 text-indigo-500" />
                  {candidate.availability === 'immediate' ? 'Immediately available' : 
                    candidate.availability === '2weeks' ? 'Available in 2 weeks' :
                    candidate.availability === '1month' ? 'Available in 1 month' : 'Availability not specified'}
                </span>
                {candidate.certified && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit mt-1">
                    <Award className="w-3 h-3" /> Certified
                  </span>
                )}
              </div>
              <button
                className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
                onClick={() => window.location.href = `/dashboard/employee?tab=profile/profile?id=${candidate.id}`}
              >
                View Full Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
import { useRouter } from 'next/navigation';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Search, Filter, MapPin, GraduationCap, Briefcase, Code, X, ChevronDown, Sparkles, Sliders, Award, Clock, UserCheck, Frown, Building, Users, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedSearch = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    education: [],
    experienceFrom: '',
    experienceTo: '',
    isFresher: false,
    skills: [],
    location: '',
    searchResults: [],
    salaryRange: [0, 100],
    availability: 'any',
    certification: false,
    designation: '',
    department: '',
    locationExperience: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [modalCandidates, setModalCandidates] = useState([]);

  // Sample data for filter options
  const educationOptions = [
    '10th Grade', '12th Grade', 'Diploma', 'Bachelor\'s Degree',
    'Master\'s Degree', 'PhD', 'Professional Certification'
  ];

  const skillSuggestions = [
    'JavaScript', 'React', 'Python', 'Java', 'Node.js', 'SQL', 'TypeScript',
    'GraphQL', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'Data Science'
  ];

  const locationOptions = [
    'Mumbai, India', 'Bangalore, India', 'Delhi, India',
    'Hyderabad, India', 'Pune, India', 'Remote', 'International'
  ];

  const departmentOptions = [
    'Engineering', 'Design', 'Product', 'Marketing', 
    'Sales', 'HR', 'Finance', 'Operations'
  ];

  const designationOptions = [
    'Software Engineer', 'Senior Software Engineer', 'Tech Lead',
    'Engineering Manager', 'Product Manager', 'UX Designer',
    'Data Scientist', 'DevOps Engineer', 'QA Engineer'
  ];

  const locationExperienceOptions = [
    'US Experience', 'UK Experience', 'European Experience',
    'Asian Experience', 'Middle East Experience', 'African Experience'
  ];

  const availabilityOptions = [
    { value: 'any', label: 'Any' },
    { value: 'immediate', label: 'Immediate' },
    { value: '2weeks', label: 'Within 2 weeks' },
    { value: '1month', label: 'Within 1 month' }
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentCandidateSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  const handleEducationChange = (education) => {
    setFilters(prev => ({
      ...prev,
      education: prev.education.includes(education)
        ? prev.education.filter(e => e !== education)
        : [...prev.education, education]
    }));
  };

  const handleLocationExperienceChange = (location) => {
    setFilters(prev => ({
      ...prev,
      locationExperience: prev.locationExperience.includes(location)
        ? prev.locationExperience.filter(e => e !== location)
        : [...prev.locationExperience, location]
    }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !filters.skills.includes(skill)) {
      setFilters(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setSkillInput('');
    setShowSkillSuggestions(false);
  };

  const handleSkillRemove = (skillToRemove) => {
    setFilters(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSalaryChange = (index, value) => {
    const newRange = [...filters.salaryRange];
    newRange[index] = parseInt(value);
    setFilters(prev => ({ ...prev, salaryRange: newRange }));
  };

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockData = [
        { 
          id: 1, 
          name: 'Aarav Sharma', 
          education: 'Bachelor\'s Degree', 
          experience: 3, 
          skills: ['JavaScript', 'React', 'TypeScript'], 
          location: 'Bangalore, India',
          salary: 12,
          availability: 'immediate',
          certified: true,
          matchScore: 92,
          designation: 'Senior Software Engineer',
          department: 'Engineering',
          locationExperience: ['US Experience']
        },
        { 
          id: 2, 
          name: 'Priya Patel', 
          education: 'Master\'s Degree', 
          experience: 5, 
          skills: ['Python', 'Machine Learning', 'Data Science'], 
          location: 'Remote',
          salary: 18,
          availability: '2weeks',
          certified: true,
          matchScore: 88,
          designation: 'Data Scientist',
          department: 'Product',
          locationExperience: ['UK Experience']
        },
        { 
          id: 3, 
          name: 'Rahul Gupta', 
          education: 'Professional Certification', 
          experience: 2, 
          skills: ['AWS', 'Docker', 'Kubernetes'], 
          location: 'Hyderabad, India',
          salary: 10,
          availability: 'immediate',
          certified: false,
          matchScore: 76,
          designation: 'DevOps Engineer',
          department: 'Engineering',
          locationExperience: []
        },
        { 
          id: 4, 
          name: 'Neha Singh', 
          education: 'Bachelor\'s Degree', 
          experience: 0, 
          skills: ['Java', 'Spring Boot'], 
          location: 'Pune, India',
          salary: 6,
          availability: '1month',
          certified: true,
          matchScore: 68,
          designation: 'Software Engineer',
          department: 'Engineering',
          locationExperience: []
        },
        { 
          id: 5, 
          name: 'Vikram Joshi', 
          education: 'PhD', 
          experience: 8, 
          skills: ['Machine Learning', 'Python', 'TensorFlow'], 
          location: 'International',
          salary: 25,
          availability: 'immediate',
          certified: true,
          matchScore: 95,
          designation: 'Tech Lead',
          department: 'Engineering',
          locationExperience: ['US Experience', 'European Experience']
        },
      ];

      const filteredResults = mockData.filter(candidate => {
        const matchesEducation = filters.education.length === 0 || filters.education.includes(candidate.education);
        const matchesExperience = filters.isFresher ? candidate.experience === 0 :
                                (candidate.experience >= (parseInt(filters.experienceFrom) || 0) &&
                                (filters.experienceTo === '' || candidate.experience <= parseInt(filters.experienceTo)));
        const matchesSkills = filters.skills.length === 0 || filters.skills.every(skill => candidate.skills.includes(skill));
        const matchesLocation = filters.location === '' || candidate.location === filters.location;
        const matchesSalary = candidate.salary >= filters.salaryRange[0] && candidate.salary <= filters.salaryRange[1];
        const matchesAvailability = filters.availability === 'any' || candidate.availability === filters.availability;
        const matchesCertification = !filters.certification || candidate.certified;
        const matchesDesignation = !filters.designation || candidate.designation === filters.designation;
        const matchesDepartment = !filters.department || candidate.department === filters.department;
        const matchesLocationExperience = filters.locationExperience.length === 0 || 
                                        filters.locationExperience.some(loc => candidate.locationExperience.includes(loc));

        return matchesEducation && matchesExperience && matchesSkills && 
               matchesLocation && matchesSalary && matchesAvailability && 
               matchesCertification && matchesDesignation && matchesDepartment &&
               matchesLocationExperience;
      });

      // Sort by match score (simulated)
      filteredResults.sort((a, b) => b.matchScore - a.matchScore);

      setFilters(prev => ({ ...prev, searchResults: filteredResults }));
      setIsSearching(false);
      
      // Save to recent searches (ensure searchResults are included)
      const newSearch = {
        filters: { ...filters, searchResults: filteredResults },
        date: new Date().toISOString(),
        resultCount: filteredResults.length
      };
      const updatedSearches = [newSearch, ...recentSearches].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentCandidateSearches', JSON.stringify(updatedSearches));
      
      setShowFilters(false);
    }, 1200);
  };

  const clearAllFilters = () => {
    setFilters({
      education: [],
      experienceFrom: '',
      experienceTo: '',
      isFresher: false,
      skills: [],
      location: '',
      searchResults: [],
      salaryRange: [0, 100],
      availability: 'any',
      certification: false,
      designation: '',
      department: '',
      locationExperience: []
    });
    setSkillInput('');
  };

  const getCandidateStyle = (candidate) => {
    if (candidate.matchScore >= 90) return 'from-emerald-100/70 to-emerald-50 border-emerald-200';
    if (candidate.matchScore >= 80) return 'from-blue-100/70 to-blue-50 border-blue-200';
    if (candidate.matchScore >= 70) return 'from-purple-100/70 to-purple-50 border-purple-200';
    return 'from-gray-100 to-white border-gray-200';
  };

  const getMatchBadgeColor = (score) => {
    if (score >= 90) return 'bg-emerald-500 text-white';
    if (score >= 80) return 'bg-blue-500 text-white';
    if (score >= 70) return 'bg-purple-500 text-white';
    return 'bg-gray-200 text-gray-800';
  };

  return (
    <div className="relative flex flex-col lg:flex-row h-full min-h-screen bg-gradient-to-br from-indigo-50/30 via-purple-50/30 to-pink-50/30">
      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100/70 backdrop-blur-sm"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-bold text-gray-900 tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                Talent Discovery
              </motion.h1>
              <p className="text-gray-500 mt-2">Find the perfect candidates with advanced filters</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(true)}
              className="lg:hidden p-3 rounded-xl bg-white border border-gray-200 shadow-xs text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 group"
              aria-label="Open filters"
            >
              <Sliders className="w-4 h-4 text-indigo-600 group-hover:text-indigo-700 transition-colors" />
              <span className="text-sm font-medium">Filters</span>
            </motion.button>
          </div>
          
          {/* Recent Searches */}
          {recentSearches.length > 0 && filters.searchResults.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Recent Searches
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {recentSearches.map((search, index) => {
                  // Try to get the last search results for this search
                  const candidates = search.filters && search.filters.searchResults ? search.filters.searchResults : [];
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -2 }}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs hover:shadow-lg transition-all cursor-pointer ring-2 ring-transparent hover:ring-indigo-400"
                      onClick={() => {
                        if (candidates && candidates.length > 0) {
                          setModalCandidates(candidates);
                          setShowCandidateModal(true);
                        } else {
                          setFilters(prev => ({ ...prev, ...search.filters }));
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500">{new Date(search.date).toLocaleString()}</p>
                          <h4 className="font-medium text-gray-800 mt-1">{search.resultCount} results</h4>
                        </div>
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRecentSearches(prev => prev.filter((_, i) => i !== index));
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {search.filters.education.length > 0 && (
                          <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">
                            {search.filters.education.length} edu
                          </span>
                        )}
                        {search.filters.skills.length > 0 && (
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                            {search.filters.skills.length} skills
                          </span>
                        )}
                        {search.filters.location && (
                          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                            {search.filters.location.split(',')[0]}
                          </span>
                        )}
                        {search.filters.designation && (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">
                            {search.filters.designation.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Search Results Display */}
          {filters.searchResults.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <span>Matching Candidates <span className="text-indigo-600">({filters.searchResults.length})</span></span>
                </h2>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Clear all
                </motion.button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filters.searchResults.map((candidate, index) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border rounded-xl p-5 bg-gradient-to-br ${getCandidateStyle(candidate)} hover:shadow-md transition-all duration-200 relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0">
                      <div className={`text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-lg ${getMatchBadgeColor(candidate.matchScore)}`}>
                        {candidate.matchScore}% match
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-12 h-12 flex items-center justify-center text-indigo-800 font-bold text-lg">
                        {candidate.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {candidate.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                        <span>{candidate.education}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-indigo-500" />
                        <span>{candidate.experience === 0 ? 'Fresher' : `${candidate.experience} yrs exp`}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          ${candidate.salary}L
                        </span>
                        {candidate.certified && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3" /> Certified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-indigo-500" />
                        <span>{candidate.designation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span>{candidate.department} Department</span>
                      </div>
                      {candidate.locationExperience.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-500" />
                          <span>{candidate.locationExperience.join(', ')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span className="capitalize">
                          {candidate.availability === 'immediate' ? 'Immediately available' : 
                           candidate.availability === '2weeks' ? 'Available in 2 weeks' :
                           candidate.availability === '1month' ? 'Available in 1 month' : 'Availability not specified'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {candidate.skills.map(skill => (
                        <span key={skill} className="bg-indigo-50 text-indigo-700 font-medium px-2.5 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button
                      className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
                      onClick={() => router.push('/dashboard/employee?tab=profile')}
                    >
                      View
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : filters.searchResults.length === 0 && !isSearching ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 text-center p-12 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50"
            >
              <div className="bg-gradient-to-r from-indigo-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Discover Top Talent</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Use our advanced filters to find candidates that match your exact requirements.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-2.5 px-8 rounded-xl text-sm transition-all shadow-xs hover:shadow-sm flex items-center gap-2 mx-auto"
              >
                <Sliders className="w-4 h-4" />
                Open Filters
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 text-center p-12"
            >
              <div className="flex justify-center mb-6">
                <div className="animate-pulse bg-gradient-to-r from-indigo-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-indigo-400" />
                </div>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">Finding Best Matches</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Analyzing {filters.skills.length > 0 ? filters.skills.length : 'all'} skills and qualifications...
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Advanced Search Panel - Right Side */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-gray-100 pt-20 px-6 pb-6 overflow-y-auto lg:static lg:z-auto lg:w-80 lg:border-r lg:border-gray-100 lg:pt-0 lg:shadow-none"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg">
                    <Filter className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Advanced Filters</h2>
                </div>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-400 hover:text-gray-600 p-1 -mr-1"
                  aria-label="Close filters"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Filters Section */}
              <div className="space-y-6">
                {/* Designation Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Briefcase className="w-4 h-4 text-indigo-500" />
                    Designation
                  </label>
                  <Autocomplete
                    freeSolo
                    options={designationOptions}
                    value={filters.designation}
                    onChange={(_, newValue) => setFilters(prev => ({ ...prev, designation: newValue || '' }))}
                    inputValue={filters.designation}
                    onInputChange={(_, newInputValue) => setFilters(prev => ({ ...prev, designation: newInputValue }))}
                    renderInput={(params) => (
                      <TextField {...params} label="Select or type designation..." variant="outlined" size="small" />
                    )}
                  />
                </div>

                {/* Department Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Building className="w-4 h-4 text-indigo-500" />
                    Department
                  </label>
                  <Autocomplete
                    freeSolo
                    options={departmentOptions}
                    value={filters.department}
                    onChange={(_, newValue) => setFilters(prev => ({ ...prev, department: newValue || '' }))}
                    inputValue={filters.department}
                    onInputChange={(_, newInputValue) => setFilters(prev => ({ ...prev, department: newInputValue }))}
                    renderInput={(params) => (
                      <TextField {...params} label="Select or type department..." variant="outlined" size="small" />
                    )}
                  />
                </div>

                {/* Education Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    Education
                  </label>
                  <div className="space-y-2 bg-gray-50 rounded-xl p-3 max-h-48 overflow-y-auto custom-scrollbar">
                    {educationOptions.map(education => (
                      <label key={education} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors hover:bg-white">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={filters.education.includes(education)}
                            onChange={() => handleEducationChange(education)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-colors flex items-center justify-center">
                            {filters.education.includes(education) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-700">{education}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Briefcase className="w-4 h-4 text-indigo-500" />
                    Experience
                  </label>

                  {/* Fresher Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer mb-4 p-3 bg-gray-50 rounded-xl hover:bg-white transition-colors">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={filters.isFresher}
                        onChange={(e) => setFilters(prev => ({ ...prev, isFresher: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-colors flex items-center justify-center">
                        {filters.isFresher && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700">Fresher (0 years)</span>
                  </label>

                  {/* Experience Range */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">From (years)</label>
                      <input
                        type="number"
                        value={filters.experienceFrom}
                        onChange={(e) => setFilters(prev => ({ ...prev, experienceFrom: e.target.value }))}
                        placeholder="0"
                        min="0"
                        className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">To (years)</label>
                      <input
                        type="number"
                        value={filters.experienceTo}
                        onChange={(e) => setFilters(prev => ({ ...prev, experienceTo: e.target.value }))}
                        placeholder="10"
                        min="0"
                        className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white"
                      />
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div className="mb-4">
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Salary Range (LPA)
                    </label>
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.salaryRange[0]}
                        onChange={(e) => handleSalaryChange(0, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={filters.salaryRange[1]}
                        onChange={(e) => handleSalaryChange(1, e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>${filters.salaryRange[0]}L</span>
                      <span>${filters.salaryRange[1]}L</span>
                    </div>
                  </div>
                </div>

                {/* Location Experience Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Layers className="w-4 h-4 text-indigo-500" />
                    Location Experience
                  </label>
                  <div className="space-y-2 bg-gray-50 rounded-xl p-3 max-h-48 overflow-y-auto custom-scrollbar">
                    {locationExperienceOptions.map(location => (
                      <label key={location} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors hover:bg-white">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={filters.locationExperience.includes(location)}
                            onChange={() => handleLocationExperienceChange(location)}
                            className="sr-only peer"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-colors flex items-center justify-center">
                            {filters.locationExperience.includes(location) && (
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-700">{location}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Skills Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Code className="w-4 h-4 text-indigo-500" />
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {filters.skills.map(skill => (
                      <motion.span 
                        key={skill}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className="bg-indigo-100 text-indigo-700 font-medium px-3 py-1 rounded-full text-xs flex items-center gap-1"
                      >
                        {skill}
                        <button 
                          onClick={() => handleSkillRemove(skill)} 
                          className="hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => {
                        setSkillInput(e.target.value);
                        setShowSkillSuggestions(e.target.value.length > 0);
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleSkillAdd(skillInput)}
                      placeholder="Type to add skills..."
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 focus:bg-white"
                    />
                    {showSkillSuggestions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto custom-scrollbar"
                      >
                        {skillSuggestions
                          .filter(skill =>
                            skill.toLowerCase().includes(skillInput.toLowerCase()) &&
                            !filters.skills.includes(skill)
                          )
                          .map(skill => (
                            <motion.button
                              key={skill}
                              whileHover={{ backgroundColor: '#f5f3ff' }}
                              onClick={() => handleSkillAdd(skill)}
                              className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-sm flex items-center gap-2"
                            >
                              <Code className="w-4 h-4 text-indigo-400" />
                              {skill}
                            </motion.button>
                          ))}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Location Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    Location
                  </label>
                  <div className="relative">
                    <select
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-gray-50 focus:bg-white"
                    >
                      <option value="">Select location...</option>
                      {locationOptions.map(location => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Clock className="w-4 h-4 text-indigo-500" />
                    Availability
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availabilityOptions.map(option => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 has-[:checked]:bg-indigo-50 has-[:checked]:border-indigo-200 transition-colors">
                        <input
                          type="radio"
                          name="availability"
                          value={option.value}
                          checked={filters.availability === option.value}
                          onChange={() => setFilters(prev => ({ ...prev, availability: option.value }))}
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Certification Filter */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Award className="w-4 h-4 text-indigo-500" />
                    Certification
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-white transition-colors">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={filters.certification}
                        onChange={(e) => setFilters(prev => ({ ...prev, certification: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-md peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-colors flex items-center justify-center">
                        {filters.certification && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700">Only show certified candidates</span>
                  </label>
                </div>
              </div>

              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={isSearching}
                className={`w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md ${isSearching ? 'opacity-70' : ''}`}
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Find Candidates
                  </>
                )}
              </motion.button>

              {/* Active Filters Summary */}
              {(filters.education.length > 0 || filters.skills.length > 0 || filters.location || 
                filters.isFresher || filters.experienceFrom || filters.experienceTo ||
                filters.salaryRange[0] > 0 || filters.salaryRange[1] < 100 || 
                filters.availability !== 'any' || filters.certification ||
                filters.designation || filters.department || filters.locationExperience.length > 0) && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100"
                >
                  <p className="text-xs font-semibold text-indigo-800 mb-2 uppercase tracking-wider">Active Filters</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.designation && (
                      <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {filters.designation.split(' ')[0]}
                      </span>
                    )}
                    {filters.department && (
                      <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Building className="w-3 h-3" /> {filters.department}
                      </span>
                    )}
                    {filters.education.length > 0 && (
                      <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" /> {filters.education.length} edu
                      </span>
                    )}
                    {filters.isFresher && (
                      <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> Fresher
                      </span>
                    )}
                    {(filters.experienceFrom || filters.experienceTo) && !filters.isFresher && (
                      <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {filters.experienceFrom || '0'}-{filters.experienceTo || '∞'} yrs
                      </span>
                    )}
                    {(filters.salaryRange[0] > 0 || filters.salaryRange[1] < 100) && (
                      <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        ${filters.salaryRange[0]}-{filters.salaryRange[1]}L
                      </span>
                    )}
                    {filters.locationExperience.length > 0 && (
                      <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Layers className="w-3 h-3" /> {filters.locationExperience.length} loc
                      </span>
                    )}
                    {filters.skills.length > 0 && (
                      <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Code className="w-3 h-3" /> {filters.skills.length} skills
                      </span>
                    )}
                    {filters.location && (
                      <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {filters.location.split(',')[0]}
                      </span>
                    )}
                    {filters.availability !== 'any' && (
                      <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 
                        {filters.availability === 'immediate' ? 'Now' : 
                         filters.availability === '2weeks' ? '2w' : '1m'}
                      </span>
                    )}
                    {filters.certification && (
                      <span className="text-xs bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3" /> Certified
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            ></motion.div>
          </>
        )}
      </AnimatePresence>
    {/* Candidate Details Modal */}
    {showCandidateModal && (
      <MatchedCandidatesModal
        candidates={modalCandidates}
        onClose={() => setShowCandidateModal(false)}
      />
    )}
    </div>
  );
};

export default AdvancedSearch;
