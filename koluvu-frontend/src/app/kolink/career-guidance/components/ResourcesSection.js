// src/app/career-guidance/components/ResourcesSection.js

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Play,
  FileText,
  Users,
  Star,
  ArrowRight,
  Search,
  Filter,
  Clock,
  Download,
  ExternalLink,
  Award,
  TrendingUp,
  Globe,
  Headphones,
  Video,
  Calendar,
  Heart,
  Share2,
} from "lucide-react";

export default function ResourcesSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResources, setFilteredResources] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const resources = [
    {
      id: 1,
      title: "Complete Guide to Software Engineering Career",
      description:
        "Comprehensive roadmap covering everything from coding bootcamps to senior engineering roles.",
      type: "guide",
      category: "technology",
      duration: "45 min read",
      difficulty: "Beginner",
      rating: 4.8,
      author: "Tech Career Lab",
      tags: ["Software Engineering", "Career Growth", "Programming"],
      url: "#",
      downloadable: true,
      free: true,
      trending: true,
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 2,
      title: "Data Science Bootcamp - From Zero to Hero",
      description:
        "Complete video series covering Python, Statistics, Machine Learning, and real-world projects.",
      type: "course",
      category: "technology",
      duration: "12 hours",
      difficulty: "Intermediate",
      rating: 4.9,
      author: "DataPro Academy",
      tags: ["Data Science", "Python", "Machine Learning"],
      url: "#",
      downloadable: false,
      free: false,
      price: "$99",
      trending: true,
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 3,
      title: "Marketing Career Success Podcast",
      description:
        "Weekly interviews with marketing leaders sharing their career journeys and insights.",
      type: "podcast",
      category: "marketing",
      duration: "30-60 min episodes",
      difficulty: "All Levels",
      rating: 4.6,
      author: "Marketing Masters",
      tags: ["Marketing", "Career Stories", "Leadership"],
      url: "#",
      downloadable: false,
      free: true,
      trending: false,
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 4,
      title: "UX Design Portfolio Template",
      description:
        "Professional portfolio template with case study examples and design guidelines.",
      type: "template",
      category: "design",
      duration: "Instant download",
      difficulty: "Beginner",
      rating: 4.7,
      author: "Design Co",
      tags: ["UX Design", "Portfolio", "Templates"],
      url: "#",
      downloadable: true,
      free: false,
      price: "$29",
      trending: false,
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 5,
      title: "Finance Career Webinar Series",
      description:
        "Live monthly webinars covering investment banking, corporate finance, and fintech careers.",
      type: "webinar",
      category: "finance",
      duration: "90 min sessions",
      difficulty: "Intermediate",
      rating: 4.5,
      author: "Finance Futures",
      tags: ["Finance", "Investment Banking", "Career Advice"],
      url: "#",
      downloadable: false,
      free: true,
      upcoming: true,
      thumbnail: "/api/placeholder/300/200",
    },
    {
      id: 6,
      title: "Resume Templates for Tech Professionals",
      description:
        "Collection of ATS-friendly resume templates specifically designed for tech roles.",
      type: "template",
      category: "general",
      duration: "Instant download",
      difficulty: "Beginner",
      rating: 4.8,
      author: "Career Tools",
      tags: ["Resume", "Templates", "Job Search"],
      url: "#",
      downloadable: true,
      free: true,
      trending: true,
      thumbnail: "/api/placeholder/300/200",
    },
  ];

  const categories = [
    { id: "all", label: "All Categories", icon: <Globe className="w-4 h-4" /> },
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
    { id: "general", label: "General", icon: <Star className="w-4 h-4" /> },
  ];

  const types = [
    { id: "all", label: "All Types" },
    { id: "guide", label: "Guides", icon: <FileText className="w-4 h-4" /> },
    { id: "course", label: "Courses", icon: <Play className="w-4 h-4" /> },
    {
      id: "podcast",
      label: "Podcasts",
      icon: <Headphones className="w-4 h-4" />,
    },
    { id: "webinar", label: "Webinars", icon: <Video className="w-4 h-4" /> },
    {
      id: "template",
      label: "Templates",
      icon: <Download className="w-4 h-4" />,
    },
  ];

  useEffect(() => {
    let filtered = resources;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (resource) => resource.category === selectedCategory
      );
    }

    if (selectedType !== "all") {
      filtered = filtered.filter((resource) => resource.type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          resource.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          resource.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredResources(filtered);
  }, [selectedCategory, selectedType, searchTerm]);

  const toggleFavorite = (resourceId) => {
    setFavorites((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "guide":
        return <FileText className="w-5 h-5" />;
      case "course":
        return <Play className="w-5 h-5" />;
      case "podcast":
        return <Headphones className="w-5 h-5" />;
      case "webinar":
        return <Video className="w-5 h-5" />;
      case "template":
        return <Download className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-400 bg-green-500/10";
      case "Intermediate":
        return "text-yellow-400 bg-yellow-500/10";
      case "Advanced":
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
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              Career{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Resources
              </span>
            </h1>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Access curated learning materials, tools, and content to accelerate
            your career growth. From beginner guides to advanced courses, find
            everything you need.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category
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

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Resource Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden hover:border-cyan-500/50 transition-all duration-300 group"
            >
              {/* Resource Thumbnail */}
              <div className="relative h-48 bg-slate-700 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                  {getTypeIcon(resource.type)}
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {resource.trending && (
                    <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full">
                      Trending
                    </span>
                  )}
                  {resource.free ? (
                    <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                      Free
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                      {resource.price}
                    </span>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(resource.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-800/80 backdrop-blur-sm transition-all duration-300 hover:bg-slate-700"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites.includes(resource.id)
                        ? "text-red-400 fill-current"
                        : "text-slate-400"
                    }`}
                  />
                </button>
              </div>

              {/* Resource Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(resource.type)}
                    <span className="text-sm text-cyan-400 capitalize">
                      {resource.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-white">
                      {resource.rating}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {resource.title}
                </h3>

                <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                  {resource.description}
                </p>

                {/* Resource Meta */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-4 h-4" />
                      {resource.duration}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs ${getDifficultyColor(
                        resource.difficulty
                      )}`}
                    >
                      {resource.difficulty}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    By {resource.author}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-2 text-sm">
                    {resource.downloadable ? (
                      <>
                        <Download className="w-4 h-4" />
                        Download
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Access
                      </>
                    )}
                  </button>

                  <button className="px-3 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all duration-300">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Resources Found
            </h3>
            <p className="text-slate-400">
              Try adjusting your search or filters to find relevant resources.
            </p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Submit a request for specific resources or suggest new content
              areas you'd like us to cover.
            </p>
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 flex items-center gap-2 mx-auto">
              <span>Request Resources</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
