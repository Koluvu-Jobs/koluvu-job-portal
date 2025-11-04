import React from "react";

const ColorfulCreativeTemplate = ({ formData, imageSettings = {} }) => {
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

  // Image settings with defaults
  const {
    scale = 100,
    positionX = 50,
    positionY = 50,
    showImage = true,
  } = imageSettings;

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

  return (
    <div
      className="mx-auto shadow-2xl relative"
      style={{
        width: "210mm",
        minHeight: "297mm",
        fontFamily: "'Arial', sans-serif",
        background: "#f5f5f5",
        padding: "0",
      }}
    >
      {/* Decorative colored rectangles */}
      <div
        style={{
          position: "absolute",
          top: "0",
          right: "0",
          width: "150px",
          height: "100px",
          background: "#FDB913",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "100px",
          right: "0",
          width: "200px",
          height: "120px",
          background: "#00BFB3",
          zIndex: 0,
        }}
      />

      {/* Main Content */}
      <div style={{ position: "relative", zIndex: 1, padding: "30px 25px" }}>
        {/* Header Section */}
        <div style={{ marginBottom: "20px" }}>
          {/* Color dots */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <div
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                background: "#B8312F",
              }}
            />
            <div
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                background: "#FDB913",
              }}
            />
            <div
              style={{
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                background: "#00BFB3",
              }}
            />
          </div>

          {/* Name */}
          <h1
            style={{
              fontSize: "36pt",
              fontWeight: "bold",
              marginBottom: "5px",
              color: "#2a2a2a",
              lineHeight: "1",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {personal.name || ""}
          </h1>

          {/* Title Badge */}
          <div
            style={{
              display: "inline-block",
              border: "2px solid #00BFB3",
              borderRadius: "20px",
              padding: "8px 20px",
              marginTop: "15px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  background: "#00BFB3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14pt",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                <span style={{ fontSize: "12pt" }}>📧</span>
              </div>
              <span
                style={{
                  fontSize: "11pt",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {personal.designation || ""}
              </span>
            </div>
          </div>
        </div>

        {/* Two Column Layout with dynamic height management */}
        <div
          style={{
            display: "flex",
            gap: "30px",
          }}
        >
          {/* Left Column - Scrollable content */}
          <div
            style={{
              width: "50%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {/* Work Experience */}
            {experiences &&
              experiences.length > 0 &&
              experiences[0].designation && (
                <div className="mb-6" style={{ marginBottom: "25px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      border: "2px solid #2a2a2a",
                      borderRadius: "20px",
                      padding: "6px 16px",
                      marginBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: "#FDB913",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "11pt",
                          fontWeight: "bold",
                        }}
                      >
                        💼
                      </div>
                      <span
                        style={{
                          fontSize: "10pt",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        WORK EXPERIENCE
                      </span>
                    </div>
                  </div>

                  {experiences.map(
                    (exp, idx) =>
                      exp.designation && (
                        <div
                          key={idx}
                          className="mb-5"
                          style={{ marginBottom: "12px" }}
                        >
                          <h3
                            className="font-bold"
                            style={{
                              fontSize: "9pt",
                              color: "#2a2a2a",
                              marginBottom: "2px",
                            }}
                          >
                            {exp.designation} | {exp.companyName}
                          </h3>
                          <p
                            className="font-bold"
                            style={{
                              fontSize: "8.5pt",
                              color: "#B8312F",
                              marginBottom: "5px",
                            }}
                          >
                            {exp.startDate && exp.endDate
                              ? `${exp.startDate} - ${exp.endDate}`
                              : exp.endDate || "PRESENT"}
                          </p>
                          {exp.responsibilities && (
                            <p
                              style={{
                                fontSize: "9pt",
                                color: "#555",
                                lineHeight: "1.4",
                                textAlign: "justify",
                              }}
                            >
                              {exp.responsibilities}
                            </p>
                          )}
                        </div>
                      )
                  )}
                </div>
              )}

            {/* Education */}
            {educations && educations.length > 0 && educations[0].degree && (
              <div className="mb-6" style={{ marginBottom: "20px" }}>
                <div
                  style={{
                    display: "inline-block",
                    border: "2px solid #2a2a2a",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "#FDB913",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11pt",
                        fontWeight: "bold",
                      }}
                    >
                      🎓
                    </div>
                    <span
                      style={{
                        fontSize: "10pt",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      EDUCATION
                    </span>
                  </div>
                </div>

                {educations.map(
                  (edu, idx) =>
                    edu.degree && (
                      <div
                        key={idx}
                        className="mb-4"
                        style={{ marginBottom: "10px" }}
                      >
                        <h3
                          className="font-bold"
                          style={{
                            fontSize: "9pt",
                            color: "#2a2a2a",
                            marginBottom: "2px",
                          }}
                        >
                          {edu.degree}
                        </h3>
                        <p
                          className="font-bold"
                          style={{
                            fontSize: "8.5pt",
                            color: "#B8312F",
                            marginBottom: "3px",
                          }}
                        >
                          {edu.startDate && edu.endDate
                            ? `${edu.startDate} - ${edu.endDate}`
                            : edu.endDate}
                        </p>
                        <ul style={{ paddingLeft: "15px", margin: "3px 0" }}>
                          <li
                            style={{
                              fontSize: "9pt",
                              color: "#555",
                              lineHeight: "1.3",
                            }}
                          >
                            {edu.college || edu.university}
                          </li>
                        </ul>
                      </div>
                    )
                )}
              </div>
            )}

            {/* Personal Skills */}
            {skillsArray.length > 0 && (
              <div className="mb-6" style={{ marginBottom: "15px" }}>
                <div
                  style={{
                    display: "inline-block",
                    border: "2px solid #2a2a2a",
                    borderRadius: "20px",
                    padding: "6px 16px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: "#FDB913",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11pt",
                        fontWeight: "bold",
                      }}
                    >
                      ⭐
                    </div>
                    <span
                      style={{
                        fontSize: "10pt",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      PERSONAL SKILL
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {skillsArray.slice(0, 5).map((skill, idx) => (
                    <div key={idx}>
                      <div
                        style={{
                          fontSize: "9pt",
                          fontWeight: "600",
                          marginBottom: "3px",
                          color: "#2a2a2a",
                        }}
                      >
                        {skill}
                      </div>
                      <div style={{ display: "flex", gap: "3px" }}>
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            style={{
                              flex: 1,
                              height: "6px",
                              borderRadius: "10px",
                              background: bar <= 3 ? "#FDB913" : "#ddd",
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div style={{ width: "50%" }}>
            {/* Profile Photo */}
            <div
              style={{
                position: "relative",
                marginBottom: "20px",
                background: "#B8312F",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              {/* Star decoration */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "40px",
                  height: "40px",
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  background: "#2a2a2a",
                }}
              />

              {personal.photo && showImage ? (
                <img
                  src={personal.photo}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "200px",
                    maxHeight: "200px",
                    objectFit: "cover",
                    objectPosition: `${positionX}% ${positionY}%`,
                    borderRadius: "15px",
                    display: "block",
                    transform: `scale(${scale / 100})`,
                    transformOrigin: "center",
                  }}
                />
              ) : !showImage && personal.photo ? (
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "100%",
                    height: "200px",
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: "15px",
                  }}
                >
                  <svg
                    width="80"
                    height="80"
                    fill="rgba(255,255,255,0.5)"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: "100%",
                    height: "200px",
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: "15px",
                  }}
                >
                  <svg
                    width="80"
                    height="80"
                    fill="rgba(255,255,255,0.5)"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>

            {/* About Me */}
            <div
              style={{
                background: "#00BFB3",
                borderRadius: "20px",
                padding: "15px",
                marginBottom: "15px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  border: "2px solid white",
                  borderRadius: "20px",
                  padding: "6px 16px",
                  marginBottom: "10px",
                  background: "white",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "#FDB913",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11pt",
                      fontWeight: "bold",
                    }}
                  >
                    👤
                  </div>
                  <span
                    style={{
                      fontSize: "10pt",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    ABOUT ME
                  </span>
                </div>
              </div>
              <p
                style={{
                  fontSize: "9pt",
                  lineHeight: "1.5",
                  color: "white",
                  textAlign: "justify",
                }}
              >
                {summary || ""}
              </p>
            </div>

            {/* Contact Info */}
            <div
              style={{
                background: "white",
                border: "2px solid #2a2a2a",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              {/* Three dots decoration */}
              <div
                style={{
                  display: "flex",
                  gap: "5px",
                  justifyContent: "flex-end",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#B8312F",
                  }}
                />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#B8312F",
                  }}
                />
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#B8312F",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {personal.phone && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span style={{ fontSize: "9pt", color: "#2a2a2a" }}>
                      {personal.phone}
                    </span>
                    <div
                      style={{
                        width: "35px",
                        height: "18px",
                        borderRadius: "10px",
                        background: "#00BFB3",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          right: "2px",
                          top: "2px",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: "white",
                        }}
                      />
                    </div>
                  </div>
                )}
                {personal.email && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "8pt",
                        color: "#2a2a2a",
                        wordBreak: "break-all",
                      }}
                    >
                      {personal.email}
                    </span>
                    <div
                      style={{
                        width: "35px",
                        height: "18px",
                        borderRadius: "10px",
                        background: "#00BFB3",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          right: "2px",
                          top: "2px",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: "white",
                        }}
                      />
                    </div>
                  </div>
                )}
                {personal.address && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 0",
                    }}
                  >
                    <span style={{ fontSize: "8.5pt", color: "#2a2a2a" }}>
                      {personal.address}
                    </span>
                    <div
                      style={{
                        width: "35px",
                        height: "18px",
                        borderRadius: "10px",
                        background: "#00BFB3",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          right: "2px",
                          top: "2px",
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: "white",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Projects - Full Width Section */}
        {projects.length > 0 && projects[0].title && (
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "inline-block",
                border: "2px solid #2a2a2a",
                borderRadius: "20px",
                padding: "6px 16px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    background: "#00BFB3",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11pt",
                    fontWeight: "bold",
                  }}
                >
                  🚀
                </div>
                <span
                  style={{
                    fontSize: "10pt",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  PROJECTS
                </span>
              </div>
            </div>

            {/* 2-column grid layout spanning full width */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px 20px",
              }}
            >
              {projects.map((project, idx) => (
                <div
                  key={idx}
                  style={{
                    borderLeft: "3px solid #00BFB3",
                    paddingLeft: "10px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "9pt",
                      fontWeight: "600",
                      marginBottom: "5px",
                      color: "#2a2a2a",
                    }}
                  >
                    {project.title}
                  </h3>
                  {project.description && (
                    <p
                      style={{
                        fontSize: "9pt",
                        color: "#555",
                        lineHeight: "1.4",
                        textAlign: "justify",
                      }}
                    >
                      {project.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorfulCreativeTemplate;
