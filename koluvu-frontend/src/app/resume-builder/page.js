"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

// Loader
const Loader = () => (
  <div className="w-full h-full flex items-center justify-center py-12">
    <span className="loader">Loading...</span>
  </div>
);

// Dynamic Imports
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

  // Template chosen, resume id and title held in state (server-driven)
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [title, setTitle] = useState("Draft Resume");

  // Form data
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

  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
  const saveTimerRef = useRef(null);
  const isAutoSavingRef = useRef(false);
  const wsRef = useRef(null);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };
  const handleSummaryChange = (e) => setSummary(e.target.value);

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
      {
        degree: "",
        college: "",
        university: "",
        startDate: "",
        endDate: "",
        cgpa: "",
      },
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

  // Save handler (manual)
  const handleSave = async () => {
    try {
      isAutoSavingRef.current = true;
      setSaveStatus("saving");
      const payload = {
        title: title || "Draft Resume",
        template: selectedTemplate || null,
        status: "draft",
        personal_info: personalInfo,
        education_data: educations,
        experience_data: experiences,
        skills_data: skillCategories,
        projects_data: projects,
        certifications_data: certifications,
        languages_data: personalInfo.languages || [],
        custom_sections: {},
        color_scheme: { sidebar: sidebarColor },
        font_family: "Inter",
        font_size: fontSize,
        page_margins: {},
      };

      if (!resumeId) {
        const res = await fetch("/api/employee/resume-builder/resumes/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const txt = await res.text();
          console.error("Failed to create resume", res.status, txt);
          setSaveStatus("error");
          isAutoSavingRef.current = false;
          return;
        }
        const data = await res.json();
        setResumeId(data.id);
        setTitle(data.title || payload.title);
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 1500);
        isAutoSavingRef.current = false;
        return;
      }

      const res = await fetch(
        `/api/employee/resume-builder/resumes/${resumeId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const txt = await res.text();
        console.error("Failed to update resume", res.status, txt);
        setSaveStatus("error");
        isAutoSavingRef.current = false;
        return;
      }
      const data = await res.json();
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
      isAutoSavingRef.current = false;
    } catch (err) {
      console.error("Error saving resume", err);
      setSaveStatus("error");
      isAutoSavingRef.current = false;
    }
  };

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
  const [sidebarColor, setSidebarColor] = useState("#111827");
  const [fontSize, setFontSize] = useState(13);

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

  // Load or create resume once on mount, and open WS
  useEffect(() => {
    let ws;
    const loadOrCreateResume = async () => {
      try {
        const listRes = await fetch("/api/employee/resume-builder/resumes/");
        if (listRes.ok) {
          const list = await listRes.json();
          if (Array.isArray(list) && list.length > 0) {
            const r = list[0];
            setResumeId(r.id);
            setTitle(r.title || title);
            setPersonalInfo(r.personal_info || personalInfo);
            setEducations(r.education_data || educations);
            setExperiences(r.experience_data || experiences);
            setSkillCategories(r.skills_data || skillCategories);
            setProjects(r.projects_data || projects);
            setCertifications(r.certifications_data || certifications);
            setStrengths(
              (r.personal_info && r.personal_info.strengths) || strengths
            );
            return r.id;
          }
        }

        const createPayload = {
          title: title || "Draft Resume",
          template: selectedTemplate || null,
          status: "draft",
          personal_info: personalInfo,
          education_data: educations,
          experience_data: experiences,
          skills_data: skillCategories,
          projects_data: projects,
          certifications_data: certifications,
          languages_data: personalInfo.languages || [],
          custom_sections: {},
          color_scheme: { sidebar: sidebarColor },
          font_family: "Inter",
          font_size: fontSize,
          page_margins: {},
        };

        const createRes = await fetch("/api/employee/resume-builder/resumes/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createPayload),
        });

        if (createRes.ok) {
          const created = await createRes.json();
          setResumeId(created.id);
          setTitle(created.title || title);
          return created.id;
        }
      } catch (err) {
        console.error("Failed to load or create resume", err);
      }
      return null;
    };

    (async () => {
      const id = await loadOrCreateResume();
      if (id && typeof window !== "undefined") {
        try {
          const origin = window.location.origin.replace(/^http/, "ws");
          ws = new WebSocket(`${origin}/ws/resume/${id}/`);
          wsRef.current = ws;

          ws.addEventListener("open", () => {
            console.log("Resume WS connected", id);
          });

          ws.addEventListener("message", (ev) => {
            try {
              const msg = JSON.parse(ev.data);
              if (msg.type === "init" || msg.type === "update") {
                const remote = msg.data || {};
                if (remote.personal_info)
                  setPersonalInfo((prev) => ({
                    ...prev,
                    ...remote.personal_info,
                  }));
                if (remote.education_data) setEducations(remote.education_data);
                if (remote.experience_data)
                  setExperiences(remote.experience_data);
                if (remote.skills_data)
                  setSkillCategories(remote.skills_data || []);
                if (remote.projects_data)
                  setProjects(remote.projects_data || []);
                if (remote.certifications_data)
                  setCertifications(remote.certifications_data || []);
                if (remote.personal_info && remote.personal_info.strengths) {
                  setStrengths(remote.personal_info.strengths);
                }
              }
            } catch (e) {
              console.error("Invalid WS message", e);
            }
          });

          ws.addEventListener("close", () => console.log("Resume WS closed"));
        } catch (e) {
          console.error("Failed to open resume WS", e);
        }
      }
    })();

    return () => {
      if (ws) ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced auto-save
  useEffect(() => {
    if (isAutoSavingRef.current) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      (async () => {
        isAutoSavingRef.current = true;
        setSaveStatus("saving");
        try {
          // Auto-save uses same payload as manual save
          const payload = {
            title: title || "Draft Resume",
            template: selectedTemplate || null,
            status: "draft",
            personal_info: personalInfo,
            education_data: educations,
            experience_data: experiences,
            skills_data: skillCategories,
            projects_data: projects,
            certifications_data: certifications,
            languages_data: personalInfo.languages || [],
            custom_sections: {},
            color_scheme: { sidebar: sidebarColor },
            font_family: "Inter",
            font_size: fontSize,
            page_margins: {},
          };

          if (!resumeId) {
            const res = await fetch("/api/employee/resume-builder/resumes/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to create resume");
            const data = await res.json();
            setResumeId(data.id);
            // notify WS
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({ type: "update", data: data })
              );
            }
          } else {
            const res = await fetch(
              `/api/employee/resume-builder/resumes/${resumeId}/`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }
            );
            if (!res.ok) throw new Error("Failed to update resume");
            const data = await res.json();
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({ type: "update", data: data })
              );
            }
          }

          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 1500);
        } catch (e) {
          console.error("Auto-save error", e);
          setSaveStatus("error");
        } finally {
          isAutoSavingRef.current = false;
        }
      })();
    }, 2000);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
    // watch the core parts of consolidatedData
  }, [
    personalInfo,
    educations,
    experiences,
    skillCategories,
    projects,
    certifications,
    strengths,
  ]);

  const options = [
    {
      type: "fresher",
      title: "I’m a Fresher",
      description:
        "Build a resume tailored for students or recent graduates with no work experience.",
      icon: "🎓",
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
              >
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
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

                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                    {opt.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-8 leading-relaxed px-4">
                    {opt.description}
                  </p>

                  <button
                    className="px-8 py-3 text-sm font-semibold rounded-full transition-all duration-300 text-gray-700 group-hover:text-blue-600"
                    style={{
                      background: "#e0e5ec",
                      boxShadow: "6px 6px 12px #a8adb5, -6px -6px 12px #ffffff",
                    }}
                  >
                    Get Started →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full">
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
              Professional Resume Builder
            </h1>
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

          {activeTab === "builder" && (
            <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-0">
              <aside className="bg-white border-r border-gray-200 p-0 lg:sticky lg:top-0 h-screen lg:h-auto lg:min-h-screen">
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

              <section className="w-full bg-gray-50">
                <div className="w-full bg-white border-b border-gray-200 p-4 sm:p-6">
                  <Suspense fallback={<Loader />}>
                    {activeSection === "section-personal" && (
                      <PersonalInfoSection
                        personalInfo={personalInfo}
                        onInputChange={handlePersonalChange}
                      />
                    )}

                    {activeSection === "section-objective" && (
                      <CareerObjectiveSection
                        formData={{ summary }}
                        handleInputChange={handleSummaryChange}
                      />
                    )}

                    {activeSection === "section-skills" && (
                      <SkillsSection
                        formData={{ skillCategories }}
                        handleInputChange={handleSkillCategoryChange}
                        handleAddSkillCategory={handleAddSkillCategory}
                        handleRemoveSkillCategory={handleRemoveSkillCategory}
                      />
                    )}

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

                    {activeSection === "section-strengths" && (
                      <StrengthsSection
                        formData={{ strengths }}
                        handleInputChange={handleStrengthsChange}
                      />
                    )}

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <FormActions
                        setActiveTab={setActiveTab}
                        activeTab={activeTab}
                        onSave={handleSave}
                        saveStatus={saveStatus}
                      />
                    </div>
                  </Suspense>
                </div>
              </section>
            </div>
          )}

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

      <Suspense fallback={<Loader />}>
        <SavedDraftsModal />
      </Suspense>
    </main>
  );
};

export default ResumeBuilder;
