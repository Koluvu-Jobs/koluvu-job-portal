// src/app/dashboard/employer/applicants/ApplicantsClient.js

'use client';

import { useState } from "react";
import { Button } from "@koluvu/components/ui/buttons/page";
import { Checkbox } from "@koluvu/components/ui/checkbox/page";
import { 
  CheckCircle2, 
  XCircle, 
  Briefcase, 
  Clock, 
  MapPin,
  Eye,
  UserCheck,
  UserX,
  Download,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";

// Function to get ATS score color
function getATSScoreColor(score) {
  if (score >= 90) return { bg: 'bg-green-100', text: 'text-green-700', ring: 'ring-green-500' };
  if (score >= 80) return { bg: 'bg-blue-100', text: 'text-blue-700', ring: 'ring-blue-500' };
  if (score >= 70) return { bg: 'bg-yellow-100', text: 'text-yellow-700', ring: 'ring-yellow-500' };
  return { bg: 'bg-red-100', text: 'text-red-700', ring: 'ring-red-500' };
}

// Function to get initials from name
function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ApplicantsClient({ verified, unverified, jobTitle, jobId }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("verified");
  const [selected, setSelected] = useState([]);

  // Get current candidates based on active tab
  const currentCandidates = activeTab === "verified" ? verified : unverified;

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === currentCandidates.length) {
      setSelected([]);
    } else {
      setSelected(currentCandidates.map((c) => c.id));
    }
  };

  // Reset selection when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelected([]);
  };

  // Handler functions for actions
  const handleViewProfile = (candidateId) => {
    console.log('Viewing profile for candidate:', candidateId);
    // Navigate to candidate profile page
    router.push(`/dashboard/employer/candidate/${candidateId}`);
  };

  const handleShortlist = (candidateId) => {
    console.log('Shortlisting candidate:', candidateId);
    alert(`Candidate ${candidateId} has been shortlisted successfully!`);
    // Add API call here to update candidate status
  };

  const handleReject = (candidateId) => {
    console.log('Rejecting candidate:', candidateId);
    const confirmed = confirm('Are you sure you want to reject this candidate?');
    if (confirmed) {
      alert(`Candidate ${candidateId} has been rejected.`);
      // Add API call here to update candidate status
    }
  };

  const handleBulkDownload = () => {
    console.log('Downloading resumes for:', selected);
    alert(`Downloading ${selected.length} resume(s)...`);
    // Add API call here to download selected resumes
  };

  const handleBulkScheduleInterview = () => {
    console.log('Scheduling interviews for:', selected);
    alert(`Scheduling interview for ${selected.length} candidate(s)...`);
    // Add API call or navigate to schedule interview page
  };

  const handleBulkShortlist = () => {
    console.log('Bulk shortlisting:', selected);
    alert(`${selected.length} candidate(s) have been shortlisted successfully!`);
    setSelected([]);
    // Add API call here to update multiple candidates
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <h1 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Applicants for {jobTitle}
          </h1>
          <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
            Job ID: <span className="font-semibold">{jobId}</span> • Total: <span className="font-semibold">{verified.length + unverified.length}</span> applicants
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => handleTabChange("verified")}
                className={`flex-1 min-w-[100px] sm:min-w-[140px] px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 font-semibold text-[10px] sm:text-xs md:text-sm border-b-3 transition-all duration-200 ${
                  activeTab === "verified"
                    ? "border-blue-600 text-blue-700 bg-blue-50/80 shadow-sm"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-500" />
                  <span className="whitespace-nowrap">Verified ({verified.length})</span>
                </div>
              </button>
              <button
                onClick={() => handleTabChange("unverified")}
                className={`flex-1 min-w-[100px] sm:min-w-[140px] px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 font-semibold text-[10px] sm:text-xs md:text-sm border-b-3 transition-all duration-200 ${
                  activeTab === "unverified"
                    ? "border-blue-600 text-blue-700 bg-blue-50/80 shadow-sm"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <XCircle className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <span className="whitespace-nowrap">Unverified ({unverified.length})</span>
                </div>
              </button>
            </div>
          </div>

          {/* Bulk Action Bar */}
          {selected.length > 0 && (
            <div className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Checkbox
                    checked={selected.length === currentCandidates.length}
                    onCheckedChange={toggleSelectAll}
                    className="w-3 h-3 sm:w-4 sm:h-4"
                  />
                  <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-gray-800">
                    {selected.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2 w-full md:w-auto">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBulkDownload}
                    className="text-xs flex-1 md:flex-initial bg-white hover:bg-gray-50 border-gray-300"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download Resumes
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleBulkScheduleInterview}
                    className="text-xs flex-1 md:flex-initial bg-white hover:bg-gray-50 border-gray-300"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Schedule Interview
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={handleBulkShortlist}
                    className="text-xs flex-1 md:flex-initial bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md"
                  >
                    <UserCheck className="w-3 h-3 mr-1" />
                    Shortlist All
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Candidate Cards */}
          <div className="p-2 sm:p-4 md:p-6">
            {currentCandidates.length > 0 ? (
              <div className="space-y-2 sm:space-y-3 md:space-y-4">
                {currentCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    isSelected={selected.includes(candidate.id)}
                    onSelect={() => toggleSelect(candidate.id)}
                    onViewProfile={() => handleViewProfile(candidate.id)}
                    onShortlist={() => handleShortlist(candidate.id)}
                    onReject={() => handleReject(candidate.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 shadow-inner">
                  <UserX className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
                </div>
                <p className="text-gray-600 text-base md:text-lg font-semibold mb-1">
                  No {activeTab} applicants found
                </p>
                <p className="text-gray-400 text-xs md:text-sm">
                  Check back later for new applications
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Candidate Card Component
function CandidateCard({ candidate, isSelected, onSelect, onViewProfile, onShortlist, onReject }) {
  const atsColor = getATSScoreColor(candidate.atsScore);
  const skills = candidate.skills.split(', ').slice(0, 3);
  
  return (
    <div
      className={`bg-white rounded-lg sm:rounded-xl md:rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 ${
        candidate.isVerified 
          ? 'border-green-100 hover:border-green-300 shadow-green-100/50' 
          : 'border-gray-200 hover:border-gray-300'
      } ${isSelected ? 'ring-2 sm:ring-4 ring-blue-500/50 border-blue-500 shadow-lg shadow-blue-200/50' : 'shadow-md'}`}
    >
      <div className="p-2 sm:p-3 md:p-5 lg:p-6">
        <div className="flex flex-col lg:flex-row items-start gap-2 sm:gap-4">
          {/* Left Section: Avatar + Info */}
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0 w-full">
            {/* Checkbox */}
            <div className="pt-0.5 sm:pt-1 flex-shrink-0">
              <Checkbox
                checked={isSelected}
                onCheckedChange={onSelect}
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
              />
            </div>

            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-base md:text-lg shadow-lg ${
              candidate.isVerified 
                ? 'bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 ring-4 ring-blue-100' 
                : 'bg-gradient-to-br from-gray-400 to-gray-600 ring-4 ring-gray-100'
            }`}>
              {getInitials(candidate.name)}
            </div>

            {/* Candidate Info */}
            <div className="flex-1 min-w-0">
              {/* Name and Verification Badge */}
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-1">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 truncate">
                  {candidate.name}
                </h3>
                {candidate.isVerified ? (
                  <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-300 sm:border-2 shadow-sm">
                    <CheckCircle2 className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-300 sm:border-2 shadow-sm">
                    <XCircle className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                    Unverified
                  </span>
                )}
              </div>

              {/* Job Title */}
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-1.5 font-medium">
                <Briefcase className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-blue-500" />
                <span className="truncate">{candidate.designation}</span>
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 md:gap-6 mb-2 sm:mb-4 text-[9px] sm:text-xs md:text-sm">
                {/* Experience */}
                <div className="flex items-center gap-0.5 sm:gap-1.5 bg-blue-50 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded border border-blue-100">
                  <Clock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-blue-500" />
                  <span className="font-bold text-gray-900">{candidate.experience}</span>
                  <span className="text-gray-600 hidden sm:inline">yrs</span>
                </div>

                {/* Notice Period */}
                <div className="flex items-center gap-0.5 sm:gap-1.5 bg-purple-50 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded border border-purple-100">
                  <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-bold text-gray-900">{candidate.noticePeriod}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-0.5 sm:gap-1.5 bg-orange-50 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded border border-orange-100">
                  <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-orange-500" />
                  <span className="font-bold text-gray-900 truncate max-w-[60px] sm:max-w-[100px] md:max-w-none">{candidate.preferredLocation}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded text-[9px] sm:text-xs font-semibold bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {skill.trim()}
                  </span>
                ))}
                {candidate.skills.split(', ').length > 3 && (
                  <span className="px-1.5 sm:px-3 py-0.5 sm:py-1.5 rounded text-[9px] sm:text-xs font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 shadow-sm">
                    +{candidate.skills.split(', ').length - 3}
                  </span>
                )}
              </div>

              {/* Bottom Row: Profile Completion, CTC */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 md:gap-6 text-[9px] sm:text-xs md:text-sm">
                {/* Profile Completion */}
                <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto">
                  <div className="flex-1 sm:flex-initial sm:w-20 md:w-28 bg-gray-200 rounded-full h-1.5 sm:h-2 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 sm:h-2 rounded-full transition-all shadow-sm"
                      style={{ width: `${candidate.profileCompletion}%` }}
                    />
                  </div>
                  <span className="text-[9px] sm:text-xs font-bold text-gray-700 whitespace-nowrap">
                    {candidate.profileCompletion}%
                  </span>
                </div>

                {/* CTC Info */}
                <div className="flex flex-wrap items-center gap-1 sm:gap-2 bg-gradient-to-r from-green-50 to-emerald-50 px-1.5 sm:px-3 py-1 sm:py-2 rounded border border-green-200">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <span className="text-[9px] sm:text-xs text-gray-600 font-medium">Current:</span>
                    <span className="font-bold text-green-700">{candidate.presentCTC}</span>
                  </div>
                  <span className="text-gray-400 text-[9px] sm:text-xs">→</span>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <span className="text-[9px] sm:text-xs text-gray-600 font-medium">Expected:</span>
                    <span className="font-bold text-green-700">{candidate.expectedCTC}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: ATS Score + Actions */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 sm:gap-4 w-full lg:w-auto mt-2 sm:mt-4 lg:mt-0 pt-2 sm:pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-200">
            {/* ATS Score Circle */}
            <div className="relative flex-shrink-0">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-full ${atsColor.bg} flex items-center justify-center border-2 sm:border-4 ${atsColor.ring} shadow-lg relative`}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                <div className="text-center relative z-10">
                  <div className={`text-base sm:text-xl md:text-2xl font-extrabold ${atsColor.text}`}>
                    {candidate.atsScore}
                  </div>
                  <div className={`text-[8px] sm:text-[9px] md:text-[10px] font-bold ${atsColor.text} -mt-0.5 sm:-mt-1 tracking-wide`}>
                    ATS
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex lg:flex-col gap-1 sm:gap-1.5 flex-1 lg:flex-initial w-full lg:w-auto">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onViewProfile}
                className="flex-1 lg:w-full lg:min-w-[140px] text-[9px] sm:text-xs h-5 sm:h-6 font-semibold border border-blue-300 sm:border-2 text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 hover:border-blue-400 transition-all shadow-sm hover:shadow-md flex items-center justify-center px-1 sm:px-2"
              >
                <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                <span className="hidden sm:inline">View Profile</span>
                <span className="sm:hidden">View</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onShortlist}
                className="flex-1 lg:w-full lg:min-w-[140px] text-[9px] sm:text-xs h-5 sm:h-6 font-semibold border border-green-300 sm:border-2 text-green-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-100 hover:border-green-400 transition-all shadow-sm hover:shadow-md flex items-center justify-center px-1 sm:px-2"
              >
                <UserCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                <span className="hidden sm:inline">Shortlist</span>
                <span className="sm:hidden">✓</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onReject}
                className="flex-1 lg:w-full lg:min-w-[140px] text-[9px] sm:text-xs h-5 sm:h-6 font-semibold border border-red-300 sm:border-2 text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 hover:border-red-400 transition-all shadow-sm hover:shadow-md flex items-center justify-center px-1 sm:px-2"
              >
                <UserX className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                <span className="hidden sm:inline">Reject</span>
                <span className="sm:hidden">✗</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
