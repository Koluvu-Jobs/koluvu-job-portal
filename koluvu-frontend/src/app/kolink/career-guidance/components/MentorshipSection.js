// src/app/career-guidance/components/MentorshipSection.js

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Star,
  MessageCircle,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Heart,
  ArrowRight,
  Search,
  Filter,
  MapPin,
  Globe,
  Video,
  Coffee,
  BookOpen,
  Target,
  CheckCircle,
  Zap,
  UserCheck,
} from "lucide-react";

export default function MentorshipSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [activeTab, setActiveTab] = useState("find-mentor");

  const mentors = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Senior Software Engineer",
      company: "Google",
      experience: "8+ years",
      category: "technology",
      expertise: ["React", "Node.js", "System Design", "Career Growth"],
      rating: 4.9,
      reviews: 127,
      sessions: 340,
      location: "San Francisco, CA",
      timezone: "PST",
      languages: ["English", "Mandarin"],
      price: "$80/hour",
      availability: "Available",
      responseTime: "< 2 hours",
      bio: "Passionate about helping developers transition into senior roles. Specializing in technical interviews, system design, and career advancement strategies.",
      achievements: [
        "Promoted 3 levels in 5 years",
        "Led team of 12 engineers",
        "Published tech articles",
      ],
      sessionTypes: [
        "1:1 Mentoring",
        "Code Review",
        "Mock Interviews",
        "Career Planning",
      ],
      avatar: "/api/placeholder/100/100",
      verified: true,
      featured: true,
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      title: "Marketing Director",
      company: "Netflix",
      experience: "12+ years",
      category: "marketing",
      expertise: [
        "Digital Marketing",
        "Brand Strategy",
        "Team Leadership",
        "Growth Marketing",
      ],
      rating: 4.8,
      reviews: 89,
      sessions: 256,
      location: "Los Angeles, CA",
      timezone: "PST",
      languages: ["English", "Spanish"],
      price: "$120/hour",
      availability: "Limited",
      responseTime: "< 4 hours",
      bio: "Marketing executive with a track record of scaling brands and teams. I help marketers accelerate their careers and develop strategic thinking.",
      achievements: [
        "Built $50M+ revenue streams",
        "Led global campaigns",
        "Mentored 50+ marketers",
      ],
      sessionTypes: [
        "Strategy Sessions",
        "Career Coaching",
        "Portfolio Review",
        "Network Building",
      ],
      avatar: "/api/placeholder/100/100",
      verified: true,
      featured: false,
    },
    {
      id: 3,
      name: "Emily Watson",
      title: "UX Design Lead",
      company: "Airbnb",
      experience: "6+ years",
      category: "design",
      expertise: [
        "User Research",
        "Design Systems",
        "Prototyping",
        "Team Management",
      ],
      rating: 4.9,
      reviews: 156,
      sessions: 423,
      location: "Remote",
      timezone: "EST",
      languages: ["English", "French"],
      price: "$90/hour",
      availability: "Available",
      responseTime: "< 1 hour",
      bio: "Dedicated to empowering the next generation of designers. Experienced in both IC and management tracks.",
      achievements: [
        "Led redesign of core product",
        "Built design team from 2 to 15",
        "Design conference speaker",
      ],
      sessionTypes: [
        "Portfolio Review",
        "Design Critique",
        "Career Transition",
        "Leadership Coaching",
      ],
      avatar: "/api/placeholder/100/100",
      verified: true,
      featured: true,
    },
    {
      id: 4,
      name: "David Kim",
      title: "Investment Banking VP",
      company: "Goldman Sachs",
      experience: "10+ years",
      category: "finance",
      expertise: [
        "Investment Banking",
        "Financial Modeling",
        "M&A",
        "Career Strategy",
      ],
      rating: 4.7,
      reviews: 67,
      sessions: 189,
      location: "New York, NY",
      timezone: "EST",
      languages: ["English", "Korean"],
      price: "$150/hour",
      availability: "Available",
      responseTime: "< 3 hours",
      bio: "Former investment banker turned mentor. Helping professionals break into finance and advance their careers in competitive environments.",
      achievements: [
        "Closed $2B+ in deals",
        "Promoted to VP in 7 years",
        "CFA Charterholder",
      ],
      sessionTypes: [
        "Career Strategy",
        "Interview Prep",
        "Technical Skills",
        "Networking",
      ],
      avatar: "/api/placeholder/100/100",
      verified: true,
      featured: false,
    },
  ];

  const mentorshipPrograms = [
    {
      id: 1,
      title: "Tech Career Accelerator",
      description:
        "12-week intensive program for developers looking to advance to senior roles",
      duration: "12 weeks",
      participants: "8-10",
      mentors: "2-3 senior engineers",
      price: "$2,400",
      features: [
        "Weekly group sessions",
        "1:1 mentoring",
        "Project reviews",
        "Career planning",
      ],
      nextStart: "March 15, 2024",
      spots: 3,
    },
    {
      id: 2,
      title: "Marketing Leadership Bootcamp",
      description:
        "Intensive program for marketing professionals transitioning to leadership roles",
      duration: "8 weeks",
      participants: "6-8",
      mentors: "2 marketing directors",
      price: "$1,800",
      features: [
        "Leadership workshops",
        "Case study analysis",
        "Peer networking",
        "Action planning",
      ],
      nextStart: "April 1, 2024",
      spots: 5,
    },
  ];

  const categories = [
    { id: "all", label: "All Fields", icon: <Globe className="w-4 h-4" /> },
    {
      id: "technology",
      label: "Technology",
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: "marketing",
      label: "Marketing",
      icon: <Users className="w-4 h-4" />,
    },
    { id: "design", label: "Design", icon: <Award className="w-4 h-4" /> },
    { id: "finance", label: "Finance", icon: <BookOpen className="w-4 h-4" /> },
  ];

  const experienceLevels = [
    { id: "all", label: "All Experience" },
    { id: "5+", label: "5+ Years" },
    { id: "8+", label: "8+ Years" },
    { id: "10+", label: "10+ Years" },
    { id: "15+", label: "15+ Years" },
  ];

  useEffect(() => {
    let filtered = mentors;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (mentor) => mentor.category === selectedCategory
      );
    }

    if (selectedExperience !== "all") {
      filtered = filtered.filter((mentor) =>
        mentor.experience.includes(selectedExperience)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (mentor) =>
          mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          mentor.expertise.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredMentors(filtered);
  }, [selectedCategory, selectedExperience, searchTerm]);

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "Available":
        return "text-green-400 bg-green-500/10";
      case "Limited":
        return "text-yellow-400 bg-yellow-500/10";
      case "Busy":
        return "text-red-400 bg-red-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              Career{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Mentorship
              </span>
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Connect with industry experts and accelerate your career growth
            through personalized mentorship. Get guidance, feedback, and support
            from experienced professionals.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex justify-center">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 border border-slate-700">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("find-mentor")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === "find-mentor"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Find a Mentor
                </button>
                <button
                  onClick={() => setActiveTab("programs")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === "programs"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Group Programs
                </button>
                <button
                  onClick={() => setActiveTab("become-mentor")}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === "become-mentor"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Become a Mentor
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Find a Mentor Tab */}
        {activeTab === "find-mentor" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Search and Filters */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-12">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search mentors by name, company, or expertise..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Field of Expertise
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                          selectedCategory === category.id
                            ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                        }`}
                      >
                        {category.icon}
                        <span>{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    {experienceLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Mentors Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {filteredMentors.map((mentor, index) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6 hover:border-cyan-500/50 transition-all duration-300"
                >
                  {/* Mentor Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      {mentor.verified && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {mentor.name}
                          </h3>
                          <p className="text-cyan-400">{mentor.title}</p>
                          <p className="text-slate-400 text-sm">
                            {mentor.company}
                          </p>
                        </div>
                        {mentor.featured && (
                          <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-semibold">
                          {mentor.rating}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">
                        {mentor.reviews} reviews
                      </span>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-semibold mb-1">
                        {mentor.sessions}
                      </div>
                      <span className="text-xs text-slate-400">sessions</span>
                    </div>
                    <div className="text-center">
                      <div className="text-white font-semibold mb-1">
                        {mentor.experience}
                      </div>
                      <span className="text-xs text-slate-400">experience</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                    {mentor.bio}
                  </p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mentor.expertise.slice(0, 4).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-lg"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Availability and Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs ${getAvailabilityColor(
                          mentor.availability
                        )}`}
                      >
                        {mentor.availability}
                      </span>
                      <span className="text-slate-400 text-xs">
                        Responds in {mentor.responseTime}
                      </span>
                    </div>
                    <span className="text-white font-semibold">
                      {mentor.price}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Book Session
                    </button>
                    <button className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all duration-300">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Group Programs Tab */}
        {activeTab === "programs" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {mentorshipPrograms.map((program, index) => (
              <div
                key={program.id}
                className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {program.title}
                    </h3>
                    <p className="text-slate-300 mb-6">{program.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span>Duration: {program.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span>Participants: {program.participants}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <UserCheck className="w-4 h-4 text-cyan-400" />
                        <span>Mentors: {program.mentors}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        <span>Next Start: {program.nextStart}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-white">
                        {program.price}
                      </span>
                      <span className="text-orange-400 font-medium">
                        {program.spots} spots left
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">
                      Program Features
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {program.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2 text-slate-300"
                        >
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2">
                      <span>Apply Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Become a Mentor Tab */}
        {activeTab === "become-mentor" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Share Your Expertise
                </h3>
                <p className="text-slate-300 text-lg">
                  Help shape the next generation of professionals while earning
                  additional income
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white">
                    Benefits of Mentoring
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Earn $50-200+ per hour",
                      "Flexible scheduling",
                      "Give back to community",
                      "Expand your network",
                      "Develop leadership skills",
                    ].map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 text-slate-300"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-semibold text-white">
                    Requirements
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "5+ years industry experience",
                      "Leadership or senior role",
                      "Passion for helping others",
                      "Strong communication skills",
                      "Available 2+ hours per week",
                    ].map((requirement, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 text-slate-300"
                      >
                        <Target className="w-5 h-5 text-cyan-400" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center gap-2 mx-auto">
                  <span>Apply to Become a Mentor</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-slate-400 text-sm mt-4">
                  Application review typically takes 3-5 business days
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
