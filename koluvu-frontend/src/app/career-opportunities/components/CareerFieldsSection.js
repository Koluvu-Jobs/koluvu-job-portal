// src/app/career-opportuities/components/CareerFieldsSection.js

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Code,
  Briefcase,
  Heart,
  Palette,
  Calculator,
  Megaphone,
  Search,
  TrendingUp,
  Users,
  ArrowRight,
  Star,
  DollarSign,
  Clock,
} from "lucide-react";

export default function CareerFieldsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedField, setSelectedField] = useState(null);
  const [filteredFields, setFilteredFields] = useState([]);

  const careerFields = [
    {
      id: 1,
      name: "Technology & Software",
      description:
        "Build the digital future with cutting-edge technologies and innovative solutions.",
      icon: <Code className="w-8 h-8" />,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      averageSalary: "$75,000 - $150,000",
      growthRate: "22% annually",
      jobCount: "2.5M+",
      trending: true,
      skills: [
        "Programming",
        "Problem Solving",
        "System Design",
        "Cloud Computing",
      ],
      careerPaths: [
        "Software Developer",
        "Data Scientist",
        "DevOps Engineer",
        "Product Manager",
        "UI/UX Designer",
      ],
    },
    {
      id: 2,
      name: "Business & Finance",
      description:
        "Drive business growth and financial success through strategic thinking and analysis.",
      icon: <Briefcase className="w-8 h-8" />,
      color: "from-green-400 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
      averageSalary: "$60,000 - $120,000",
      growthRate: "8% annually",
      jobCount: "1.8M+",
      trending: false,
      skills: [
        "Financial Analysis",
        "Strategic Planning",
        "Leadership",
        "Communication",
      ],
      careerPaths: [
        "Financial Analyst",
        "Business Consultant",
        "Investment Banker",
        "Operations Manager",
        "Entrepreneur",
      ],
    },
    {
      id: 3,
      name: "Healthcare & Medicine",
      description:
        "Make a difference in people's lives through healthcare and medical innovation.",
      icon: <Heart className="w-8 h-8" />,
      color: "from-red-400 to-pink-500",
      bgColor: "from-red-500/10 to-pink-500/10",
      averageSalary: "$70,000 - $200,000",
      growthRate: "15% annually",
      jobCount: "1.2M+",
      trending: true,
      skills: [
        "Medical Knowledge",
        "Empathy",
        "Critical Thinking",
        "Communication",
      ],
      careerPaths: [
        "Physician",
        "Nurse Practitioner",
        "Medical Researcher",
        "Healthcare Administrator",
        "Pharmacist",
      ],
    },
    {
      id: 4,
      name: "Creative & Design",
      description:
        "Express creativity and bring ideas to life through visual and digital media.",
      icon: <Palette className="w-8 h-8" />,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/10 to-pink-500/10",
      averageSalary: "$45,000 - $90,000",
      growthRate: "13% annually",
      jobCount: "800K+",
      trending: true,
      skills: [
        "Creativity",
        "Design Software",
        "Visual Communication",
        "Brand Strategy",
      ],
      careerPaths: [
        "Graphic Designer",
        "Creative Director",
        "UX/UI Designer",
        "Animator",
        "Art Director",
      ],
    },
    {
      id: 5,
      name: "Engineering",
      description:
        "Solve complex problems and build the infrastructure that powers our world.",
      icon: <Calculator className="w-8 h-8" />,
      color: "from-orange-400 to-red-500",
      bgColor: "from-orange-500/10 to-red-500/10",
      averageSalary: "$70,000 - $130,000",
      growthRate: "7% annually",
      jobCount: "1.5M+",
      trending: false,
      skills: [
        "Technical Analysis",
        "Problem Solving",
        "Mathematics",
        "Project Management",
      ],
      careerPaths: [
        "Civil Engineer",
        "Mechanical Engineer",
        "Electrical Engineer",
        "Chemical Engineer",
        "Aerospace Engineer",
      ],
    },
    {
      id: 6,
      name: "Marketing & Sales",
      description:
        "Connect brands with customers and drive business growth through strategic marketing.",
      icon: <Megaphone className="w-8 h-8" />,
      color: "from-yellow-400 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
      averageSalary: "$50,000 - $100,000",
      growthRate: "10% annually",
      jobCount: "1.3M+",
      trending: true,
      skills: [
        "Communication",
        "Analytics",
        "Creativity",
        "Customer Psychology",
      ],
      careerPaths: [
        "Digital Marketer",
        "Sales Manager",
        "Brand Manager",
        "Content Strategist",
        "Growth Hacker",
      ],
    },
  ];

  useEffect(() => {
    const filtered = careerFields.filter(
      (field) =>
        field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.skills.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredFields(filtered);
  }, [searchTerm]);

  const handleFieldClick = (field) => {
    setSelectedField(selectedField?.id === field.id ? null : field);
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-400/30 backdrop-blur-sm">
            <Briefcase className="w-6 h-6 text-cyan-400" />
            <span className="text-cyan-300 font-medium">
              Career Exploration
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
              Explore Career
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Fields
            </span>
          </h1>

          <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto mb-8">
            Discover diverse career opportunities across industries and find the
            perfect path that aligns with your interests and skills.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search career fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent backdrop-blur-sm"
            />
          </div>
        </motion.div>

        {/* Career Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredFields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative cursor-pointer"
              onClick={() => handleFieldClick(field)}
            >
              {/* Glow Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${field.color} rounded-2xl blur opacity-0 group-hover:opacity-75 transition duration-500`}
              ></div>

              <div
                className={`relative h-full bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-300 ${
                  selectedField?.id === field.id ? "ring-2 ring-cyan-400" : ""
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-r ${field.color} text-white transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    {field.icon}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {field.trending && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30">
                        <TrendingUp className="w-3 h-3 text-green-400" />
                        <span className="text-green-300 text-xs font-medium">
                          Trending
                        </span>
                      </div>
                    )}
                    <div className="text-slate-400 text-sm">
                      {field.jobCount} jobs
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  {field.name}
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {field.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <div>
                      <div className="text-xs text-slate-400">Salary Range</div>
                      <div className="text-sm text-white font-medium">
                        {field.averageSalary}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-900/50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs text-slate-400">Growth Rate</div>
                      <div className="text-sm text-white font-medium">
                        {field.growthRate}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Preview */}
                <div className="mb-4">
                  <div className="text-xs text-slate-400 mb-2">Key Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {field.skills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-700/50 text-xs text-slate-300 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                    {field.skills.length > 3 && (
                      <span className="px-2 py-1 bg-slate-700/50 text-xs text-slate-400 rounded-md">
                        +{field.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Expand Button */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    {field.careerPaths.length} career paths
                  </span>
                  <ArrowRight
                    className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${
                      selectedField?.id === field.id
                        ? "rotate-90"
                        : "group-hover:translate-x-1"
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detailed View */}
        {selectedField && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div
                  className={`p-4 rounded-xl bg-gradient-to-r ${selectedField.color} text-white`}
                >
                  {selectedField.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {selectedField.name}
                  </h2>
                  <p className="text-slate-300">{selectedField.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Career Paths */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    Popular Career Paths
                  </h3>
                  <div className="space-y-3">
                    {selectedField.careerPaths.map((path, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors cursor-pointer"
                      >
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-medium">{path}</span>
                        <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills & Requirements */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    Essential Skills
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedField.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900/50 rounded-lg text-center"
                      >
                        <span className="text-white font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-400/20">
                    <h4 className="text-lg font-bold text-white mb-2">
                      Ready to Start?
                    </h4>
                    <p className="text-slate-300 text-sm mb-4">
                      Take our skill assessment to see how well you match with
                      this field and get personalized recommendations.
                    </p>
                    <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-200">
                      Take Assessment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-cyan-400/20 rounded-2xl">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Need Personalized Guidance?
              </h3>
              <p className="text-slate-300">
                Connect with industry experts and get tailored career advice for
                your specific situation.
              </p>
            </div>
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-cyan-500/25 whitespace-nowrap">
              Find a Mentor
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
