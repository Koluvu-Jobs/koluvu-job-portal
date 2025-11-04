import React from "react";

const TemplateSamira = ({
  formData = {},
  sectionOrder = [
    "summary",
    "experience",
    "education",
    "skills",
    "projects",
    "internships",
    "certifications",
    "strengths",
  ],
  sidebarSectionOrder = [
    "contact",
    "skills",
    "languages",
    "strengths",
    "certifications",
  ],
  sidebarColor = "#111827",
  fontSize = 13,
}) => {
  const {
    personal = {},
    summary = "",
    skills = "",
    educations = [],
    experiences = [],
    projects = [],
    internships = [],
    certifications = [],
    strengths = "",
  } = formData;

  // Helper to render a section key for main or sidebar
  const renderSection = (key, where) => {
    const isMain = where === "main";
    switch (key) {
      case "summary":
        return (
          summary && (
            <div>
              <h2 className="text-lg font-semibold border-b-2 border-gray-800 mb-2 pb-1" style={{ fontSize: `${fontSize + 2}px` }}>Profile Summary</h2>
              <p className="leading-relaxed" style={{ fontSize: `${fontSize}px`, wordWrap: "break-word", whiteSpace: "pre-wrap", textAlign: "justify" }}>{summary}</p>
            </div>
          )
        );
      case "experience":
        return (
          experiences.length > 0 && experiences[0].designation && (
            <div>
              <h2 className="text-lg font-semibold border-b-2 border-gray-800 mb-2 pb-1" style={{ fontSize: `${fontSize + 2}px` }}>Work Experience</h2>
              {experiences.map((exp, idx) => (
                <div key={idx} className="mb-3">
                  <p className="font-semibold" style={{ fontSize: `${fontSize}px`, wordWrap: "break-word" }}>
                    {exp.designation} {exp.startDate && exp.endDate ? `| ${exp.startDate} - ${exp.endDate}` : ""}
                  </p>
                  {exp.companyName && (
                    <p className="text-gray-700 mb-1" style={{ fontSize: `${fontSize}px`, wordWrap: "break-word" }}>{exp.companyName}</p>
                  )}
                  {exp.responsibilities && (
                    <p className="text-gray-600 leading-relaxed" style={{ fontSize: `${fontSize}px`, wordWrap: "break-word", textAlign: "justify" }}>{exp.responsibilities}</p>
                  )}
                </div>
              ))}
            </div>
          )
        );
      case "education":
        return (
          educations.length > 0 && educations[0].degree && (
            <div>
              <h2 className="text-lg font-semibold border-b-2 border-gray-800 mb-2 pb-1" style={{ fontSize: `${fontSize + 2}px` }}>Education</h2>
              {educations.map((edu, idx) => (
                <div key={idx} className="mb-2">
                  <p className="font-semibold" style={{ fontSize: `${fontSize}px`, wordWrap: "break-word" }}>{edu.degree}</p>
                  <p className="text-gray-700" style={{ fontSize: `${fontSize}px`, wordWrap: "break-word" }}>
                    {(edu.college || edu.university) || ""} {edu.endDate && `| ${edu.endDate}`}
                  </p>
                </div>
              ))}
            </div>
          )
        );
      case "projects":
        return (
          projects.length > 0 && projects[0].title && (
            <div>
              <h2 className="text-lg font-semibold border-b-2 border-gray-800 mb-2 pb-1" style={{ fontSize: `${fontSize + 2}px` }}>Projects</h2>
              {projects.map((project, idx) => (
                <div key={idx} className="mb-3">
                  <p className="font-semibold" style={{ fontSize: `${fontSize}px`, wordWrap: "break-word" }}>{project.title}</p>
                  {project.description && (
                    <p className="text-gray-600 leading-relaxed" style={{ fontSize: `${fontSize}px`, wordWrap: "break-word", textAlign: "justify" }}>{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          )
        );
      case "internships":
        return (
          internships.length > 0 && internships[0].position && (
            <div>
              <h2 className="text-lg font-semibold border-b-2 border-gray-800 mb-2 pb-1" style={{ fontSize: `${fontSize + 2}px` }}>Internships</h2>
              {internships.map((intern, idx) => (
                <div key={idx} className="mb-3">
                  <p className="font-semibold" style={{ fontSize: `${fontSize}px`, wordWrap: "break-word" }}>
                    {intern.position} {intern.duration && `| ${intern.duration}`}
                  </p>
                  {intern.company && (
                    <p className="text-gray-700 mb-1" style={{ fontSize: `${fontSize}px`, wordWrap: "break-word" }}>{intern.company}</p>
                  )}
                  {intern.description && (
                    <p className="text-gray-600 leading-relaxed" style={{ fontSize: `${fontSize}px`, wordWrap: "break-word", textAlign: "justify" }}>{intern.description}</p>
                  )}
                </div>
              ))}
            </div>
          )
        );
      case "contact":
        if (isMain) {
          return (
            <div className="mb-6">
              <h2 className="text-lg font-semibold border-b-2 border-gray-800 mb-2 pb-1" style={{ fontSize: `${fontSize + 2}px` }}>Contact</h2>
              <div className="space-y-2" style={{ fontSize: `${fontSize}px` }}>
                {personal.phone && (<p><span className="font-semibold">Phone: </span>{personal.phone}</p>)}
                {personal.email && (<p style={{ wordBreak: "break-all" }}><span className="font-semibold">Email: </span>{personal.email}</p>)}
                {personal.website && (<p style={{ wordBreak: "break-all" }}><span className="font-semibold">Website: </span>{personal.website}</p>)}
                {personal.address && (<p><span className="font-semibold">Address: </span>{personal.address}</p>)}
              </div>
            </div>
          );
        }
        return (
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.3)", wordWrap: "break-word" }}>
            <h3 className="font-bold mb-3 text-center border-b border-gray-400 pb-2" style={{ fontSize: `${fontSize + 3}px` }}>CONTACT</h3>
            <div className="space-y-2" style={{ fontSize: `${fontSize}px` }}>
              {personal.phone && (<div><p className="font-semibold text-gray-300 text-xs mb-0.5">Phone</p><p>{personal.phone}</p></div>)}
              {personal.email && (<div><p className="font-semibold text-gray-300 text-xs mb-0.5">Email</p><p style={{ wordBreak: "break-all" }}>{personal.email}</p></div>)}
              {personal.website && (<div><p className="font-semibold text-gray-300 text-xs mb-0.5">Website</p><p style={{ wordBreak: "break-all" }}>{personal.website}</p></div>)}
              {personal.address && (<div><p className="font-semibold text-gray-300 text-xs mb-0.5">Address</p><p>{personal.address}</p></div>)}
            </div>
          </div>
        );
      case "skills":
        if (isMain) {
          return (
            skills && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b-2 border-gray-800 mb-2 pb-1" style={{ fontSize: `${fontSize + 2}px` }}>Skills</h2>
                <ul className="list-disc ml-4 space-y-1" style={{ fontSize: `${fontSize}px` }}>
                  {skills.split(",").map((s, idx) => (<li key={idx} style={{ wordWrap: "break-word" }}>{s.trim()}</li>))}
                </ul>
              </div>
            )
          );
        }
        return (
          skills && (
            <div className="w-full mb-6">
              <h3 className="font-semibold mb-2 border-b border-gray-500 pb-1" style={{ fontSize: `${fontSize + 3}px` }}>Skills</h3>
              <ul className="list-disc ml-4 space-y-1" style={{ fontSize: `${fontSize}px` }}>
                {skills.split(",").map((skill, idx) => (<li key={idx} style={{ wordWrap: "break-word" }}>{skill.trim()}</li>))}
              </ul>
            </div>
          )
        );
      case "languages":
        if (isMain) {
          return (
            personal.languages && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b-2 border-gray-800 mb-2 pb-1" style={{ fontSize: `${fontSize + 2}px` }}>Languages</h2>
                <ul className="list-disc ml-4 space-y-1" style={{ fontSize: `${fontSize}px` }}>
                  {personal.languages.split(",").map((lang, idx) => (<li key={idx} style={{ wordWrap: "break-word" }}>{lang.trim()}</li>))}
                </ul>
              </div>
            )
          );
        }
        return (
          personal.languages && (
            <div className="w-full mb-6">
              <h3 className="font-semibold mb-2 border-b border-gray-500 pb-1" style={{ fontSize: `${fontSize + 3}px` }}>Languages</h3>
              <ul className="list-disc ml-4 space-y-1" style={{ fontSize: `${fontSize}px` }}>
                {personal.languages.split(",").map((lang, idx) => (<li key={idx} style={{ wordWrap: "break-word" }}>{lang.trim()}</li>))}
              </ul>
            </div>
          )
        );
      case "strengths":
        if (isMain) {
          return (
            strengths && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b-2 border-gray-800 mb-2 pb-1" style={{ fontSize: `${fontSize + 2}px` }}>Strengths</h2>
                <ul className="list-disc ml-4 space-y-1" style={{ fontSize: `${fontSize}px` }}>
                  {strengths.split(",").map((st, idx) => (<li key={idx} style={{ wordWrap: "break-word" }}>{st.trim()}</li>))}
                </ul>
              </div>
            )
          );
        }
        return (
          strengths && (
            <div className="w-full mb-6">
              <h3 className="font-semibold mb-2 border-b border-gray-500 pb-1" style={{ fontSize: `${fontSize + 3}px` }}>Strengths</h3>
              <ul className="list-disc ml-4 space-y-1" style={{ fontSize: `${fontSize}px` }}>
                {strengths.split(",").map((st, idx) => (<li key={idx} style={{ wordWrap: "break-word" }}>{st.trim()}</li>))}
              </ul>
            </div>
          )
        );
      case "certifications":
        if (isMain) {
          return (
            certifications.length > 0 && certifications[0].name && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold border-b-2 border-gray-800 mb-2 pb-1" style={{ fontSize: `${fontSize + 2}px` }}>Certifications</h2>
                {certifications.map((cert, idx) => (
                  <div key={idx} className="mb-3" style={{ fontSize: `${fontSize}px` }}>
                    <p className="font-semibold" style={{ wordWrap: "break-word" }}>{cert.name}</p>
                    {cert.issuer && (<p className="text-gray-600" style={{ wordWrap: "break-word" }}>{cert.issuer}</p>)}
                    {cert.date && (<p className="text-gray-500 text-xs">{cert.date}</p>)}
                  </div>
                ))}
              </div>
            )
          );
        }
        return (
          certifications.length > 0 && certifications[0].name && (
            <div className="w-full mb-6">
              <h3 className="font-semibold mb-2 border-b border-gray-500 pb-1" style={{ fontSize: `${fontSize + 3}px` }}>Certifications</h3>
              {certifications.map((cert, idx) => (
                <div key={idx} className="mb-3" style={{ fontSize: `${fontSize}px` }}>
                  <p className="font-semibold" style={{ wordWrap: "break-word" }}>{cert.name}</p>
                  {cert.issuer && (<p className="text-gray-300" style={{ wordWrap: "break-word" }}>{cert.issuer}</p>)}
                  {cert.date && (<p className="text-gray-400 text-xs">{cert.date}</p>)}
                </div>
              ))}
            </div>
          )
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[210mm] bg-white mx-auto shadow-lg flex text-gray-800" style={{ fontFamily: "Arial, sans-serif", fontSize: `${fontSize}px`, minHeight: "297mm" }}>
      {/* LEFT SIDEBAR */}
      <div className="w-1/3 text-white p-5 flex flex-col" style={{ backgroundColor: sidebarColor }}>
        {/* Profile Photo */}
        {personal.photo && (
          <div className="flex justify-center mb-4">
            <img src={personal.photo} alt="profile" className="w-24 h-24 rounded-full object-cover" />
          </div>
        )}
        {/* Sidebar Sections (static render based on provided order) */}
        <div className="flex flex-col">
          {sidebarSectionOrder.map((sectionKey, index) => (
            <div key={`sidebar-${sectionKey}-${index}`}>{renderSection(sectionKey, "sidebar")}</div>
          ))}
        </div>
      </div>

      {/* RIGHT MAIN SECTION */}
      <div className="w-2/3 p-8 flex flex-col space-y-5" style={{ wordWrap: "break-word", overflowWrap: "break-word" }}>
        {/* Name and Title */}
        <div>
          <h1 className="font-bold mb-1" style={{ fontSize: `${fontSize + 18}px`, wordWrap: "break-word" }}>{personal.name || ""}</h1>
          <p className="text-gray-600" style={{ fontSize: `${fontSize + 5}px`, wordWrap: "break-word" }}>{personal.designation || ""}</p>
        </div>

        {/* Main Sections (static render based on provided order) */}
        <div className="space-y-5">
          {sectionOrder.map((sectionKey, index) => (
            <div key={`main-${sectionKey}-${index}`}>{renderSection(sectionKey, "main")}</div>
          ))}
        </div>
      </div>
    </div>
  );
    };

    export default TemplateSamira;
