// src/app/companies/components/CompanyDirectory.js

"use client";

import { useState, useEffect } from "react";
import CompanyCard from "./CompanyCard";
import CompanyFilters from "./CompanyFilters";
import CompanySearch from "./CompanySearch";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@koluvu/styles/components/company/company-directory.module.css";
import { api } from "@koluvu/lib/api";

// Animation variants for container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for individual items
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

// Animation for fade-in effect
const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

// Remove the static companies data - we'll use only database companies

// Company types
const companyTypes = [
  "MNC",
  "Foreign MNC",
  "Startup",
  "Manufacturing MNC",
  "Healthcare MNC",
  "NGO",
  "MSME",
  "Public Sector",
  "Small Industry",
  "Partnership",
  "Cooperative",
  "Nonprofit",
  "Sole Proprietorship",
  "Government Organization",
  "Private Limited Company",
  "Public Limited Company",
  "Educational Institution",
  "Research Organization",
  "Healthcare Institution",
];

// Industries
const industries = [
  "Information Technology (IT) & Software",
  "Healthcare & Pharmaceuticals",
  "Finance, Banking & Insurance",
  "Marketing, Advertising & PR",
  "Education & Training",
  "Manufacturing & Production",
  "Retail & E-Commerce",
  "Construction & Real Estate",
  "Telecommunication & Networking",
  "Hospitality, Travel & Tourism",
  "Automobile & Auto Components",
  "Energy, Oil, Gas & Utilities",
  "Agriculture, Farming & Forestry",
  "Media, Publishing & Entertainment",
  "Aerospace, Aviation & Defense",
  "Legal, Law & Compliance",
  "Government & Public Sector",
  "Transportation & Logistics",
  "FMCG (Fast-Moving Consumer Goods)",
  "Textile & Apparel",
  "Mining & Metals",
  "Consulting & Advisory Services",
  "Electronics & Semiconductors",
  "Chemicals & Petrochemicals",
  "Environmental Services & Sustainability",
  "Real Estate Investment & Property Management",
  "Consumer Durables",
  "NGOs & Social Enterprises",
  "Education Technology (EdTech)",
  "Financial Technology (FinTech)",
];

// Departments
const departments = [
  "Software Development",
  "HR",
  "Finance and Accounts",
  "Marketing",
  "Operations",
  "Customer Support",
  "Sales",
  "Research & Development",
  "Business Development",
  "Legal",
  "Public Relations",
  "Administration",
  "Product Management",
  "Quality Assurance",
  "Design",
  "Technical Support",
  "Supply Chain Management",
  "Consulting",
];

// Locations
const locations = [
  "Hyderabad",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
  "Indore",
  "Chandigarh",
  "Coimbatore",
  "Visakhapatnam",
  "Nagpur",
  "Surat",
  "Bhubaneswar",
  "Noida",
  "Gurgaon",
  "Thiruvananthapuram",
];

// Ads data
const ads = [
  {
    id: 1,
    title: "🚀 Hiring Fast?",
    description:
      "Get your jobs seen by 1M+ candidates in 24 hours with our premium listings.",
    cta: "Boost Your Post",
    link: "#",
    bgColor: "bg-blue-200",
  },
  {
    id: 2,
    title: "🏢 Join Top Startups!",
    description: "Explore 5,000+ startup jobs in tech, marketing, and design.",
    cta: "Browse Jobs",
    link: "#",
    bgColor: "bg-yellow-200",
  },
  {
    id: 3,
    title: "🌍 Work Remotely",
    description:
      "Discover remote opportunities from global tech giants and emerging startups.",
    cta: "Find Remote Jobs",
    link: "#",
    bgColor: "bg-green-200",
  },
  {
    id: 4,
    title: "💰 Salary Benchmarking",
    description:
      "Get personalized salary insights and know what you deserve before you negotiate.",
    cta: "Check Salaries",
    link: "#",
    bgColor: "bg-purple-200",
  },
  {
    id: 5,
    title: "🎯 Hire Top Talent",
    description:
      "Post a job and reach vetted professionals actively looking for new roles.",
    cta: "Post a Job",
    link: "#",
    bgColor: "bg-pink-200",
  },
  {
    id: 6,
    title: "🧑‍💻 Tech Jobs Hotlist",
    description:
      "Latest openings for developers, designers, and PMs at Amazon, Google, and top startups.",
    cta: "View Listings",
    link: "#",
    bgColor: "bg-indigo-200",
  },
  {
    id: 7,
    title: "🏆 Top Companies Hiring",
    description:
      "Apply to jobs at Fortune 500 companies and fast-growing startups, all in one place.",
    cta: "See Companies",
    link: "#",
    bgColor: "bg-orange-200",
  },
  {
    id: 8,
    title: "🎓 Freshers Welcome!",
    description:
      "Thousands of entry-level roles now open for 2024 graduates across India and abroad.",
    cta: "Explore Fresher Jobs",
    link: "#",
    bgColor: "bg-teal-200",
  },
];

