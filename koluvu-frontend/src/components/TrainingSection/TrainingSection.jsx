"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGraduationCap,
  faSearch,
  faMapMarkerAlt,
  faCalendarAlt,
  faUsers,
  faClock,
  faStar,
  faBuilding,
  faPhone,
  faEnvelope,
  faGlobe,
  faAward,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";

const TrainingSection = () => {
  const [providers, setProviders] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("programs");

  // Mock data for demo (in real implementation, this would come from API)
  const mockProviders = [
    {
      id: 1,
      organization_name: "TechSkills Academy",
      contact_person: "Dr. Sarah Johnson",
      phone: "+1-555-0123",
      email: "contact@techskills.edu",
      website: "https://techskills.edu",
      address: "123 Education Street, Tech City, TC 12345",
      description:
        "Leading technology training provider specializing in modern software development and cloud technologies.",
      experience_years: 15,
      team_size: 50,
      is_verified: true,
      statistics: {
        total_programs: 25,
        total_enrollments: 1200,
        program_categories: [
          "Web Development",
          "Cloud Computing",
          "Data Science",
        ],
      },
    },
    {
      id: 2,
      organization_name: "Digital Innovation Institute",
      contact_person: "Prof. Michael Chen",
      phone: "+1-555-0456",
      email: "info@digitalinnovation.org",
      website: "https://digitalinnovation.org",
      address: "456 Innovation Blvd, Digital City, DC 67890",
      description:
        "Premier institution for digital transformation and emerging technology training programs.",
      experience_years: 12,
      team_size: 75,
      is_verified: true,
      statistics: {
        total_programs: 18,
        total_enrollments: 950,
        program_categories: ["AI/ML", "Blockchain", "IoT Development"],
      },
    },
  ];

  const mockPrograms = [
    {
      id: 1,
      title: "Full Stack Web Development Bootcamp",
      description:
        "Comprehensive program covering React, Node.js, and modern web technologies.",
      category: "Web Development",
      duration_weeks: 16,
      start_date: "2024-02-15",
      end_date: "2024-06-07",
      capacity: 30,
      fee: "$4,999",
      provider_name: "TechSkills Academy",
      enrolled_count: 24,
      available_slots: 6,
      status: "Active",
    },
    {
      id: 2,
      title: "AWS Cloud Architecture Certification",
      description:
        "Professional certification program for AWS cloud solutions architecture.",
      category: "Cloud Computing",
      duration_weeks: 12,
      start_date: "2024-03-01",
      end_date: "2024-05-24",
      capacity: 25,
      fee: "$3,499",
      provider_name: "TechSkills Academy",
      enrolled_count: 18,
      available_slots: 7,
      status: "Active",
    },
    {
      id: 3,
      title: "Machine Learning & AI Fundamentals",
      description:
        "Introduction to ML algorithms, Python programming, and AI applications.",
      category: "Data Science",
      duration_weeks: 20,
      start_date: "2024-02-01",
      end_date: "2024-06-21",
      capacity: 20,
      fee: "$5,999",
      provider_name: "Digital Innovation Institute",
      enrolled_count: 15,
      available_slots: 5,
      status: "Active",
    },
  ];

  const mockStatistics = {
    total_providers: 25,
    total_programs: 78,
    total_enrollments: 3420,
    top_categories: [
      { category: "Web Development", count: 15 },
      { category: "Cloud Computing", count: 12 },
      { category: "Data Science", count: 10 },
      { category: "Mobile Development", count: 8 },
      { category: "Cybersecurity", count: 6 },
    ],
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setProviders(mockProviders);
      setPrograms(mockPrograms);
      setStatistics(mockStatistics);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch =
      searchQuery === "" ||
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.provider_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || program.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleEnroll = (programId) => {
    alert(
      `Enrolling in program ${programId}. This would redirect to enrollment process.`
    );
  };

  const handleViewProvider = (provider) => {
    setSelectedProvider(provider);
  };

  const handleContactProvider = (provider) => {
    alert(
      `Contacting ${provider.organization_name}. This would open contact form or direct communication.`
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Training Providers</p>
                <p className="text-2xl font-bold">
                  {statistics.total_providers}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faBuilding}
                className="text-3xl text-blue-200"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Available Programs</p>
                <p className="text-2xl font-bold">
                  {statistics.total_programs}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faGraduationCap}
                className="text-3xl text-green-200"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Total Enrollments</p>
                <p className="text-2xl font-bold">
                  {statistics.total_enrollments}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faUsers}
                className="text-3xl text-purple-200"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Top Categories</p>
                <p className="text-2xl font-bold">
                  {statistics.top_categories?.length || 0}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faAward}
                className="text-3xl text-orange-200"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "programs"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("programs")}
        >
          <FontAwesomeIcon icon={faGraduationCap} className="mr-2" />
          Training Programs
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "providers"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("providers")}
        >
          <FontAwesomeIcon icon={faBuilding} className="mr-2" />
          Training Providers
        </button>
      </div>

      {/* Search and Filter Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search programs, providers, or categories..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon={faFilter}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {statistics.top_categories?.map((cat, index) => (
                  <option key={index} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on active tab */}
      {activeTab === "programs" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPrograms.map((program) => (
            <Card
              key={program.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {program.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <FontAwesomeIcon icon={faBuilding} className="mr-2" />
                      {program.provider_name}
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {program.category}
                  </span>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {program.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faClock} className="mr-2" />
                    {program.duration_weeks} weeks
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faUsers} className="mr-2" />
                    {program.enrolled_count}/{program.capacity} enrolled
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    {new Date(program.start_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-gray-900 font-semibold">
                    {program.fee}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {program.available_slots} slots remaining
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => handleEnroll(program.id)}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "providers" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {providers.map((provider) => (
            <Card
              key={provider.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {provider.organization_name}
                    </h3>
                    {provider.is_verified && (
                      <div className="flex items-center text-green-600 text-sm mb-2">
                        <FontAwesomeIcon icon={faStar} className="mr-1" />
                        Verified Provider
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {provider.description}
                </p>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="mr-2 w-4"
                    />
                    {provider.address}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faPhone} className="mr-2 w-4" />
                    {provider.phone}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2 w-4" />
                    {provider.email}
                  </div>
                  {provider.website && (
                    <div className="flex items-center text-blue-600">
                      <FontAwesomeIcon icon={faGlobe} className="mr-2 w-4" />
                      <a
                        href={provider.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {provider.statistics.total_programs}
                    </div>
                    <div className="text-gray-600">Programs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {provider.statistics.total_enrollments}
                    </div>
                    <div className="text-gray-600">Enrollments</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {provider.experience_years}
                    </div>
                    <div className="text-gray-600">Years Exp.</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Contact: {provider.contact_person}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => handleViewProvider(provider)}
                    >
                      View Details
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      onClick={() => handleContactProvider(provider)}
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Provider Details Modal */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProvider.organization_name}
                  </h2>
                  {selectedProvider.is_verified && (
                    <div className="flex items-center text-green-600">
                      <FontAwesomeIcon icon={faStar} className="mr-1" />
                      Verified Training Provider
                    </div>
                  )}
                </div>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedProvider(null)}
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Provider Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Contact Person</p>
                      <p className="font-medium">
                        {selectedProvider.contact_person}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="font-medium">
                        {selectedProvider.experience_years} years
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Team Size</p>
                      <p className="font-medium">
                        {selectedProvider.team_size} professionals
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{selectedProvider.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Training Statistics
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Total Programs</p>
                      <p className="font-medium">
                        {selectedProvider.statistics.total_programs}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Enrollments</p>
                      <p className="font-medium">
                        {selectedProvider.statistics.total_enrollments}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Specializations</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedProvider.statistics.program_categories.map(
                          (category, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {category}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">About</h3>
                <p className="text-gray-700">{selectedProvider.description}</p>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  onClick={() => setSelectedProvider(null)}
                >
                  Close
                </button>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleContactProvider(selectedProvider)}
                >
                  Contact Provider
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TrainingSection;
