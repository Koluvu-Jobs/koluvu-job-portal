//src/app/dashboard/employee/ats/page.js

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Book,
  Award,
  Clock,
  Users,
  FileText,
  Globe,
  Shield,
  Star,
  Target,
} from "lucide-react";

const ATSScoreSystem = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState("home");

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.view) {
        setCurrentView(event.state.view);
      } else {
        setCurrentView("home");
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Set initial state
    window.history.replaceState({ view: "home" }, "");

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Update URL and history when view changes
  const updateView = (newView) => {
    setCurrentView(newView);
    window.history.pushState({ view: newView }, "");
  };
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Sample job requirements
  const jobRequirements = {
    title: "Senior React Developer",
    skills: ["React", "JavaScript", "Node.js", "TypeScript", "AWS", "Docker"],
    experience: "5+ years",
    location: "Bangalore, India",
    ctcRange: "₹15-20 LPA",
    education: "Bachelor's in Computer Science",
    certifications: ["AWS Certified", "React Certification"],
  };

  // Sample candidates
  const candidates = [
    {
      id: 1,
      name: user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.username || "User",
      skills: ["React", "JavaScript", "Node.js", "MongoDB", "Git"],
      experience: "5 years",
      location: "Bangalore, India",
      presentCTC: "₹12 LPA",
      expectedCTC: "₹16 LPA",
      education: "Bachelor's in Computer Science",
      certifications: ["React Certification"],
      overallScore: 78,
      skillsScore: 85,
      experienceScore: 100,
      locationScore: 100,
      compensationScore: 80,
      educationScore: 100,
      certificationScore: 50,
      resumeFormatScore: 70,
      keywordScore: 75,
      tenureScore: 85,
      languageScore: 90,
      gapsIdentified: [
        {
          skill: "TypeScript",
          priority: "High",
          recommendation: "Complete TypeScript Fundamentals course",
        },
        {
          skill: "AWS",
          priority: "High",
          recommendation: "AWS Certified Developer certification",
        },
        {
          skill: "Docker",
          priority: "Medium",
          recommendation: "Docker & Kubernetes course",
        },
      ],
      trainingRecommendations: [
        {
          category: "Technical Skills",
          items: [
            "TypeScript Advanced Features",
            "AWS Cloud Architecture",
            "Docker Containerization",
          ],
        },
        {
          category: "Certifications",
          items: ["AWS Certified Developer", "Docker Certified Associate"],
        },
        {
          category: "Resume Optimization",
          items: ["ATS-friendly formatting", "Keyword optimization"],
        },
      ],
    },
    {
      id: 2,
      name: "Rahul Kumar",
      skills: ["React", "JavaScript", "TypeScript", "Python", "SQL"],
      experience: "4 years",
      location: "Mumbai, India",
      presentCTC: "₹10 LPA",
      expectedCTC: "₹18 LPA",
      education: "Master's in Computer Science",
      certifications: [],
      overallScore: 65,
      skillsScore: 70,
      experienceScore: 80,
      locationScore: 60,
      compensationScore: 70,
      educationScore: 100,
      certificationScore: 0,
      resumeFormatScore: 85,
      keywordScore: 80,
      tenureScore: 75,
      languageScore: 95,
      gapsIdentified: [
        {
          skill: "Node.js",
          priority: "High",
          recommendation: "Node.js Backend Development course",
        },
        {
          skill: "AWS",
          priority: "High",
          recommendation: "AWS Fundamentals certification",
        },
        {
          skill: "Docker",
          priority: "Medium",
          recommendation: "Containerization basics",
        },
      ],
      trainingRecommendations: [
        {
          category: "Technical Skills",
          items: [
            "Node.js Backend Development",
            "AWS Cloud Services",
            "Docker Fundamentals",
          ],
        },
        {
          category: "Certifications",
          items: ["AWS Certified Developer", "Node.js Certification"],
        },
        {
          category: "Location",
          items: ["Consider relocation to Bangalore or remote work discussion"],
        },
      ],
    },
  ];

  const getSkillMatch = (candidateSkills, requiredSkills) => {
    return requiredSkills.map((skill) => ({
      skill,
      matched: candidateSkills.includes(skill),
      status: candidateSkills.includes(skill) ? "Yes" : "Missing",
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const HomeView = () => {
    const currentHour = new Date().getHours();
    let greeting = "Good Evening";
    if (currentHour < 12) greeting = "Good Morning";
    else if (currentHour < 18) greeting = "Good Afternoon";
    // Text-only card carousel (inspired by provided CodePen) without images
    const featureCards = [
      {
        title: "Profile Match",
        accent: "Match",
        description:
          "ATS compares your skills & experience with job requirements to gauge relevance.",
        color: "from-[#104210] to-[#1f5d1f]",
      },
      {
        title: "Keyword Scanning",
        accent: "Scanning",
        description:
          "Identifies important role-specific keywords & highlights missing ones.",
        color: "from-[#e55b13] to-[#f6a21e]",
      },
      {
        title: "ATS Scoring",
        accent: "Scoring",
        description:
          "Generates a composite score across skills, experience, education & more.",
        color: "from-[#7a871e] to-[#b6c326]",
      },
      {
        title: "Resume Optimization",
        accent: "Optimization",
        description:
          "Suggests structure & wording improvements for better parser compatibility.",
        color: "from-[#104210] to-[#7a871e]",
      },
      {
        title: "Training Gaps",
        accent: "Gaps",
        description:
          "Pinpoints high-impact skill gaps & recommends targeted learning paths.",
        color: "from-[#e55b13] to-[#f6a21e]",
      },
      {
        title: "Progress Tracking",
        accent: "Tracking",
        description:
          "Monitors improvements over time as you close gaps & refine your profile.",
        color: "from-[#7a871e] to-[#104210]",
      },
    ];

    const trackRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollTo = (index) => {
      if (!trackRef.current) return;
      const clamped = Math.max(0, Math.min(featureCards.length - 1, index));
      const child = trackRef.current.children[clamped];
      if (child) {
        child.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
        setActiveIndex(clamped);
      }
    };

    const handleScroll = () => {
      if (!trackRef.current) return;
      const el = trackRef.current;
      const cardWidth = el.children[0]?.getBoundingClientRect().width || 1;
      const scrollLeft = el.scrollLeft;
      const idx = Math.round(scrollLeft / (cardWidth + 24)); // 24 ~ gap
      if (idx !== activeIndex)
        setActiveIndex(Math.min(featureCards.length - 1, Math.max(0, idx)));
    };

    return (
      <div className="w-full max-w-full md:max-w-6xl relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50/40 via-white to-green-50/40 rounded-xl xs:rounded-2xl" />
        <div className="rounded-lg xs:rounded-xl sm:rounded-2xl border border-orange-100/60 shadow-sm bg-white/80 backdrop-blur-sm p-2 xs:p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10">
          <h2 className="font-bold mb-3 xs:mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            <span className="inline-block text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold tracking-tight bg-gradient-to-r from-[#f6a21e] via-[#e55b13] to-[#104210] bg-clip-text text-transparent drop-shadow-sm">
              {greeting}! Explore the ATS
            </span>
          </h2>

          <p className="text-gray-600 max-w-2xl leading-relaxed mb-3 xs:mb-4 sm:mb-5 md:mb-6 text-[10px] xs:text-xs sm:text-sm md:text-base">
            Understand how the Applicant Tracking System evaluates your profile.
            Swipe / use arrows to explore each part of the scoring process.
          </p>

          {/* Carousel Wrapper */}
          <div className="relative">
            {/* Removed manual arrow buttons; carousel auto-advances */}

            {/* Track - Vertical on Mobile, Horizontal on Desktop */}
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="flex flex-col md:flex-row gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 md:overflow-x-auto scroll-smooth md:snap-x snap-mandatory pb-2 px-1 xs:px-2 sm:px-3 md:px-4 lg:px-6 xl:px-12 -mx-1 xs:-mx-2 hide-scrollbar"
              style={{ scrollBehavior: "smooth" }}
            >
              {featureCards.map((card, i) => (
                <div
                  key={card.title}
                  className={`snap-center md:shrink-0 w-full md:w-[240px] lg:w-[280px] xl:w-[320px] rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-5 md:p-4 lg:p-5 bg-gradient-to-br ${
                    card.color
                  } text-white relative shadow-sm ring-1 ring-black/5 transition transform duration-300 ${
                    activeIndex === i
                      ? "md:scale-[1.03]"
                      : "md:scale-[0.97] md:opacity-90"
                  }`}
                >
                  <div className="absolute inset-0 rounded-lg xs:rounded-xl sm:rounded-2xl bg-white/10 mix-blend-overlay pointer-events-none" />
                  <h3 className="font-semibold text-sm xs:text-base sm:text-lg md:text-base lg:text-lg mb-1.5 xs:mb-2 sm:mb-2.5 tracking-tight">
                    {card.title.split(" ").map((word, idx) => (
                      <span
                        key={idx}
                        className={
                          word === card.accent
                            ? "text-yellow-200 drop-shadow-sm"
                            : undefined
                        }
                      >
                        {word}{" "}
                      </span>
                    ))}
                  </h3>
                  <p className="text-xs xs:text-sm sm:text-base md:text-xs lg:text-sm leading-relaxed text-white/90">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Dots - Only show on desktop */}
            <div className="hidden md:flex items-center justify-center gap-1.5 xs:gap-2 mt-3 xs:mt-4 sm:mt-5">
              {featureCards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 xs:h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === i
                      ? "bg-[#104210] w-6 xs:w-8"
                      : "bg-gray-300 hover:bg-gray-400 w-2 xs:w-2.5"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="mt-4 xs:mt-5 sm:mt-6 md:mt-8 lg:mt-10 flex flex-col sm:flex-row gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 items-center justify-center">
            <button
              onClick={() => {
                setSelectedCandidate(candidates[0]);
                updateView("applied");
              }}
              className="group relative inline-flex items-center justify-center gap-1 xs:gap-1.5 sm:gap-2 bg-[#104210] hover:bg-[#0b320b] text-white font-medium py-1.5 xs:py-2 sm:py-2.5 px-4 xs:px-5 sm:px-6 md:px-8 rounded-lg xs:rounded-xl transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#104210]/60 text-xs xs:text-sm sm:text-base w-full sm:w-auto">
              <span className="absolute inset-0 -z-10 rounded-lg xs:rounded-xl bg-gradient-to-r from-[#104210] via-[#7a871e] to-[#f6a21e] opacity-0 group-hover:opacity-100 transition-opacity" />
              Get My Score
            </button>
            <button
              onClick={() => scrollTo(featureCards.length - 1)}
              className="px-4 xs:px-5 sm:px-6 py-1.5 xs:py-2 sm:py-2.5 rounded-lg xs:rounded-xl bg-[#f6a21e] text-[#141414] font-semibold shadow-sm hover:bg-[#e59205] transition-colors text-xs xs:text-sm sm:text-base w-full sm:w-auto"
            >
              Last Feature
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AppliedView = () => (
    <div className="w-full max-w-5xl mx-auto px-2 xs:px-3 sm:px-4 space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => updateView("home")}
          className="px-3 xs:px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs xs:text-sm text-gray-800 font-medium"
        >
          ← Back
        </button>
      </div>
      <div className="rounded-xl xs:rounded-2xl border border-green-100/70 bg-white/80 backdrop-blur-sm p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 shadow-sm">
        <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 xs:mb-4 tracking-tight">
          Application Summary
        </h1>
        <div className="rounded-xl border border-green-200/70 bg-gradient-to-r from-green-50 to-emerald-50 p-3 xs:p-4 sm:p-5">
          <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-[#104210] flex flex-wrap items-center gap-2">
            {selectedCandidate.name} - {jobRequirements.title}
          </h2>
          <p className="text-xs xs:text-sm text-[#104210]/80 mt-1">
            Application submitted successfully!
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 xs:gap-5 sm:gap-6">
        <div className="md:col-span-3 rounded-xl xs:rounded-2xl border border-orange-100/70 bg-white p-3 xs:p-4 sm:p-5 shadow-sm">
          <div className="flex items-center mb-3 xs:mb-4">
            <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-[#104210] mr-2" />
            <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800 tracking-tight">
              Skills Match
            </h3>
          </div>
          <div className="space-y-2 xs:space-y-3">
            {getSkillMatch(
              selectedCandidate.skills,
              jobRequirements.skills
            ).map((item) => (
              <div
                key={item.skill}
                className="flex items-center justify-between text-xs xs:text-sm"
              >
                <span className="font-medium text-gray-700">{item.skill}</span>
                <span
                  className={`px-2 py-1 rounded-md text-[10px] xs:text-xs font-medium tracking-wide ${
                    item.matched
                      ? "bg-[#104210]/10 text-[#104210]"
                      : "bg-[#e55b13]/10 text-[#e55b13]"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-2 rounded-xl xs:rounded-2xl border border-lime-200/70 bg-white p-3 xs:p-4 sm:p-5 shadow-sm">
          <div className="flex items-center mb-3 xs:mb-4">
            <TrendingUp className="w-4 h-4 xs:w-5 xs:h-5 text-[#7a871e] mr-2" />
            <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800 tracking-tight">
              Quick Stats
            </h3>
          </div>
          <div className="space-y-3 xs:space-y-4">
            <div className="flex items-center justify-between text-xs xs:text-sm">
              <div className="flex items-center">
                <Clock className="w-3 h-3 xs:w-4 xs:h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Experience</span>
              </div>
              <span className="font-semibold text-[#104210]">
                {selectedCandidate.experience}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs xs:text-sm">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 xs:w-4 xs:h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Location</span>
              </div>
              <span className="font-semibold text-[#104210]">
                {selectedCandidate.location}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs xs:text-sm">
              <div className="flex items-center">
                <DollarSign className="w-3 h-3 xs:w-4 xs:h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Present CTC</span>
              </div>
              <span className="font-medium text-gray-700">
                {selectedCandidate.presentCTC}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs xs:text-sm">
              <div className="flex items-center">
                <DollarSign className="w-3 h-3 xs:w-4 xs:h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Expected CTC</span>
              </div>
              <span className="font-medium text-gray-700">
                {selectedCandidate.expectedCTC}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs xs:text-sm">
              <div className="flex items-center">
                <GraduationCap className="w-3 h-3 xs:w-4 xs:h-4 text-gray-400 mr-2" />
                <span className="text-gray-600">Education</span>
              </div>
              <span className="font-semibold text-[#104210] text-right max-w-[60%]">
                {selectedCandidate.education}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => updateView("ats-score")}
          className="w-full sm:w-auto relative inline-flex items-center justify-center gap-2 bg-[#f6a21e] hover:bg-[#e59205] text-[#141414] font-semibold px-6 xs:px-8 py-2.5 xs:py-3 rounded-xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f6a21e]/60 text-sm xs:text-base"
        >
          View Detailed ATS Score
        </button>
      </div>
    </div>
  );

  const ATSScoreView = () => (
    <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Main ATS Content */}
      <div className="space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
        <div className="rounded-xl xs:rounded-2xl border border-lime-200/70 bg-white/80 backdrop-blur-sm p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg">
          <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 xs:mb-4 tracking-tight">
            ATS Score Analysis
          </h1>
          <div className="rounded-xl border border-lime-200/60 bg-gradient-to-r from-lime-50 via-white to-orange-50 p-3 xs:p-4 sm:p-5 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 xs:gap-4 sm:gap-6">
              <div className="w-full md:w-auto">
                <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-[#104210]">
                  {selectedCandidate.name}
                </h2>
                <p className="text-xs xs:text-sm text-[#104210]/80 mt-1">
                  {jobRequirements.title}
                </p>
              </div>
              <div className="text-center px-4 xs:px-5 sm:px-6 py-3 xs:py-3.5 sm:py-4 rounded-xl bg-white border border-lime-100 shadow-md w-full md:w-auto">
                <div className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#104210] via-[#7a871e] to-[#f6a21e] bg-clip-text text-transparent">
                  {selectedCandidate.overallScore}%
                </div>
                <div className="text-[10px] xs:text-xs sm:text-sm font-medium text-[#104210]/80 mt-1">
                  Overall Score
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          <div className="lg:col-span-1 xl:col-span-2 space-y-3 xs:space-y-4 sm:space-y-5 md:space-y-6">
            <div className="rounded-xl xs:rounded-2xl border border-orange-100/70 bg-white p-3 xs:p-4 sm:p-5 md:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-5 flex items-center text-gray-800 tracking-tight">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#e55b13] mr-2" />
                Criteria Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Technical Skills",
                    score: selectedCandidate.skillsScore,
                    icon: <Book className="w-4 h-4" />,
                  },
                  {
                    label: "Experience Match",
                    score: selectedCandidate.experienceScore,
                    icon: <Clock className="w-4 h-4" />,
                  },
                  {
                    label: "Location Fit",
                    score: selectedCandidate.locationScore,
                    icon: <MapPin className="w-4 h-4" />,
                  },
                  {
                    label: "Compensation",
                    score: selectedCandidate.compensationScore,
                    icon: <DollarSign className="w-4 h-4" />,
                  },
                  {
                    label: "Education",
                    score: selectedCandidate.educationScore,
                    icon: <GraduationCap className="w-4 h-4" />,
                  },
                  {
                    label: "Certifications",
                    score: selectedCandidate.certificationScore,
                    icon: <Award className="w-4 h-4" />,
                  },
                  {
                    label: "Resume Format",
                    score: selectedCandidate.resumeFormatScore,
                    icon: <FileText className="w-4 h-4" />,
                  },
                  {
                    label: "Keyword Match",
                    score: selectedCandidate.keywordScore,
                    icon: <Shield className="w-4 h-4" />,
                  },
                  {
                    label: "Career Tenure",
                    score: selectedCandidate.tenureScore,
                    icon: <Users className="w-4 h-4" />,
                  },
                  {
                    label: "Language",
                    score: selectedCandidate.languageScore,
                    icon: <Globe className="w-4 h-4" />,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-colors text-sm"
                  >
                    <div className="flex items-center">
                      <div className="text-gray-500 mr-3">{item.icon}</div>
                      <span className="font-medium text-gray-700">
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 w-full sm:w-56">
                      <div className="flex-1 bg-gray-200/70 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            item.score >= 80
                              ? "bg-[#104210]"
                              : item.score >= 60
                              ? "bg-[#f6a21e]"
                              : "bg-[#e55b13]"
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <div className="flex items-center space-x-1 min-w-[50px] sm:min-w-[70px] justify-end">
                        {getScoreIcon(item.score)}
                        <span
                          className={`font-semibold px-2 py-1 rounded-md text-xs ${getScoreColor(
                            item.score
                          )}`}
                        >
                          {item.score}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="rounded-xl xs:rounded-2xl border border-red-100/70 bg-white p-4 xs:p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 tracking-tight">
                <AlertCircle className="w-5 h-5 text-[#e55b13] mr-2" />
                Skill Gaps
              </h3>
              <div className="space-y-4">
                {selectedCandidate.gapsIdentified.map((gap, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-[#e55b13]/5 text-sm ring-1 ring-[#e55b13]/10"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-[#e55b13]">
                        {gap.skill}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          gap.priority === "High"
                            ? "bg-[#e55b13] text-white"
                            : "bg-[#f6a21e]/20 text-[#7a4d05]"
                        }`}
                      >
                        {gap.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[#e55b13]/80">
                      {gap.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-green-100/70 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800 tracking-tight">
                <CheckCircle className="w-5 h-5 text-[#104210] mr-2" />
                Strengths
              </h3>
              <div className="space-y-3 text-sm">
                {selectedCandidate.experienceScore === 100 && (
                  <div className="flex items-center text-[#104210]">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Experience requirement met</span>
                  </div>
                )}
                {selectedCandidate.educationScore === 100 && (
                  <div className="flex items-center text-[#104210]">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Education qualification matched</span>
                  </div>
                )}
                {selectedCandidate.locationScore === 100 && (
                  <div className="flex items-center text-[#104210]">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Location preference aligned</span>
                  </div>
                )}
                {selectedCandidate.skillsScore >= 80 && (
                  <div className="flex items-center text-[#104210]">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Strong technical skill match</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
          <button
            onClick={() => updateView("applied")}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors text-sm font-medium shadow-sm"
          >
            Back
          </button>
          <button
            onClick={() => (window.location.href = "/training")}
            className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-[#104210] text-white hover:bg-[#0d360d] transition-colors text-sm font-medium shadow-sm"
          >
            Start Training
          </button>
          <button className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-[#f6a21e] text-[#141414] hover:bg-[#e59205] transition-colors text-sm font-semibold shadow-sm">
            Download
          </button>
        </div>
      </div>
    </div>
  );

  const TrainingView = () => {
    useEffect(() => {
      // Auto-advance carousel every 4 seconds
      const id = setInterval(() => {
        setActiveIndex((prev) => {
          const next = (prev + 1) % featureCards.length;
          scrollTo(next);
          return next;
        });
      }, 4000);
      return () => clearInterval(id);
    }, []);

    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Training Programs
            </h1>
            <p className="text-gray-600 text-lg">
              Enhance your skills with our comprehensive training courses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 mb-6 xs:mb-7 sm:mb-8">
            {[
              {
                name: "CodeTech Academy",
                course: "Full Stack Development",
                duration: "16 weeks",
                price: "₹15,999",
                rating: 4.8,
                reviews: "2.1k",
                color: "from-blue-500 to-blue-600",
                skills: ["React", "Node.js", "MongoDB", "Express"],
                level: "Beginner to Advanced",
              },
              {
                name: "DataHub Institute",
                course: "Data Science & Analytics",
                duration: "20 weeks",
                price: "₹18,999",
                rating: 4.9,
                reviews: "1.8k",
                color: "from-green-500 to-green-600",
                skills: ["Python", "Machine Learning", "Pandas", "SQL"],
                level: "Intermediate",
              },
              {
                name: "AI Masters",
                course: "Machine Learning & AI",
                duration: "24 weeks",
                price: "₹22,999",
                rating: 4.7,
                reviews: "1.5k",
                color: "from-purple-500 to-purple-600",
                skills: ["TensorFlow", "PyTorch", "Deep Learning", "NLP"],
                level: "Advanced",
              },
              {
                name: "CloudDev Pro",
                course: "Cloud Computing & DevOps",
                duration: "18 weeks",
                price: "₹20,999",
                rating: 4.6,
                reviews: "1.2k",
                color: "from-orange-500 to-orange-600",
                skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
                level: "Intermediate to Advanced",
              },
              {
                name: "WebCraft Studio",
                course: "Frontend Development",
                duration: "12 weeks",
                price: "₹12,999",
                rating: 4.5,
                reviews: "2.5k",
                color: "from-pink-500 to-pink-600",
                skills: ["React", "Vue.js", "TypeScript", "CSS"],
                level: "Beginner",
              },
              {
                name: "CyberShield Academy",
                course: "Cybersecurity Essentials",
                duration: "14 weeks",
                price: "₹17,999",
                rating: 4.4,
                reviews: "950",
                color: "from-red-500 to-red-600",
                skills: [
                  "Network Security",
                  "Ethical Hacking",
                  "CISSP",
                  "Penetration Testing",
                ],
                level: "Intermediate",
              },
            ].map((program, index) => (
              <div
                key={index}
                className="bg-white border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className={`w-14 h-14 bg-gradient-to-r ${program.color} rounded-xl flex items-center justify-center`}
                  >
                    <span className="text-white font-bold text-lg">
                      {program.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">
                      {program.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{program.course}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Duration: {program.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Level: {program.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">
                      {program.rating} ({program.reviews} reviews)
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Skills you'll learn:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {program.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-2xl font-bold text-gray-900">
                    {program.price}
                  </span>
                  <button
                    className={`px-4 py-2 bg-gradient-to-r ${program.color} text-white rounded-lg font-medium hover:opacity-90 transition-opacity`}
                  >
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => updateView("applied")}
              className="px-8 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition-colors mr-4"
            >
              Back to ATS
            </button>
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all">
              Browse All Courses
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 overflow-auto p-2 xs:p-3 sm:p-4 md:p-6">
        <div className="flex-1 flex items-start justify-center w-full">
          {currentView === "home" && <HomeView />}
          {currentView === "applied" && selectedCandidate && <AppliedView />}
          {currentView === "ats-score" && selectedCandidate && <ATSScoreView />}
          {currentView === "training" && <TrainingView />}
        </div>
      </main>
    </div>
  );
};

export default ATSScoreSystem;