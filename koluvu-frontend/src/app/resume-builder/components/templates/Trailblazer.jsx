import React from "react";

const ResumeTemplate = ({ formData, resumeType }) => {
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
  const skillsArray = skills
    ? skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Parse strengths into array
  const strengthsArray = strengths
    ? strengths
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div
      className="bg-white"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: "0 auto",
        boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        position: "relative",
        fontFamily: "'Arial', sans-serif",
        fontSize: "10pt",
        lineHeight: "1.35",
        padding: "18px 20px",
        backgroundColor: "#fafafa",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          marginBottom: "12px",
          gap: "12px",
        }}
      >
        {/* Profile Picture */}
        <div
          style={{
            width: "85px",
            height: "85px",
            borderRadius: "50%",
            border: "3px solid #2c2c2c",
            overflow: "hidden",
            flexShrink: 0,
            backgroundColor: "#e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: "bold",
            color: "#666",
            boxShadow: "0 3px 8px rgba(0,0,0,0.12)",
          }}
        >
          {personal.name ? personal.name.charAt(0).toUpperCase() : "U"}
        </div>

        {/* Name and Summary */}
        <div style={{ flex: 1, paddingTop: "4px" }}>
          <h1
            style={{
              fontSize: "22pt",
              fontWeight: "bold",
              marginBottom: "3px",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              color: "#2c2c2c",
            }}
          >
            {personal.name || ""}
          </h1>
          <p
            style={{
              fontSize: "11pt",
              color: "#666",
              marginBottom: "6px",
              fontWeight: "500",
            }}
          >
            {personal.designation || personal.title || ""}
          </p>
          {summary && (
            <p
              style={{
                fontSize: "11pt",
                lineHeight: "1.4",
                color: "#4a4a4a",
                textAlign: "justify",
              }}
            >
              {summary}
            </p>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.8fr",
          gap: "12px",
        }}
      >
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Contact Section */}
          <div
            style={{
              border: "2px solid #2c2c2c",
              borderRadius: "10px",
              padding: "12px 10px",
              backgroundColor: "#ffffff",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-10px",
                left: "12px",
                backgroundColor: "#f4c430",
                padding: "4px 12px",
                borderRadius: "10px",
                fontWeight: "bold",
                fontSize: "10pt",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                border: "2px solid #2c2c2c",
              }}
            >
              CONTACT
            </div>

            <div
              style={{
                marginTop: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {personal.phone && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: "1.5px solid #2c2c2c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: "11pt" }}>📞</span>
                  </div>
                  <span style={{ fontSize: "11pt", color: "#2c2c2c" }}>
                    {personal.phone}
                  </span>
                </div>
              )}

              {personal.email && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: "1.5px solid #2c2c2c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: "11pt" }}>✉️</span>
                  </div>
                  <span
                    style={{
                      fontSize: "11pt",
                      color: "#2c2c2c",
                      wordBreak: "break-word",
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
                    alignItems: "flex-start",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: "1.5px solid #2c2c2c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: "11pt" }}>📍</span>
                  </div>
                  <span style={{ fontSize: "11pt", color: "#2c2c2c" }}>
                    {personal.address}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section */}
          {skillsArray.length > 0 && (
            <div
              style={{
                border: "2px solid #2c2c2c",
                borderRadius: "14px",
                padding: "16px 14px",
                backgroundColor: "#ffffff",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "16px",
                  backgroundColor: "#4a9eff",
                  padding: "6px 16px",
                  borderRadius: "14px",
                  fontWeight: "bold",
                  fontSize: "11pt",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#ffffff",
                  border: "2px solid #2c2c2c",
                }}
              >
                SKILLS
              </div>

              <ul
                style={{
                  marginTop: "12px",
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {skillsArray.map((skill, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: "10pt",
                      color: "#2c2c2c",
                      paddingLeft: "14px",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "0",
                        fontSize: "11pt",
                      }}
                    >
                      •
                    </span>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Experience Section */}
          {experiences.length > 0 && experiences[0].designation && (
            <div
              style={{
                border: "2px solid #2c2c2c",
                borderRadius: "14px",
                padding: "16px 14px",
                backgroundColor: "#ffffff",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "16px",
                  backgroundColor: "#ff69b4",
                  padding: "6px 16px",
                  borderRadius: "14px",
                  fontWeight: "bold",
                  fontSize: "11pt",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#ffffff",
                  border: "2px solid #2c2c2c",
                }}
              >
                EXPERIENCE
              </div>

              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {experiences.map((exp, idx) => (
                  <div key={idx}>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "11pt",
                        color: "#2c2c2c",
                        marginBottom: "3px",
                        textTransform: "uppercase",
                      }}
                    >
                      {exp.designation}
                    </p>
                    <p
                      style={{
                        fontSize: "10pt",
                        color: "#666",
                        marginBottom: "3px",
                        fontStyle: "italic",
                      }}
                    >
                      {exp.companyName} | {exp.startDate} - {exp.endDate}
                    </p>
                    <p
                      style={{
                        fontSize: "9.5pt",
                        lineHeight: "1.45",
                        color: "#4a4a4a",
                        textAlign: "justify",
                      }}
                    >
                      {exp.responsibilities}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {projects.length > 0 && projects[0].title && (
            <div
              style={{
                border: "2px solid #2c2c2c",
                borderRadius: "14px",
                padding: "16px 14px",
                backgroundColor: "#ffffff",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "16px",
                  backgroundColor: "#9370db",
                  padding: "6px 16px",
                  borderRadius: "14px",
                  fontWeight: "bold",
                  fontSize: "11pt",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#ffffff",
                  border: "2px solid #2c2c2c",
                }}
              >
                PROJECTS
              </div>

              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {projects.map((proj, idx) => (
                  <div key={idx}>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "10.5pt",
                        color: "#2c2c2c",
                        marginBottom: "4px",
                      }}
                    >
                      {proj.title}
                    </p>
                    <p
                      style={{
                        fontSize: "9.5pt",
                        lineHeight: "1.45",
                        color: "#4a4a4a",
                        textAlign: "justify",
                      }}
                    >
                      {proj.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internships Section */}
          {internships.length > 0 && internships[0].position && (
            <div
              style={{
                border: "2px solid #2c2c2c",
                borderRadius: "14px",
                padding: "16px 14px",
                backgroundColor: "#ffffff",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "16px",
                  backgroundColor: "#ff8c00",
                  padding: "6px 16px",
                  borderRadius: "14px",
                  fontWeight: "bold",
                  fontSize: "11pt",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#ffffff",
                  border: "2px solid #2c2c2c",
                }}
              >
                INTERNSHIPS
              </div>

              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {internships.map((intern, idx) => (
                  <div key={idx}>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "10.5pt",
                        color: "#2c2c2c",
                        marginBottom: "3px",
                      }}
                    >
                      {intern.position}
                    </p>
                    <p
                      style={{
                        fontSize: "10pt",
                        color: "#666",
                        marginBottom: "4px",
                        fontStyle: "italic",
                      }}
                    >
                      {intern.company} | {intern.duration}
                    </p>
                    <p
                      style={{
                        fontSize: "9.5pt",
                        lineHeight: "1.45",
                        color: "#4a4a4a",
                        textAlign: "justify",
                      }}
                    >
                      {intern.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {educations.length > 0 && educations[0].degree && (
            <div
              style={{
                border: "2px solid #2c2c2c",
                borderRadius: "14px",
                padding: "16px 14px",
                backgroundColor: "#ffffff",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "16px",
                  backgroundColor: "#00bcd4",
                  padding: "6px 16px",
                  borderRadius: "14px",
                  fontWeight: "bold",
                  fontSize: "11pt",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#ffffff",
                  border: "2px solid #2c2c2c",
                }}
              >
                EDUCATION
              </div>

              <ul
                style={{
                  marginTop: "12px",
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {educations.map((edu, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: "10pt",
                      color: "#2c2c2c",
                      paddingLeft: "14px",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "0",
                        fontSize: "11pt",
                        fontWeight: "bold",
                      }}
                    >
                      •
                    </span>
                    <strong>{edu.degree}</strong>
                    <br />
                    <span style={{ fontSize: "10pt", color: "#666" }}>
                      {edu.college}
                      {edu.university && `, ${edu.university}`}
                    </span>
                    <br />
                    <span style={{ fontSize: "10pt", color: "#666" }}>
                      {edu.startDate && edu.endDate ? `${edu.startDate} - ${edu.endDate}` : edu.endDate}
                      {edu.cgpa && ` | ${edu.cgpa}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certifications Section */}
          {certifications.length > 0 && certifications[0].name && (
            <div
              style={{
                border: "2px solid #2c2c2c",
                borderRadius: "14px",
                padding: "16px 14px",
                backgroundColor: "#ffffff",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-12px",
                  left: "16px",
                  backgroundColor: "#ffa500",
                  padding: "6px 16px",
                  borderRadius: "14px",
                  fontWeight: "bold",
                  fontSize: "11pt",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  color: "#ffffff",
                  border: "2px solid #2c2c2c",
                }}
              >
                CERTIFICATIONS
              </div>

              <ul
                style={{
                  marginTop: "12px",
                  listStyle: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {certifications.map((cert, idx) => (
                  <li
                    key={idx}
                    style={{
                      fontSize: "10pt",
                      color: "#2c2c2c",
                      paddingLeft: "14px",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: "0",
                        top: "0",
                        fontSize: "11pt",
                      }}
                    >
                      •
                    </span>
                    <strong>{cert.name}</strong>
                    {cert.issuer && (
                      <>
                        <br />
                        <span style={{ fontSize: "10pt", color: "#666" }}>
                          {cert.issuer} {cert.date && `| ${cert.date}`}
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate;
