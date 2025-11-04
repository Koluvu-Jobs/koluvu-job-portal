"use client";

import { useState, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

// Loader
const Loader = () => (
  <div className="w-full h-full flex items-center justify-center py-12">
    <span className="loader">Loading...</span>
  </div>
);

// ✅ Dynamic Imports
const PreviewSection = dynamic(() => import("./components/PreviewSection"), {
  ssr: false,
  loading: Loader,
});
const TemplateSection = dynamic(() => import("./components/TemplateSection"), {
  ssr: false,
  loading: Loader,
});
const PersonalInfoSection = dynamic(
  () => import("./components/PersonalInfoSection"),
  { ssr: false, loading: Loader }
);
const CareerObjectiveSection = dynamic(
  () => import("./components/CareerObjectiveSection"),
  { ssr: false, loading: Loader }
);
const SkillsSection = dynamic(() => import("./components/SkillsSection"), {
  ssr: false,
  loading: Loader,
});
const EducationSection = dynamic(
  () => import("./components/EducationSection"),
  { ssr: false, loading: Loader }
);
const ExperienceSection = dynamic(
  () => import("./components/ExperienceSection"),
  { ssr: false, loading: Loader }
);
const FormActions = dynamic(() => import("./components/FormActions"), {
  ssr: false,
  loading: Loader,
});
const ProjectSection = dynamic(() => import("./components/ProjectSection"), {
  ssr: false,
  loading: Loader,
});
const InternshipSection = dynamic(
  () => import("./components/InternshipSection"),
  {
    ssr: false,
    loading: Loader,
  }
);
const CertificationSection = dynamic(
  () => import("./components/CertificationSection"),
  {
    ssr: false,
    loading: Loader,
  }
);
const StrengthsSection = dynamic(
  () => import("./components/StrengthsSection"),
  {
    ssr: false,
    loading: Loader,
  }
);
const SavedDraftsModal = dynamic(
  () => import("./components/SavedDraftsModal"),
  { ssr: false, loading: Loader }
);

const ResumeBuilder = () => {
  const searchParams = useSearchParams();
  const resumeType = searchParams.get("type");

  const [activeTab, setActiveTab] = useState("builder");
  const [activeSection, setActiveSection] = useState("section-personal");
  const previewRef = useRef(null);

  // Selected template (shared with TemplateSection)
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("resumeBuilder.selectedTemplate") || null;
    }
    return null;
  });

  // Simple consolidated form data for backend
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    designation: "",
    address: "",
    languages: "",
  });
  const [summary, setSummary] = useState("");
  const [skillCategories, setSkillCategories] = useState([
    {
      category: "",
      skills: "",
    },
  ]);
  const [educations, setEducations] = useState([
    {
      degree: "",
      college: "",
      university: "",
      endDate: "",
    },
  ]);
  const [experiences, setExperiences] = useState([
    {
      designation: "",
      companyName: "",
      startDate: "",
      endDate: "",
      responsibilities: "",
    },
  ]);

  // Additional state for fresher resume components
  const [projects, setProjects] = useState([
    {
      title: "",
      description: "",
    },
  ]);
  const [internships, setInternships] = useState([
    {
      position: "",
      company: "",
      duration: "",
      description: "",
    },
  ]);
  const [certifications, setCertifications] = useState([
    {
      name: "",
      issuer: "",
      date: "",
    },
  ]);
  const [strengths, setStrengths] = useState("");

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };
  const handleSummaryChange = (e) => setSummary(e.target.value);

  // Skill category handlers
  const handleSkillCategoryChange = (index, field, value) => {
    setSkillCategories((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };
  const handleAddSkillCategory = () =>
    setSkillCategories((prev) => [...prev, { category: "", skills: "" }]);
  const handleRemoveSkillCategory = (index) =>
    setSkillCategories((prev) => prev.filter((_, i) => i !== index));

  const handleArrayChange = (index, field, value, key) => {
    if (key === "educations") {
      setEducations((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    } else if (key === "experiences") {
      setExperiences((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    } else if (key === "projects") {
      setProjects((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    } else if (key === "internships") {
      setInternships((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    } else if (key === "certifications") {
      setCertifications((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    }
  };
  const handleAddEducation = () =>
    setEducations((prev) => [
      ...prev,
      { degree: "", college: "", university: "", startDate: "", endDate: "", cgpa: "" },
    ]);
  const handleRemoveEducation = (index) =>
    setEducations((prev) => prev.filter((_, i) => i !== index));
  const handleAddExperience = () =>
    setExperiences((prev) => [
      ...prev,
      {
        designation: "",
        companyName: "",
        startDate: "",
        endDate: "",
        responsibilities: "",
      },
    ]);
  const handleRemoveExperience = (index) =>
    setExperiences((prev) => prev.filter((_, i) => i !== index));

  // Handler functions for additional fresher resume components
  const handleAddProject = () =>
    setProjects((prev) => [...prev, { title: "", description: "" }]);
  const handleRemoveProject = (index) =>
    setProjects((prev) => prev.filter((_, i) => i !== index));

  const handleAddInternship = () =>
    setInternships((prev) => [
      ...prev,
      { position: "", company: "", duration: "", description: "" },
    ]);
  const handleRemoveInternship = (index) =>
    setInternships((prev) => prev.filter((_, i) => i !== index));

  const handleAddCertification = () =>
    setCertifications((prev) => [...prev, { name: "", issuer: "", date: "" }]);
  const handleRemoveCertification = (index) =>
    setCertifications((prev) => prev.filter((_, i) => i !== index));

  const handleStrengthsChange = (e) => setStrengths(e.target.value);

  // New state for customization features
  const [sectionOrder, setSectionOrder] = useState([
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "internships",
    "certifications",
    "strengths",
  ]);
  const [sidebarSectionOrder, setSidebarSectionOrder] = useState([
    "contact",
    "skills",
    "languages",
    "strengths",
    "certifications",
  ]);
  const [sidebarColor, setSidebarColor] = useState("#111827"); // default gray-900
  const [fontSize, setFontSize] = useState(13); // default font size in px

  const consolidatedData = {
    personal: personalInfo,
    summary,
    skillCategories,
    educations,
    experiences,
    projects,
    internships,
    certifications,
    strengths,
  };

  // ✅ Define options here
  const options = [
    {
      type: "fresher",
      title: "I’m a Fresher",
      description:
        "Build a resume tailored for students or recent graduates with no work experience.",
      icon: "🎓",
      // cream theme
      color: "bg-gray-200 hover:bg-amber-100 border-black-1000",
    },
    {
      type: "experienced",
      title: "I’m Experienced",
      description:
        "Create a professional resume to showcase your career journey, skills, and achievements.",
      icon: "💼",
      color: "bg-gray-200 hover:bg-blue-200 border-black-1000",
    },
  ];

  const navItems = [
    { id: "section-personal", label: "Personal Info" },
    { id: "section-objective", label: "Objective" },
    { id: "section-skills", label: "Skills" },
    ...(resumeType === "experienced"
      ? [{ id: "section-experience", label: "Experience" }]
      : []),
    { id: "section-education", label: "Education" },
    { id: "section-projects", label: "Projects" },
    { id: "section-internships", label: "Internships" },
    { id: "section-certifications", label: "Certifications" },
    { id: "section-strengths", label: "Strengths" },
  ];

  const handleSectionClick = (id) => {
    setActiveSection(id);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#e0e5ec] to-[#f5f7fa] p-0">
      {!resumeType ? (
        // STEP 1: Resume Type Selection - Neumorphic Style
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-6 py-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-gray-800 tracking-tight">
            Choose Your Resume Type
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-md">
            Select the option that best describes your professional journey
          </p>

          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center w-full max-w-4xl">
            {options.map((opt) => (
              <div
                key={opt.type}
                onClick={() => (window.location.href = `?type=${opt.type}`)}
                className="cursor-pointer group relative w-full sm:w-80 h-96 rounded-3xl transition-all duration-500 ease-out hover:scale-105"
                style={{
                  background: "#e0e5ec",
                  boxShadow:
                    opt.type === "fresher"
                      ? "12px 12px 24px #a8adb5, -12px -12px 24px #ffffff"
                      : "12px 12px 24px #a8adb5, -12px -12px 24px #ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "inset 8px 8px 16px #a8adb5, inset -8px -8px 16px #ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "12px 12px 24px #a8adb5, -12px -12px 24px #ffffff";
                }}
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  {/* Icon Container */}
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                    style={{
                      background: "#e0e5ec",
                      boxShadow:
                        "inset 6px 6px 12px #a8adb5, inset -6px -6px 12px #ffffff",
                    }}
                  >
                    <span className="text-5xl">{opt.icon}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {opt.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-8 leading-relaxed px-4">
                    {opt.description}
                  </p>

                  {/* Button */}
                  <button
                    className="px-8 py-3 text-sm font-semibold rounded-full transition-all duration-300 text-gray-700 group-hover:text-blue-600"
                    style={{
                      background: "#e0e5ec",
                      boxShadow: "6px 6px 12px #a8adb5, -6px -6px 12px #ffffff",
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.boxShadow =
                        "inset 4px 4px 8px #a8adb5, inset -4px -4px 8px #ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      e.currentTarget.style.boxShadow =
                        "6px 6px 12px #a8adb5, -6px -6px 12px #ffffff";
                    }}
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <style jsx>{`
            @keyframes float {
              0%,
              100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-10px);
              }
            }
          `}</style>
        </div>
      ) : (
        <div className="w-full">
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
              Professional Resume Builder
            </h1>

            {/* Tabs (always visible) */}
            <div className="flex justify-start gap-2">
              <button
                className={`px-4 py-2 text-sm rounded-md ${
                  activeTab === "builder"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setActiveTab("builder")}
              >
                Builder
              </button>
              <button
                className={`px-4 py-2 text-sm rounded-md ${
                  activeTab === "templates"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setActiveTab("templates")}
              >
                Templates
              </button>
              <button
                className={`px-4 py-2 text-sm rounded-md ${
                  activeTab === "preview"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
                onClick={() => setActiveTab("preview")}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Builder: Sidebar Layout (no preview) */}
          {activeTab === "builder" && (
            <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-0">
              {/* Sidebar */}
              <aside className="bg-white border-r border-gray-200 p-0 lg:sticky lg:top-0 h-screen lg:h-auto lg:min-h-screen">
                {/* Section Nav */}
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-3 font-semibold">
                    Builder Sections
                  </p>
                  <nav className="space-y-0.5">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSectionClick(item.id)}
                        className={`w-full text-left text-sm px-4 py-3 rounded-lg transition ${
                          activeSection === item.id
                            ? "bg-blue-600 text-white font-medium shadow-sm"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main content: Builder */}
              <section className="w-full bg-gray-50">
                <div className="w-full bg-white border-b border-gray-200 p-4 sm:p-6">
                  <Suspense fallback={<Loader />}>
                    {/* Personal Info Section */}
                    {activeSection === "section-personal" && (
                      <PersonalInfoSection
                        personalInfo={personalInfo}
                        onInputChange={handlePersonalChange}
                      />
                    )}

                    {/* Career Objective Section */}
                    {activeSection === "section-objective" && (
                      <CareerObjectiveSection
                        formData={{ summary }}
                        handleInputChange={handleSummaryChange}
                      />
                    )}

                    {/* Skills Section */}
                    {activeSection === "section-skills" && (
                      <SkillsSection
                        formData={{ skillCategories }}
                        handleInputChange={handleSkillCategoryChange}
                        handleAddSkillCategory={handleAddSkillCategory}
                        handleRemoveSkillCategory={handleRemoveSkillCategory}
                      />
                    )}

                    {/* Experience Section */}
                    {activeSection === "section-experience" &&
                      resumeType === "experienced" && (
                        <ExperienceSection
                          formData={{ experiences }}
                          handleInputChange={(i, f, v) =>
                            handleArrayChange(i, f, v, "experiences")
                          }
                          handleAddExperience={handleAddExperience}
                          handleRemoveExperience={handleRemoveExperience}
                        />
                      )}

                    {/* Education Section */}
                    {activeSection === "section-education" && (
                      <EducationSection
                        formData={{ educations }}
                        handleInputChange={(i, f, v) =>
                          handleArrayChange(i, f, v, "educations")
                        }
                        handleAddEducation={handleAddEducation}
                        handleRemoveEducation={handleRemoveEducation}
                      />
                    )}

                    {/* Projects Section */}
                    {activeSection === "section-projects" && (
                      <ProjectSection
                        formData={{ projects }}
                        handleInputChange={(i, f, v) =>
                          handleArrayChange(i, f, v, "projects")
                        }
                        handleAddProject={handleAddProject}
                        handleRemoveProject={handleRemoveProject}
                      />
                    )}

                    {/* Internships Section */}
                    {activeSection === "section-internships" && (
                      <InternshipSection
                        formData={{ internships }}
                        handleInputChange={(i, f, v) =>
                          handleArrayChange(i, f, v, "internships")
                        }
                        handleAddInternship={handleAddInternship}
                        handleRemoveInternship={handleRemoveInternship}
                      />
                    )}

                    {/* Certifications Section */}
                    {activeSection === "section-certifications" && (
                      <CertificationSection
                        formData={{ certifications }}
                        handleInputChange={(i, f, v) =>
                          handleArrayChange(i, f, v, "certifications")
                        }
                        handleAddCertification={handleAddCertification}
                        handleRemoveCertification={handleRemoveCertification}
                      />
                    )}

                    {/* Strengths Section */}
                    {activeSection === "section-strengths" && (
                      <StrengthsSection
                        formData={{ strengths }}
                        handleInputChange={handleStrengthsChange}
                      />
                    )}

                    {/* Form Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <FormActions
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                      />
                    </div>
                  </Suspense>
                </div>
              </section>
            </div>
          )}

          {/* Templates: Full-width (no sidebar) */}
          {activeTab === "templates" && (
            <div className="mt-4">
              <Suspense fallback={<Loader />}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <TemplateSection
                    selectedTemplate={selectedTemplate}
                    setSelectedTemplate={setSelectedTemplate}
                  />
                </div>
              </Suspense>
            </div>
          )}

          {/* Preview: Full-width (no sidebar) */}
          {activeTab === "preview" && (
            <div className="mt-4">
              <Suspense fallback={<Loader />}>
                <PreviewSection
                  formData={consolidatedData}
                  selectedTemplate={selectedTemplate}
                  resumeType={resumeType || "fresher"}
                  onEdit={() => setActiveTab("builder")}
                  sectionOrder={sectionOrder}
                  setSectionOrder={setSectionOrder}
                  sidebarSectionOrder={sidebarSectionOrder}
                  setSidebarSectionOrder={setSidebarSectionOrder}
                  sidebarColor={sidebarColor}
                  setSidebarColor={setSidebarColor}
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                />
              </Suspense>
            </div>
          )}
        </div>
      )}

      {/* SAVED DRAFTS */}
      <Suspense fallback={<Loader />}>
        <SavedDraftsModal />
      </Suspense>
    </main>
  );
};

export default ResumeBuilder;