// Color mapping for industries
const industryColors = {
  "Information Technology (IT) & Software": "bg-blue-100 text-blue-800",
  "Healthcare & Pharmaceuticals": "bg-green-100 text-green-800",
  "Finance, Banking & Insurance": "bg-purple-100 text-purple-800",
  "Marketing, Advertising & PR": "bg-pink-100 text-pink-800",
  "Education & Training": "bg-yellow-100 text-yellow-800",
  "Manufacturing & Production": "bg-red-100 text-red-800",
  "Retail & E-Commerce": "bg-indigo-100 text-indigo-800",
  "Construction & Real Estate": "bg-orange-100 text-orange-800",
  "Telecommunication & Networking": "bg-teal-100 text-teal-800",
  "Hospitality, Travel & Tourism": "bg-cyan-100 text-cyan-800",
  "Automobile & Auto Components": "bg-amber-100 text-amber-800",
  "Energy, Oil, Gas & Utilities": "bg-gray-100 text-gray-800",
  "Agriculture, Farming & Forestry": "bg-lime-100 text-lime-800",
  "Media, Publishing & Entertainment": "bg-fuchsia-100 text-fuchsia-800",
  "Aerospace, Aviation & Defense": "bg-sky-100 text-sky-800",
  "Legal, Law & Compliance": "bg-violet-100 text-violet-800",
  "Government & Public Sector": "bg-emerald-100 text-emerald-800",
  "Transportation & Logistics": "bg-rose-100 text-rose-800",
  "FMCG (Fast-Moving Consumer Goods)": "bg-amber-100 text-amber-800",
  "Textile & Apparel": "bg-pink-100 text-pink-800",
  "Mining & Metals": "bg-gray-100 text-gray-800",
  "Consulting & Advisory Services": "bg-indigo-100 text-indigo-800",
  "Electronics & Semiconductors": "bg-blue-100 text-blue-800",
  "Chemicals & Petrochemicals": "bg-green-100 text-green-800",
  "Environmental Services & Sustainability": "bg-teal-100 text-teal-800",
  "Real Estate Investment & Property Management":
    "bg-orange-100 text-orange-800",
  "Consumer Durables": "bg-red-100 text-red-800",
  "NGOs & Social Enterprises": "bg-purple-100 text-purple-800",
  "Education Technology (EdTech)": "bg-yellow-100 text-yellow-800",
  "Financial Technology (FinTech)": "bg-indigo-100 text-indigo-800",
};

