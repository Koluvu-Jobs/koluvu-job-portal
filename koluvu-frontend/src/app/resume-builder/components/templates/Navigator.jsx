import React from "react";

const MinimalistProfessionalTemplate = ({ formData }) => {
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

  // Parse skills into array if it's a string
  const skillsArray =
    typeof skills === "string"
      ? skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : Array.isArray(skills)
      ? skills
      : [];

  // Parse languages if available
  const languages = personal.languages || "";
  const languagesArray = languages
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div
      className="mx-auto shadow-2xl"
      style={{
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Arial', sans-serif",
        background: "white",
        padding: "25mm 20mm",
        color: "#2a2a2a",
      }}
    >
      {/* Header - Name and Contact */}
      <div
        className="mb-6"
        style={{ borderBottom: "2px solid #2a2a2a", paddingBottom: "15px" }}
      >
        <h1
          style={{
            fontSize: "32pt",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#2a2a2a",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          {personal.name || ""}
        </h1>
        <div style={{ fontSize: "9pt", color: "#555", lineHeight: "1.6" }}>
          <span>{personal.email || ""}</span>
          {personal.phone && <span> | {personal.phone}</span>}
          {personal.address && <span> | {personal.address}</span>}
          {personal.website && (
            <div style={{ marginTop: "2px" }}>{personal.website}</div>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div style={{ display: "flex", gap: "30px" }}>
        {/* Left Column */}
        <div style={{ width: "35%" }}>
          {/* Profile */}
          {summary && (
            <div className="mb-6">
              <h2
                className="font-bold uppercase mb-3"
                style={{
                  fontSize: "12pt",
                  color: "#2a2a2a",
                  letterSpacing: "1px",
                }}
              >
                PROFILE
              </h2>
              <p
                style={{
                  fontSize: "8.5pt",
                  lineHeight: "1.7",
                  color: "#444",
                  textAlign: "justify",
                }}
              >
                {summary}
              </p>
            </div>
          )}

          {/* Skills */}
          {skillsArray.length > 0 && (
            <div className="mb-6">
              <h2
                className="font-bold uppercase mb-3"
                style={{
                  fontSize: "12pt",
                  color: "#2a2a2a",
                  letterSpacing: "1px",
                }}
              >
                SKILLS
              </h2>
              <ul style={{ paddingLeft: "0", listStyle: "none" }}>
                {skillsArray.map((skill, idx) => (
                  <li
                    key={idx}
                    className="mb-2 flex items-start gap-2"
                    style={{
                      fontSize: "9pt",
                      color: "#444",
                      lineHeight: "1.5",
                    }}
                  >
                    <span style={{ color: "#2a2a2a", fontWeight: "bold" }}>
                      ▸
                    </span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Language */}
          {languagesArray.length > 0 && (
            <div className="mb-6">
              <h2
                className="font-bold uppercase mb-3"
                style={{
                  fontSize: "12pt",
                  color: "#2a2a2a",
                  letterSpacing: "1px",
                }}
              >
                LANGUAGE
              </h2>
              <ul style={{ paddingLeft: "0", listStyle: "none" }}>
                {languagesArray.map((lang, idx) => (
                  <li
                    key={idx}
                    className="mb-2 flex items-start gap-2"
                    style={{
                      fontSize: "9pt",
                      color: "#444",
                      lineHeight: "1.5",
                    }}
                  >
                    <span style={{ color: "#2a2a2a", fontWeight: "bold" }}>
                      ▸
                    </span>
                    <span>{lang}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Awards/Certifications */}
          {certifications &&
            certifications.length > 0 &&
            certifications[0].name && (
              <div className="mb-6">
                <h2
                  className="font-bold uppercase mb-3"
                  style={{
                    fontSize: "12pt",
                    color: "#2a2a2a",
                    letterSpacing: "1px",
                  }}
                >
                  AWARDS
                </h2>
                {certifications.map(
                  (cert, idx) =>
                    cert.name && (
                      <div key={idx} className="mb-3">
                        <h3
                          className="font-bold mb-1"
                          style={{ fontSize: "9.5pt", color: "#2a2a2a" }}
                        >
                          {cert.name} {cert.date && `(${cert.date})`}
                        </h3>
                        {cert.issuer && (
                          <p
                            style={{
                              fontSize: "8.5pt",
                              color: "#666",
                              lineHeight: "1.5",
                            }}
                          >
                            {cert.issuer}
                          </p>
                        )}
                      </div>
                    )
                )}
              </div>
            )}
        </div>

        {/* Right Column */}
        <div style={{ flex: 1 }}>
          {/* Education */}
          {educations && educations.length > 0 && educations[0].degree && (
            <div className="mb-6">
              <h2
                className="font-bold uppercase mb-3"
                style={{
                  fontSize: "12pt",
                  color: "#2a2a2a",
                  letterSpacing: "1px",
                }}
              >
                EDUCATION
              </h2>
              {educations.map(
                (edu, idx) =>
                  edu.degree && (
                    <div key={idx} className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3
                          className="font-bold"
                          style={{ fontSize: "10pt", color: "#2a2a2a" }}
                        >
                          <span style={{ marginRight: "5px" }}>•</span>
                          {edu.degree}
                        </h3>
                        <span
                          style={{
                            fontSize: "9pt",
                            color: "#666",
                            whiteSpace: "nowrap",
                            marginLeft: "10px",
                          }}
                        >
                          {edu.startDate && edu.endDate
                            ? `${edu.startDate} - ${edu.endDate}`
                            : edu.endDate}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "9pt",
                          color: "#555",
                          lineHeight: "1.6",
                          textAlign: "justify",
                          marginLeft: "12px",
                        }}
                      >
                        {edu.college || edu.university}
                      </p>
                    </div>
                  )
              )}
            </div>
          )}

          {/* Work Experience */}
          {experiences &&
            experiences.length > 0 &&
            experiences[0].designation && (
              <div className="mb-6">
                <h2
                  className="font-bold uppercase mb-3"
                  style={{
                    fontSize: "12pt",
                    color: "#2a2a2a",
                    letterSpacing: "1px",
                  }}
                >
                  WORK EXPERIENCE
                </h2>
                {experiences.map(
                  (exp, idx) =>
                    exp.designation && (
                      <div key={idx} className="mb-5">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3
                              className="font-bold"
                              style={{ fontSize: "10pt", color: "#2a2a2a" }}
                            >
                              {exp.companyName}
                            </h3>
                            <p
                              className="font-semibold"
                              style={{
                                fontSize: "9pt",
                                color: "#666",
                                fontStyle: "italic",
                              }}
                            >
                              {exp.designation}
                            </p>
                          </div>
                          <span
                            style={{
                              fontSize: "9pt",
                              color: "#666",
                              whiteSpace: "nowrap",
                              marginLeft: "10px",
                            }}
                          >
                            {exp.startDate && exp.endDate
                              ? `${exp.startDate} - ${exp.endDate}`
                              : exp.endDate || "Present"}
                          </span>
                        </div>
                        {exp.responsibilities && (
                          <ul style={{ paddingLeft: "15px", marginTop: "8px" }}>
                            {exp.responsibilities
                              .split("\n")
                              .filter((r) => r.trim())
                              .map((resp, i) => (
                                <li
                                  key={i}
                                  style={{
                                    fontSize: "8.5pt",
                                    color: "#555",
                                    lineHeight: "1.6",
                                    marginBottom: "4px",
                                  }}
                                >
                                  {resp.trim()}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    )
                )}
              </div>
            )}

          {/* Projects */}
          {projects && projects.length > 0 && projects[0].title && (
            <div className="mb-6">
              <h2
                className="font-bold uppercase mb-3"
                style={{
                  fontSize: "12pt",
                  color: "#2a2a2a",
                  letterSpacing: "1px",
                }}
              >
                PROJECTS
              </h2>
              {projects.map(
                (proj, idx) =>
                  proj.title && (
                    <div key={idx} className="mb-4">
                      <h3
                        className="font-bold mb-1"
                        style={{ fontSize: "10pt", color: "#2a2a2a" }}
                      >
                        {proj.title}
                      </h3>
                      {proj.description && (
                        <p
                          style={{
                            fontSize: "8.5pt",
                            color: "#555",
                            lineHeight: "1.6",
                            textAlign: "justify",
                          }}
                        >
                          {proj.description}
                        </p>
                      )}
                    </div>
                  )
              )}
            </div>
          )}

          {/* Internships */}
          {internships && internships.length > 0 && internships[0].position && (
            <div className="mb-6">
              <h2
                className="font-bold uppercase mb-3"
                style={{
                  fontSize: "12pt",
                  color: "#2a2a2a",
                  letterSpacing: "1px",
                }}
              >
                INTERNSHIPS
              </h2>
              {internships.map(
                (intern, idx) =>
                  intern.position && (
                    <div key={idx} className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3
                            className="font-bold"
                            style={{ fontSize: "10pt", color: "#2a2a2a" }}
                          >
                            {intern.company}
                          </h3>
                          <p
                            className="font-semibold"
                            style={{
                              fontSize: "9pt",
                              color: "#666",
                              fontStyle: "italic",
                            }}
                          >
                            {intern.position}
                          </p>
                        </div>
                        {intern.duration && (
                          <span
                            style={{
                              fontSize: "9pt",
                              color: "#666",
                              whiteSpace: "nowrap",
                              marginLeft: "10px",
                            }}
                          >
                            {intern.duration}
                          </span>
                        )}
                      </div>
                      {intern.description && (
                        <p
                          style={{
                            fontSize: "8.5pt",
                            color: "#555",
                            lineHeight: "1.6",
                            textAlign: "justify",
                            marginTop: "6px",
                          }}
                        >
                          {intern.description}
                        </p>
                      )}
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalistProfessionalTemplate;
