import React from "react";

const ModernBlackRedTemplate = ({ formData }) => {
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

  // Parse skills string into array
  const skillsList = skills
    ? skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Get first 5 skills for icon display
  const topSkills = skillsList.slice(0, 5);

  return (
    <>
      <style>
        {`
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            body {
              background: white !important;
            }
          }
        `}
      </style>
      <div
        className="mx-auto shadow-2xl relative overflow-hidden"
        style={{
          width: "210mm",
          minHeight: "297mm",
          maxHeight: "297mm",
          background: "#ffffff",
          backgroundColor: "#ffffff",
          color: "#2a2a2a",
          padding: "0",
          pageBreakAfter: "always",
        }}
      >
        {/* Decorative corner stripes */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-red-600 transform -rotate-45 -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-red-600 transform rotate-45 translate-x-16 translate-y-16"></div>

        {/* Dotted pattern background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle, #666 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>

        {/* Vertical "DESIGNER" text on right */}
        <div className="absolute right-4 top-1/4 bottom-1/4 flex items-center">
          <div
            className="text-6xl font-black tracking-wider opacity-5"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "mixed",
              letterSpacing: "0.2em",
              color: "#999",
            }}
          >
            {personal.designation ? personal.designation.toUpperCase() : ""}
          </div>
        </div>

        <div
          className="relative z-10 h-full flex flex-col"
          style={{ padding: "25px 30px" }}
        >
          {/* Header Section */}
          <div className="flex gap-6" style={{ marginBottom: "20px" }}>
            {/* Photo */}
            <div className="relative flex-shrink-0">
              {personal.photo ? (
                <img
                  src={personal.photo}
                  alt={personal.name}
                  style={{
                    width: "140px",
                    height: "160px",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
              ) : (
                <div
                  className="bg-gray-200 flex items-center justify-center"
                  style={{ width: "140px", height: "160px" }}
                >
                  <span className="text-6xl">👤</span>
                </div>
              )}
            </div>

            {/* Name and Contact Info */}
            <div className="flex-1 flex flex-col" style={{ gap: "12px" }}>
              {/* Name Section */}
              <div style={{ marginBottom: "0" }}>
                <h1
                  style={{
                    fontSize: "28pt",
                    fontWeight: "900",
                    marginBottom: "0",
                    marginTop: "0",
                    lineHeight: "0.9",
                    color: "#2a2a2a",
                  }}
                >
                  {personal.name
                    ? personal.name.split(" ")[0].toUpperCase()
                    : ""}
                </h1>
                <h1
                  style={{
                    fontSize: "28pt",
                    fontWeight: "900",
                    marginTop: "2px",
                    marginBottom: "4px",
                    lineHeight: "0.9",
                    color: "#ef4444",
                  }}
                >
                  {personal.name
                    ? personal.name.split(" ").slice(1).join(" ").toUpperCase()
                    : ""}
                </h1>
                <p
                  style={{
                    fontSize: "11pt",
                    color: "#666",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    marginTop: "4px",
                    marginBottom: "0",
                  }}
                >
                  {personal.designation || ""}
                </p>
              </div>

              {/* Contact Icons */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  marginTop: "8px",
                }}
              >
                {personal.phone && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        fontSize: "11pt",
                        border: "1px solid #9ca3af",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      📞
                    </div>
                    <span style={{ color: "#555", fontSize: "10pt" }}>
                      {personal.phone}
                    </span>
                  </div>
                )}
                {personal.email && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        fontSize: "11pt",
                        border: "1px solid #9ca3af",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      ✉️
                    </div>
                    <span
                      style={{
                        color: "#555",
                        fontSize: "10pt",
                        wordBreak: "break-all",
                      }}
                    >
                      {personal.email}
                    </span>
                  </div>
                )}
                {personal.address && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "26px",
                        height: "26px",
                        fontSize: "11pt",
                        border: "1px solid #9ca3af",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      📍
                    </div>
                    <span style={{ color: "#555", fontSize: "10pt" }}>
                      {personal.address}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Section */}
          {summary && (
            <div style={{ marginBottom: "15px" }}>
              <h2
                style={{
                  color: "#ef4444",
                  fontSize: "14pt",
                  fontWeight: "900",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                }}
              >
                PROFILE
              </h2>
              <p
                style={{
                  fontSize: "9pt",
                  color: "#555",
                  lineHeight: "1.5",
                  textAlign: "justify",
                }}
              >
                {summary || ""}
              </p>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            {/* Left Column */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {/* Experience Section */}
              {experiences.length > 0 && experiences[0].designation && (
                <div>
                  <h2
                    style={{
                      color: "#ef4444",
                      fontSize: "14pt",
                      fontWeight: "900",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    EXPERIENCE
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    {experiences.map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-400"
                        style={{ paddingLeft: "10px" }}
                      >
                        <p
                          style={{
                            fontWeight: "700",
                            fontSize: "10pt",
                            marginBottom: "3px",
                            color: "#2a2a2a",
                          }}
                        >
                          {exp.designation}
                        </p>
                        <p
                          style={{
                            fontSize: "9pt",
                            color: "#555",
                            marginBottom: "3px",
                          }}
                        >
                          {exp.companyName}
                        </p>
                        <p
                          style={{
                            fontSize: "9pt",
                            color: "#ef4444",
                            marginBottom: "6px",
                            fontWeight: "500",
                          }}
                        >
                          {exp.startDate} - {exp.endDate || "Present"}
                        </p>
                        {exp.responsibilities && (
                          <p
                            style={{
                              fontSize: "9pt",
                              color: "#555",
                              lineHeight: "1.5",
                              textAlign: "justify",
                            }}
                          >
                            {exp.responsibilities}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {projects.length > 0 && projects[0].title && (
                <div>
                  <h2
                    style={{
                      color: "#ef4444",
                      fontSize: "14pt",
                      fontWeight: "900",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    PROJECTS
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    {projects.map((project, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-400"
                        style={{ paddingLeft: "10px" }}
                      >
                        <p
                          style={{
                            fontWeight: "700",
                            fontSize: "10pt",
                            marginBottom: "5px",
                            color: "#2a2a2a",
                          }}
                        >
                          {project.title}
                        </p>
                        <p
                          style={{
                            fontSize: "9pt",
                            color: "#555",
                            lineHeight: "1.5",
                            textAlign: "justify",
                          }}
                        >
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internships Section */}
              {internships.length > 0 && internships[0].position && (
                <div>
                  <h2
                    style={{
                      color: "#ef4444",
                      fontSize: "14pt",
                      fontWeight: "900",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    INTERNSHIPS
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    {internships.map((intern, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-400"
                        style={{ paddingLeft: "10px" }}
                      >
                        <p
                          style={{
                            fontWeight: "700",
                            fontSize: "10pt",
                            marginBottom: "3px",
                            color: "#2a2a2a",
                          }}
                        >
                          {intern.position}
                        </p>
                        <p
                          style={{
                            fontSize: "9pt",
                            color: "#555",
                            marginBottom: "3px",
                          }}
                        >
                          {intern.company}{" "}
                          {intern.duration && `• ${intern.duration}`}
                        </p>
                        {intern.description && (
                          <p
                            style={{
                              fontSize: "9pt",
                              color: "#555",
                              lineHeight: "1.5",
                              textAlign: "justify",
                            }}
                          >
                            {intern.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {/* Skills Section with Icons */}
              {skillsList.length > 0 && (
                <div>
                  <h2
                    style={{
                      color: "#ef4444",
                      fontSize: "14pt",
                      fontWeight: "900",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    SKILLS
                  </h2>

                  {/* All Skills as Highlighted Badges */}
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {skillsList.map((skill, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          backgroundColor: "#f3f4f6",
                          border: "1px solid #d1d5db",
                          borderRadius: "12px",
                          fontSize: "9pt",
                          color: "#2a2a2a",
                          fontWeight: "500",
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {educations.length > 0 && educations[0].degree && (
                <div>
                  <h2
                    style={{
                      color: "#ef4444",
                      fontSize: "14pt",
                      fontWeight: "900",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    EDUCATION
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "15px",
                    }}
                  >
                    {educations.map((edu, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-400"
                        style={{ paddingLeft: "10px" }}
                      >
                        <p
                          style={{
                            fontWeight: "700",
                            fontSize: "10pt",
                            marginBottom: "3px",
                            color: "#2a2a2a",
                          }}
                        >
                          {edu.degree}
                        </p>
                        <p
                          style={{
                            fontSize: "9pt",
                            color: "#555",
                            marginBottom: "2px",
                          }}
                        >
                          {edu.college}
                        </p>
                        {edu.university && (
                          <p
                            style={{
                              fontSize: "9pt",
                              color: "#555",
                              marginBottom: "2px",
                            }}
                          >
                            {edu.university}
                          </p>
                        )}
                        <p
                          style={{
                            fontSize: "9pt",
                            color: "#ef4444",
                            fontWeight: "500",
                          }}
                        >
                          {edu.endDate || ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications Section */}
              {certifications.length > 0 && certifications[0].name && (
                <div>
                  <h2
                    style={{
                      color: "#ef4444",
                      fontSize: "14pt",
                      fontWeight: "900",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    CERTIFICATIONS
                  </h2>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    {certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-gray-400"
                        style={{ paddingLeft: "10px" }}
                      >
                        <p
                          style={{
                            fontWeight: "700",
                            fontSize: "10pt",
                            marginBottom: "3px",
                            color: "#2a2a2a",
                          }}
                        >
                          {cert.name}
                        </p>
                        <p style={{ fontSize: "9pt", color: "#555" }}>
                          {cert.issuer} {cert.date && `• ${cert.date}`}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths Section */}
              {strengths && (
                <div>
                  <h2
                    style={{
                      color: "#ef4444",
                      fontSize: "14pt",
                      fontWeight: "900",
                      marginBottom: "12px",
                      textTransform: "uppercase",
                    }}
                  >
                    STRENGTHS
                  </h2>
                  <p
                    className="border-l-2 border-gray-400"
                    style={{
                      fontSize: "9pt",
                      color: "#555",
                      lineHeight: "1.5",
                      textAlign: "justify",
                      paddingLeft: "10px",
                    }}
                  >
                    {strengths}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModernBlackRedTemplate;