// Icons for industries
const industryIcons = {
  "Information Technology (IT) & Software": "💻",
  "Healthcare & Pharmaceuticals": "🏥",
  "Finance, Banking & Insurance": "💰",
  "Marketing, Advertising & PR": "📢",
  "Education & Training": "🎓",
  "Manufacturing & Production": "🏭",
  "Retail & E-Commerce": "🛒",
  "Construction & Real Estate": "🏗️",
  "Telecommunication & Networking": "📡",
  "Hospitality, Travel & Tourism": "🏨",
  "Automobile & Auto Components": "🚗",
  "Energy, Oil, Gas & Utilities": "⚡",
  "Agriculture, Farming & Forestry": "🌾",
  "Media, Publishing & Entertainment": "🎬",
  "Aerospace, Aviation & Defense": "✈️",
  "Legal, Law & Compliance": "⚖️",
  "Government & Public Sector": "🏛️",
  "Transportation & Logistics": "🚚",
  "FMCG (Fast-Moving Consumer Goods)": "🛍️",
  "Textile & Apparel": "👕",
  "Mining & Metals": "⛏️",
  "Consulting & Advisory Services": "📊",
  "Electronics & Semiconductors": "🔌",
  "Chemicals & Petrochemicals": "🧪",
  "Environmental Services & Sustainability": "🌱",
  "Real Estate Investment & Property Management": "🏘️",
  "Consumer Durables": "🛋️",
  "NGOs & Social Enterprises": "🤝",
  "Education Technology (EdTech)": "📱",
  "Financial Technology (FinTech)": "💳",
};

// Company sections
const companySections = [
  { type: "MNC", title: "MNC Companies" },
  { type: "Foreign MNC", title: "Foreign MNC Companies" },
  { type: "Startup", title: "Startup Companies" },
  { type: "Manufacturing MNC", title: "Manufacturing MNC Companies" },
  { type: "Healthcare MNC", title: "Healthcare MNC Companies" },
  { type: "NGO", title: "NGO Companies" },
];

