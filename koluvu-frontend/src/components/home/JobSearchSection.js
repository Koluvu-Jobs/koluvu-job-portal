// src/components/home/JobSearchSection.js

"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import CompanySuggestions from "@/components/search/CompanySuggestions";
import { Briefcase, Users, FileText, Building2 } from "lucide-react";

export default function JobSearchSection() {
  const router = useRouter();
  const searchRef = useRef(null);
  const tagsRef = useRef(null);
  const statsRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isExtraSmall, setIsExtraSmall] = useState(false);
  const [searchValues, setSearchValues] = useState({
    jobCategory: "",
    experience: "",
    companyType: "",
    location: "",
  });
  const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);

  const popularTags = [
    "Software Engineer",
    "AI Specialist",
    "Data Scientist",
    "Cybersecurity",
    "Remote Jobs",
    "Quantum Computing",
  ];

  const jobCategories = [
    "Artificial Intelligence",
    "Blockchain",
    "Cybersecurity",
    "Cloud Computing",
    "Data Science",
    "Engineering",
    "Design",
    "DevOps",
    "Quantum Computing",
    "Robotics",
  ];

  const experienceLevels = [
    "Entry Level",
    "Junior (0-3 years)",
    "Mid-Level (3-7 years)",
    "Senior (7+ years)",
    "Lead/Architect",
    "C-Level",
  ];

  const companyTypes = [
    "Tech Giant",
    "AI Startup",
    "FinTech",
    "HealthTech",
    "EdTech",
    "SpaceTech",
    "GreenTech",
    "Gaming",
    "Consulting",
    "Research Lab",
  ];

  const locations = [
    "San Francisco",
    "New York",
    "Bangalore",
    "Singapore",
    "London",
    "Remote",
    "Tokyo",
    "Berlin",
    "Dubai",
    "Global",
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsExtraSmall(window.innerWidth <= 370);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    // Trigger animations on mount
    setTimeout(() => setIsVisible(true), 100);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleTagClick = (tag) => {
    setSearchValues((prev) => ({ ...prev, jobCategory: tag }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSuggestionClick = (field, value) => {
    setSearchValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCompanySelect = (company) => {
    setSearchValues((prev) => ({ ...prev, companyType: company.name }));
    setShowCompanySuggestions(false);
  };

  const handleCompanyInputFocus = () => {
    setShowCompanySuggestions(true);
  };

  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setSearchValues((prev) => ({ ...prev, [name]: value }));
    if (name === "companyType") {
      setShowCompanySuggestions(value.length >= 2);
    }
  };

  const filterSuggestions = (array, searchTerm) => {
    return array.filter(
      (item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase()) &&
        item.toLowerCase() !== searchTerm.toLowerCase()
    );
  };

  const shouldShowSuggestions = (field, value) => {
    return (
      value &&
      filterSuggestions(
        field === "jobCategory"
          ? jobCategories
          : field === "experience"
          ? experienceLevels
          : field === "companyType"
          ? companyTypes
          : locations,
        value
      ).length > 0
    );
  };

  const containerStyle = {
    minHeight: "100vh",
    position: "relative",
    background: "#F8FAFC",
    overflow: "hidden",
  };

  const backgroundOverlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(248, 250, 252, 0.5) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(226, 232, 240, 0.3) 0%, transparent 50%)
    `,
    animation: "float 6s ease-in-out infinite",
  };

  const contentWrapperStyle = {
    position: "relative",
    zIndex: 2,
    padding: isExtraSmall
      ? "1.5rem 0.75rem"
      : isMobile
      ? "2rem 1rem"
      : "4rem 2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const textContentStyle = {
    textAlign: "center",
    marginBottom: "4rem",
    transform: isVisible ? "translateY(0)" : "translateY(50px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const quoteStyle = {
    fontSize: isExtraSmall ? "1.5rem" : isMobile ? "2rem" : "3.5rem",
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: "1.5rem",
    lineHeight: "1.2",
  };

  const subtitleStyle = {
    fontSize: isExtraSmall ? "1rem" : isMobile ? "1.1rem" : "1.3rem",
    color: "#334155",
    fontWeight: "400",
    maxWidth: "600px",
    margin: "0 auto",
    lineHeight: "1.6",
  };

  const searchContainerStyle = {
    transform: isVisible
      ? "translateY(0) scale(1)"
      : "translateY(30px) scale(0.95)",
    opacity: isVisible ? 1 : 0,
    transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
    marginBottom: "3rem",
  };

  const searchFormStyle = {
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "20px",
    padding: isExtraSmall
      ? "1.5rem 1rem"
      : isMobile
      ? "2rem 1.5rem"
      : "3rem 2.5rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  };

  const inputGroupStyle = {
    display: "grid",
    gridTemplateColumns: isExtraSmall
      ? "1fr"
      : isMobile
      ? "1fr 1fr"
      : "repeat(4, 1fr)",
    gap: isExtraSmall ? "1rem" : "1.5rem",
    marginBottom: "2rem",
  };

  const inputWrapperStyle = {
    position: "relative",
  };

  const inputStyle = {
    width: "100%",
    padding: isExtraSmall ? "0.4rem 0.8rem" : "0.5rem 1rem",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "6px",
    fontSize: isExtraSmall ? "0.75rem" : "0.85rem",
    fontWeight: "500",
    color: "#0F172A",
    outline: "none",
    transition: "all 0.3s ease",
  };

  const suggestionsStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    marginTop: "0.5rem",
    zIndex: 10,
    maxHeight: "200px",
    overflowY: "auto",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    animation: "slideDown 0.3s ease-out",
  };

  const suggestionItemStyle = {
    padding: isExtraSmall ? "0.625rem 0.875rem" : "0.75rem 1rem",
    color: "#0F172A",
    cursor: "pointer",
    transition: "all 0.2s ease",
    borderBottom: "1px solid #E2E8F0",
    fontSize: isExtraSmall ? "0.875rem" : "1rem",
  };

  const submitButtonStyle = {
    width: isMobile ? "100%" : "auto",
    padding: isExtraSmall ? "0.875rem 2rem" : "1rem 3rem",
    background: "#F97316",
    border: "none",
    borderRadius: "50px",
    color: "#ffffff",
    fontSize: isExtraSmall ? "1rem" : "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(249, 115, 22, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "1px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    margin: isMobile ? "0" : "0 auto",
  };

  const tagsContainerStyle = {
    textAlign: "center",
    marginBottom: "4rem",
    transform: isVisible ? "translateY(0)" : "translateY(30px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s",
  };

  const tagsHeaderStyle = {
    fontSize: isExtraSmall ? "1.25rem" : "1.5rem",
    color: "#0F172A",
    marginBottom: "1.5rem",
    fontWeight: "600",
  };

  const tagsFlexStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: isExtraSmall ? "0.75rem" : "1rem",
    justifyContent: "center",
  };

  const tagStyle = (index) => ({
    padding: isExtraSmall ? "0.625rem 1.25rem" : "0.75rem 1.5rem",
    background: "#FFFFFF",
    border: "2px solid #F97316",
    borderRadius: "25px",
    color: "#0F172A",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontSize: isExtraSmall ? "0.825rem" : "0.9rem",
    fontWeight: "500",
    transform: isVisible
      ? "translateY(0) rotateX(0)"
      : "translateY(20px) rotateX(45deg)",
    opacity: isVisible ? 1 : 0,
    transitionDelay: `${0.7 + index * 0.1}s`,
  });

  const statsContainerStyle = {
    transform: isVisible ? "translateY(0)" : "translateY(50px)",
    opacity: isVisible ? 1 : 0,
    transition: "all 1s cubic-bezier(0.4, 0, 0.2, 1) 0.8s",
  };

  // Updated responsive grid for stats
  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: isExtraSmall
      ? "1fr"
      : isMobile
      ? "1fr 1fr"
      : "repeat(4, 1fr)",
    gap: isExtraSmall ? "1rem" : "1.5rem",
  };

  const statCardStyle = (index) => ({
    background: "#FFFFFF",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: isExtraSmall ? "1.5rem 1rem" : "2rem 1.5rem",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    transform: isVisible
      ? "translateY(0) scale(1)"
      : "translateY(30px) scale(0.9)",
    opacity: isVisible ? 1 : 0,
    transitionDelay: `${1 + index * 0.1}s`,
  });

  const statIconStyle = {
    fontSize: isExtraSmall ? "2rem" : "2.5rem",
    marginBottom: "1rem",
  };

  const statValueStyle = {
    fontSize: isExtraSmall ? "1.5rem" : "2rem",
    fontWeight: "700",
    color: "#F97316",
    marginBottom: "0.5rem",
  };

  const statLabelStyle = {
    fontSize: isExtraSmall ? "0.875rem" : "1rem",
    color: "#64748B",
    fontWeight: "500",
  };

  return (
    <>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(1deg); }
            66% { transform: translateY(-10px) rotate(-1deg); }
          }

          @keyframes slideDown {
            0% { opacity: 0; transform: translateY(-10px); }
            100% { opacity: 1; transform: translateY(0); }
          }

          /* Input styles */
          .search-input::placeholder {
            color: #64748B !important;
            opacity: 1;
          }

          .search-input:focus {
            border-color: #F97316 !important;
            box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1) !important;
            background: #FFFFFF !important;
          }

          .search-input:hover {
            border-color: #CBD5E1 !important;
          }

          .submit-button:hover {
            background: #EA580C !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4) !important;
          }

          .tag-item:hover {
            background: #F97316 !important;
            color: #FFFFFF !important;
            transform: translateY(-2px) scale(1.05) !important;
            box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3) !important;
          }

          .stat-card:hover {
            transform: translateY(-4px) scale(1.02) !important;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
            border-color: #F97316 !important;
          }

          .suggestion-item:hover {
            background: #F8FAFC !important;
          }

          .suggestion-item:last-child {
            border-bottom: none !important;
          }

          /* Extra small screen optimizations */
          @media (max-width: 370px) {
            .search-input {
              font-size: 0.875rem !important;
            }
            
            .tag-item {
              font-size: 0.8rem !important;
              padding: 0.5rem 1rem !important;
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        <div style={backgroundOverlayStyle}></div>

        <div style={contentWrapperStyle}>
          <div style={textContentStyle}>
            <blockquote style={quoteStyle}>
              &ldquo;Because Everyone Deserves the Right People.&rdquo;
            </blockquote>
            <p style={subtitleStyle}>
              Koluvu - Your No.1 Platform for Jobs, Hiring & Career Success!
            </p>
          </div>

          <div ref={searchRef} style={searchContainerStyle}>
            <div style={searchFormStyle}>
              <div style={inputGroupStyle}>
                <div style={inputWrapperStyle}>
                  <input
                    type="text"
                    name="jobCategory"
                    value={searchValues.jobCategory}
                    onChange={handleInputChange}
                    placeholder="Job Category"
                    className="search-input"
                    style={inputStyle}
                  />
                  {shouldShowSuggestions(
                    "jobCategory",
                    searchValues.jobCategory
                  ) && (
                    <div style={suggestionsStyle}>
                      {filterSuggestions(
                        jobCategories,
                        searchValues.jobCategory
                      ).map((category, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          style={suggestionItemStyle}
                          onClick={() =>
                            handleSuggestionClick("jobCategory", category)
                          }
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={inputWrapperStyle}>
                  <input
                    type="text"
                    name="experience"
                    value={searchValues.experience}
                    onChange={handleInputChange}
                    placeholder="Experience"
                    className="search-input"
                    style={inputStyle}
                  />
                  {shouldShowSuggestions(
                    "experience",
                    searchValues.experience
                  ) && (
                    <div style={suggestionsStyle}>
                      {filterSuggestions(
                        experienceLevels,
                        searchValues.experience
                      ).map((level, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          style={suggestionItemStyle}
                          onClick={() =>
                            handleSuggestionClick("experience", level)
                          }
                        >
                          {level}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={inputWrapperStyle}>
                  <input
                    type="text"
                    name="companyType"
                    value={searchValues.companyType}
                    onChange={handleCompanyInputChange}
                    onFocus={handleCompanyInputFocus}
                    placeholder="Company Name"
                    className="search-input"
                    style={inputStyle}
                  />
                  <CompanySuggestions
                    query={searchValues.companyType}
                    onSelect={handleCompanySelect}
                    isVisible={showCompanySuggestions}
                    onClose={() => setShowCompanySuggestions(false)}
                  />
                  {shouldShowSuggestions(
                    "companyType",
                    searchValues.companyType
                  ) && (
                    <div style={suggestionsStyle}>
                      {filterSuggestions(
                        companyTypes,
                        searchValues.companyType
                      ).map((type, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          style={suggestionItemStyle}
                          onClick={() =>
                            handleSuggestionClick("companyType", type)
                          }
                        >
                          {type}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={inputWrapperStyle}>
                  <input
                    type="text"
                    name="location"
                    value={searchValues.location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    className="search-input"
                    style={inputStyle}
                  />
                  {shouldShowSuggestions("location", searchValues.location) && (
                    <div style={suggestionsStyle}>
                      {filterSuggestions(locations, searchValues.location).map(
                        (loc, index) => (
                          <div
                            key={index}
                            className="suggestion-item"
                            style={suggestionItemStyle}
                            onClick={() =>
                              handleSuggestionClick("location", loc)
                            }
                          >
                            {loc}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="submit-button"
                style={submitButtonStyle}
                onClick={() => router.push("/jobs")}
              >
                Find Jobs 🚀
              </button>
            </div>
          </div>

          <div style={tagsContainerStyle}>
            <h3 style={tagsHeaderStyle}>Trending Careers:</h3>
            <div ref={tagsRef} style={tagsFlexStyle}>
              {popularTags.map((tag, index) => (
                <span
                  key={index}
                  onClick={() => handleTagClick(tag)}
                  className="tag-item"
                  style={tagStyle(index)}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div ref={statsRef} style={statsContainerStyle}>
            <div style={statsGridStyle}>
              {[
                { icon: <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />, value: "10,000+", label: "Jobs" },
                { icon: <Users className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />, value: "1M+", label: "Professionals" },
                { icon: <FileText className="w-8 h-8 md:w-10 md:h-10 text-green-500" />, value: "50,000+", label: "Resumes" },
                { icon: <Building2 className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />, value: "1,000+", label: "Companies" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="stat-card"
                  style={statCardStyle(index)}
                >
                  <div className="stat-icon" style={statIconStyle}>
                    {stat.icon}
                  </div>
                  <div>
                    <p style={statValueStyle}>{stat.value}</p>
                    <p style={statLabelStyle}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
