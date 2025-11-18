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
  faChartLine,
  faBriefcase,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

const EmployerTrainingSection = () => {
  const [providers, setProviders] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [activeTab, setActiveTab] = useState("programs");

  // Mock data for employer-focused training
  const mockProviders = [
    {
      id: 1,
      organization_name: "Corporate Skills Academy",
      contact_person: "Dr. Jennifer Martinez",
      phone: "+1-555-0789",
      email: "corporate@skillsacademy.com",
      website: "https://corporateskills.edu",
      address: "789 Business Park, Corporate City, CC 54321",
      description:
        "Specialized in corporate training and employee skill development programs for businesses of all sizes.",
      experience_years: 18,
      team_size: 65,
      is_verified: true,
      corporate_clients: 150,
      statistics: {
        total_programs: 35,
        total_enrollments: 2500,
        program_categories: [
          "Leadership Development",
          "Technical Skills",
          "Soft Skills Training",
        ],
      },
    },
    {
      id: 2,
      organization_name: "Enterprise Learning Solutions",
      contact_person: "Mr. David Thompson",
      phone: "+1-555-0321",
      email: "enterprise@learningsolutions.com",
      website: "https://enterpriselearning.com",
      address: "321 Training Ave, Business District, BD 98765",
      description:
        "Premier enterprise training provider focusing on scalable learning solutions for large organizations.",
      experience_years: 20,
      team_size: 120,
      is_verified: true,
      corporate_clients: 300,
      statistics: {
        total_programs: 42,
        total_enrollments: 4200,
        program_categories: [
          "Digital Transformation",
          "Project Management",
          "Compliance Training",
        ],
      },
    },
  ];

  const mockPrograms = [
    {
      id: 1,
      title: "Leadership Excellence Program",
      description:
        "Comprehensive leadership development for managers and executives. Build essential leadership skills and strategic thinking.",
      category: "Leadership Development",
      duration_weeks: 8,
      start_date: "2024-02-20",
      end_date: "2024-04-15",
      capacity: 25,
      fee: "$2,499 per participant",
      provider_name: "Corporate Skills Academy",
      enrolled_count: 18,
      available_slots: 7,
      status: "Active",
      delivery_method: "Hybrid",
      target_audience: "Mid-level to Senior Managers",
    },
    {
      id: 2,
      title: "Digital Transformation Workshop",
      description:
        "Strategic workshop for companies undergoing digital transformation. Includes change management and technology adoption.",
      category: "Digital Transformation",
      duration_weeks: 6,
      start_date: "2024-03-01",
      end_date: "2024-04-12",
      capacity: 30,
      fee: "$3,999 per participant",
      provider_name: "Enterprise Learning Solutions",
      enrolled_count: 22,
      available_slots: 8,
      status: "Active",
      delivery_method: "Online",
      target_audience: "C-Level Executives, IT Directors",
    },
    {
      id: 3,
      title: "Agile Project Management Certification",
      description:
        "Industry-recognized certification in Agile methodologies including Scrum and Kanban frameworks.",
      category: "Project Management",
      duration_weeks: 10,
      start_date: "2024-02-15",
      end_date: "2024-04-26",
      capacity: 20,
      fee: "$1,899 per participant",
      provider_name: "Enterprise Learning Solutions",
      enrolled_count: 15,
      available_slots: 5,
      status: "Active",
      delivery_method: "In-Person",
      target_audience: "Project Managers, Team Leads",
    },
  ];

  const mockStatistics = {
    total_providers: 35,
    total_programs: 125,
    total_enrollments: 8500,
    corporate_clients: 650,
    top_categories: [
      { category: "Leadership Development", count: 25 },
      { category: "Technical Skills", count: 20 },
      { category: "Digital Transformation", count: 18 },
      { category: "Project Management", count: 15 },
      { category: "Soft Skills Training", count: 12 },
    ],
  };

  // API integration functions
  const fetchTrainingData = async () => {
    try {
      setLoading(true);

      // Fetch providers from public API
      const providersResponse = await fetch(
        "http://127.0.0.1:8000/api/training/public/providers/"
      );
      const providersData = await providersResponse.json();

      // Fetch programs from public API
      const programsResponse = await fetch(
        "http://127.0.0.1:8000/api/training/public/programs/"
      );
      const programsData = await programsResponse.json();

      // Fetch statistics from public API
      const statisticsResponse = await fetch(
        "http://127.0.0.1:8000/api/training/public/statistics/"
      );
      const statisticsData = await statisticsResponse.json();

      setProviders(providersData || []);
      setPrograms(programsData || []);
      setStatistics(statisticsData || {});
    } catch (error) {
      console.error("Error fetching training data:", error);
      // Fallback to mock data if API fails
      setProviders(mockProviders);
      setPrograms(mockPrograms);
      setStatistics(mockStatistics);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainingData();
  }, []);

  const filteredPrograms = programs.filter((program) => {
    const providerName =
      program.provider?.organization_name || program.provider_name || "";
    const matchesSearch =
      searchQuery === "" ||
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "" || program.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleRequestQuote = (programId, programTitle) => {
    alert(
      `Requesting enterprise quote for "${programTitle}". This would open corporate inquiry form with volume pricing options.`
    );
  };

  const handleScheduleDemo = (provider) => {
    alert(
      `Scheduling corporate demo with ${provider.organization_name}. This would open calendar booking system for training consultations.`
    );
  };

  const handleBulkEnrollment = (program) => {
    const programTitle = program.title;
    const providerName =
      program.provider?.organization_name || program.provider_name;
    alert(
      `Starting bulk enrollment for "${programTitle}" by ${providerName}. This would open team enrollment portal with corporate features.`
    );
  };

  const handleRequestPartnership = (provider) => {
    alert(
      `Partnership request sent to ${provider.organization_name}. Our team will contact you within 24 hours to discuss corporate training partnerships.`
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
      {/* Employer Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">
          Corporate Training Partnerships
        </h1>
        <p className="text-blue-100">
          Find verified training providers to upskill your workforce and build
          strategic learning partnerships.
        </p>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Training Partners</p>
                <p className="text-2xl font-bold">
                  {statistics.total_providers || providers.length}
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
                  {statistics.total_programs || programs.length}
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
                  {statistics.total_enrollments || "2,400+"}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faUserTie}
                className="text-3xl text-purple-200"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Program Categories</p>
                <p className="text-2xl font-bold">
                  {statistics.total_categories ||
                    Object.keys(statistics.categories_with_counts || {})
                      .length ||
                    11}
                </p>
              </div>
              <FontAwesomeIcon
                icon={faBriefcase}
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
          Corporate Programs
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
          Training Partners
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
                placeholder="Search corporate training programs, providers, or specializations..."
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
                      {program.provider?.organization_name ||
                        program.provider_name}
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
                    {program.enrolled_count || 0}/{program.capacity || "N/A"}{" "}
                    enrolled
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    {program.start_date
                      ? new Date(program.start_date).toLocaleDateString()
                      : "Flexible Start"}
                  </div>
                  <div className="flex items-center text-gray-900 font-semibold">
                    ${program.fee || "Contact for pricing"}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {program.delivery_method || program.status || "Active"}
                  </span>
                  {program.target_audience && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      {program.target_audience}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {program.available_slots ||
                      program.capacity - (program.enrolled_count || 0) ||
                      "Contact for availability"}{" "}
                    slots available
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      onClick={() =>
                        handleRequestQuote(program.id, program.title)
                      }
                    >
                      Request Quote
                    </button>
                    <button
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      onClick={() => handleBulkEnrollment(program)}
                    >
                      Bulk Enroll
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
                        Verified Corporate Partner
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

                <div className="grid grid-cols-4 gap-2 mb-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {provider.statistics.total_programs}
                    </div>
                    <div className="text-gray-600">Programs</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {provider.corporate_clients}
                    </div>
                    <div className="text-gray-600">Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {provider.experience_years}
                    </div>
                    <div className="text-gray-600">Years</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {provider.team_size}
                    </div>
                    <div className="text-gray-600">Team</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    Contact: {provider.contact_person}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      onClick={() => setSelectedProvider(provider)}
                    >
                      View Details
                    </button>
                    <button
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      onClick={() => handleRequestPartnership(provider)}
                    >
                      Partnership
                    </button>
                    <button
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      onClick={() => handleScheduleDemo(provider)}
                    >
                      Demo
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
                      Verified Corporate Training Partner
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
                      <p className="text-sm text-gray-600">Corporate Contact</p>
                      <p className="font-medium">
                        {selectedProvider.contact_person}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Industry Experience
                      </p>
                      <p className="font-medium">
                        {selectedProvider.experience_years} years
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Training Team</p>
                      <p className="font-medium">
                        {selectedProvider.team_size} professionals
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Corporate Clients Served
                      </p>
                      <p className="font-medium">
                        {selectedProvider.corporate_clients} companies
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Training Portfolio
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">
                        Available Programs
                      </p>
                      <p className="font-medium">
                        {selectedProvider.statistics.total_programs}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Employee Enrollments
                      </p>
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
                <h3 className="text-lg font-semibold mb-3">
                  About Our Corporate Training
                </h3>
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
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  onClick={() => handleRequestQuote(selectedProvider.id)}
                >
                  Request Proposal
                </button>
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={() => handleScheduleDemo(selectedProvider)}
                >
                  Schedule Demo
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmployerTrainingSection;