export default function CompanyDirectory() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    industry: "",
    type: "",
    department: "",
    location: "",
    rating: "",
  });
  const [activeCategory, setActiveCategory] = useState("");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
  });

  // Fetch companies from API
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const response = await api.fetchCompanies({
          search,
          industry: filters.industry,
          location: filters.location,
          type: filters.type,
          page: 1,
          page_size: 50,
        });

        if (response.status === "success") {
          setCompanies(response.data || []);
          setPagination(response.pagination || {});
        } else {
          setError("Failed to fetch companies");
        }
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError("Failed to load companies. Please try again.");
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [search, filters.industry, filters.location, filters.type]);

  // Use only database companies - no fallback static data
  const displayCompanies = companies;

  // Filter companies based on search and filters
  const filteredCompanies = displayCompanies.filter((company) => {
    const matchesSearch = company.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesIndustry = filters.industry
      ? company.industry === filters.industry
      : true;
    const matchesType = filters.type ? company.type === filters.type : true;
    const matchesDepartment = filters.department
      ? company.department === filters.department
      : true;
    const matchesLocation = filters.location
      ? company.location === filters.location
      : true;
    const matchesRating = filters.rating
      ? company.rating >= parseFloat(filters.rating)
      : true;
    const matchesCategory = activeCategory
      ? company.industry === activeCategory
      : true;

    return (
      matchesSearch &&
      matchesIndustry &&
      matchesType &&
      matchesDepartment &&
      matchesLocation &&
      matchesRating &&
      matchesCategory
    );
  });

  // Group companies by type
  const groupedCompanies = {};
  companySections.forEach((section) => {
    groupedCompanies[section.type] = filteredCompanies.filter(
      (company) => company.type === section.type
    );
  });

  // Check if any group has companies
  const hasCompanies = Object.values(groupedCompanies).some(
    (group) => group.length > 0
  );

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      industry: "",
      type: "",
      department: "",
      location: "",
      rating: "",
    });
    setActiveCategory("");
  };

  // Handle category selection
  const handleCategoryClick = (category) => {
    setActiveCategory(activeCategory === category ? "" : category);
    setFilters((prev) => ({
      ...prev,
      industry: activeCategory === category ? "" : category,
    }));
  };

  const handleViewAllClick = (companyType) => {
    // This function would typically navigate to a dedicated page
    // or set filters to show only companies of that type.
    // For this example, we'll just set the type filter.
    setFilters((prev) => ({
      ...prev,
      type: companyType,
      industry: "", // Clear industry filter if a type is selected
      location: "",
      department: "",
      rating: "",
    }));
    setSearch(""); // Clear search when viewing a specific category
    setActiveCategory(""); // Clear active category as we're now filtering by type
  };

  const hasActiveFilters =
    Object.values(filters).some(Boolean) || activeCategory;

  const displayedCategories = showAllCategories
    ? industries
    : industries.slice(0, 12);

  return (
    <div className={styles.container}>
      {" "}
      {/* Header Section */}{" "}
      <motion.div
        className={styles.header}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <motion.h1 className={styles.title} variants={fadeInUp}>
          Discover Top Companies
        </motion.h1>{" "}
        <motion.p className={styles.subtitle} variants={fadeInUp}>
          Browse through our network of hiring companies and find your perfect
          career match{" "}
        </motion.p>{" "}
        <div className={styles.searchContainer}>
          <CompanySearch search={search} setSearch={setSearch} />{" "}
        </div>{" "}
      </motion.div>
      {/* Categories Section */}{" "}
      <motion.section
        className={styles.categories}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className={styles.categoriesInner}>
          <h3 className={styles.sectionTitle}> Company Categories </h3>{" "}
          <div className={styles.categoriesGrid}>
            {" "}
            {displayedCategories.map((industry) => {
              const baseColor =
                industryColors[industry] || "bg-gray-100 text-gray-800";
              const isActive = activeCategory === industry;
              const icon = industryIcons[industry] || "🏢";

              return (
                <motion.div
                  key={industry}
                  className={styles.categoryItem}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => handleCategoryClick(industry)}
                    className={`${styles.categoryButton} ${
                      isActive ? styles.categoryButtonActive : baseColor
                    }`}
                  >
                    <span className={styles.categoryIcon}> {icon} </span>{" "}
                    <span className={styles.categoryText}>
                      {" "}
                      {industry.split(" ")[0]}{" "}
                      {industry.includes(" ") && (
                        <span className={styles.categoryTextBlock}>
                          {" "}
                          {industry.split(" ").slice(1).join(" ")}{" "}
                        </span>
                      )}{" "}
                    </span>{" "}
                  </button>{" "}
                  {isActive && (
                    <motion.div
                      className={styles.categoryIndicator}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    />
                  )}{" "}
                </motion.div>
              );
            })}{" "}
          </div>{" "}
          <div className={styles.showMoreContainer}>
            <motion.button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className={styles.showMoreButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {" "}
              {showAllCategories ? "Show Less" : "Show All Industries"}{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`${styles.showMoreIcon} ${
                  showAllCategories ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>{" "}
            </motion.button>{" "}
          </div>{" "}
        </div>{" "}
      </motion.section>
      {/* Main Content Area */}{" "}
      <div className={styles.mainContent}>
        {" "}
        {/* Left Sidebar - Filters */}{" "}
        <motion.div
          className={styles.filters}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className={styles.filtersInner}
            whileHover={{
              y: -8,
              boxShadow: "0 15px 30px -10px rgba(59, 130, 246, 0.2)",
              transition: { type: "spring", stiffness: 300, damping: 10 },
            }}
          >
            <CompanyFilters
              filters={filters}
              setFilters={setFilters}
              companyTypes={companyTypes}
              industries={industries}
              departments={departments}
              locations={locations}
              onClear={clearFilters}
            />{" "}
          </motion.div>{" "}
        </motion.div>
        {/* Company Listings (Center Part) */}{" "}
        <div className={styles.companyList}>
          <motion.div
            className={styles.companyListHeader}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className={styles.resultsCount}>
              {" "}
              {filteredCompanies.length}{" "}
              {filteredCompanies.length === 1 ? "company" : "companies"}
              found
            </div>{" "}
            {hasActiveFilters && (
              <motion.button
                onClick={clearFilters}
                className={styles.clearFilters}
                whileHover={{ scale: 1.05 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.clearFiltersIcon}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Clear Filters{" "}
              </motion.button>
            )}{" "}
          </motion.div>
          <AnimatePresence mode="wait">
            {" "}
            {loading ? (
              <motion.div
                className={styles.loadingContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.loadingSpinner}></div>
                <p className={styles.loadingText}>Loading companies...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                className={styles.errorContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className={styles.errorIcon}>⚠️</div>
                <h3 className={styles.errorTitle}>Unable to load companies</h3>
                <p className={styles.errorText}>{error}</p>
                <motion.button
                  onClick={() => window.location.reload()}
                  className={styles.retryButton}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try Again
                </motion.button>
              </motion.div>
            ) : !hasCompanies ? (
              <motion.div
                className={styles.noResults}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.noResultsIcon}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>{" "}
                <h3 className={styles.noResultsTitle}> No companies found </h3>{" "}
                <p className={styles.noResultsText}>
                  Try adjusting your search or filter criteria{" "}
                </p>{" "}
                <motion.button
                  onClick={clearFilters}
                  className={styles.noResultsButton}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear All Filters{" "}
                </motion.button>{" "}
              </motion.div>
            ) : (
              <div className={styles.companySections}>
                {" "}
                {companySections.map((section) => {
                  const sectionCompanies = groupedCompanies[section.type];
                  if (!sectionCompanies.length) return null;

                  return (
                    <div key={section.type} className={styles.companySection}>
                      <motion.div
                        className={styles.sectionHeaderWithButton}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <h3 className={styles.sectionHeading}>
                          {" "}
                          {section.title}{" "}
                        </h3>{" "}
                        <motion.button
                          onClick={() => handleViewAllClick(section.type)}
                          className={styles.viewAllButton}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          View All{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={styles.viewAllIcon}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>{" "}
                        </motion.button>{" "}
                      </motion.div>{" "}
                      <motion.div
                        className={styles.companyGrid}
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <AnimatePresence>
                          {" "}
                          {sectionCompanies.map((company) => (
                            <motion.div
                              key={company.id}
                              variants={itemVariants}
                              layout
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 30,
                              }}
                              whileHover={{
                                scale: 1.02,
                                boxShadow:
                                  "0 10px 20px -5px rgba(59, 130, 246, 0.2)",
                              }}
                              className={styles.companyCardWrapper}
                            >
                              <CompanyCard company={company} />{" "}
                            </motion.div>
                          ))}{" "}
                        </AnimatePresence>{" "}
                      </motion.div>{" "}
                    </div>
                  );
                })}{" "}
              </div>
            )}{" "}
          </AnimatePresence>{" "}
        </div>
        {/* Right Sidebar - Ads */}{" "}
        <motion.div
          className={styles.ads}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className={styles.adsInner}>
            {" "}
            {ads.map((ad) => (
              <motion.div
                key={ad.id}
                className={`${styles.adCard} ${ad.bgColor.replace(
                  "200",
                  "100"
                )}`}
                whileHover={{
                  y: -7,
                  boxShadow: "0 15px 35px -10px rgba(59, 130, 246, 0.3)",
                  borderColor: "rgba(59, 130, 246, 0.3)",
                  transition: { type: "spring", stiffness: 400, damping: 15 },
                }}
              >
                <div className={styles.adContent}>
                  <motion.div
                    className={styles.adIcon}
                    whileHover={{
                      scale: 1.15,
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.6 },
                    }}
                  >
                    {" "}
                    {ad.icon}{" "}
                  </motion.div>{" "}
                  <div>
                    <h3 className={styles.adTitle}> {ad.title} </h3>{" "}
                    <p className={styles.adDescription}> {ad.description} </p>{" "}
                    <motion.a
                      href={ad.link}
                      className={styles.adButton}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        boxShadow: "0 5px 15px -3px rgba(59, 130, 246, 0.4)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {" "}
                      {ad.cta}{" "}
                    </motion.a>{" "}
                  </div>{" "}
                </div>{" "}
              </motion.div>
            ))}{" "}
          </div>{" "}
        </motion.div>{" "}
      </div>{" "}
    </div>
  );
}
