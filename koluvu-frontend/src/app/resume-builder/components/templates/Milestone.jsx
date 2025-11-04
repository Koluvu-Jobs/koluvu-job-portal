import React from "react";

const BlackWhiteElegantTemplate = ({ formData }) => {
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

  return (
    <div
      className="bg-white mx-auto shadow-2xl"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm",
        fontSize: "10pt",
        lineHeight: "1.4",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      {/* Header Section */}
      <div
        className="flex gap-6 mb-6 pb-4 border-b-2"
        style={{ borderColor: "#1a5490" }}
      >
        {/* Profile Photo */}
        <div className="flex-shrink-0">
          {personal.photo ? (
            <img
              src={personal.photo}
              alt="Profile"
              className="object-cover"
              style={{ width: "90px", height: "90px" }}
            />
          ) : (
            <div
              className="bg-gray-300 flex items-center justify-center"
              style={{ width: "90px", height: "90px" }}
            >
              <svg width="40" height="40" fill="#666" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>

        {/* Personal Info */}
        <div className="flex-1">
          <h1
            className="font-bold mb-3 uppercase"
            style={{
              fontSize: "24pt",
              color: "#1a5490",
              letterSpacing: "0.5px",
            }}
          >
            {personal.name || ""}
          </h1>
          <div style={{ fontSize: "9pt", lineHeight: "1.6" }}>
            {personal.address && (
              <div className="mb-1">
                <span className="font-semibold">Address:</span>{" "}
                {personal.address}
              </div>
            )}
            {personal.phone && (
              <div className="mb-1">
                <span className="font-semibold">Phone:</span> {personal.phone}
              </div>
            )}
            {personal.email && (
              <div className="mb-1">
                <span className="font-semibold">Email:</span> {personal.email}
              </div>
            )}
            {personal.website && (
              <div className="mb-1">
                <span className="font-semibold">Website:</span>{" "}
                {personal.website}
              </div>
            )}
            {personal.linkedin && (
              <div className="mb-1">
                <span className="font-semibold">LinkedIn:</span>{" "}
                {personal.linkedin}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Career Objective / Summary */}
      {summary && (
        <div className="mb-5">
          <h2
            className="font-bold mb-2 pb-1 border-b uppercase"
            style={{ fontSize: "11pt", color: "#1a5490", borderColor: "#ccc" }}
          >
            CAREER OBJECTIVE
          </h2>
          <p
            style={{
              fontSize: "9.5pt",
              textAlign: "justify",
              lineHeight: "1.5",
            }}
          >
            {summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {skills && (
        <div className="mb-5">
          <h2
            className="font-bold mb-2 pb-1 border-b uppercase"
            style={{ fontSize: "11pt", color: "#1a5490", borderColor: "#ccc" }}
          >
            TECHNICAL SKILLS
          </h2>
          <p style={{ fontSize: "9.5pt", lineHeight: "1.5" }}>{skills}</p>
        </div>
      )}

      {/* Work Experience */}
      {experiences && experiences.length > 0 && experiences[0].designation && (
        <div className="mb-5">
          <h2
            className="font-bold mb-2 pb-1 border-b uppercase"
            style={{ fontSize: "11pt", color: "#1a5490", borderColor: "#ccc" }}
          >
            WORK EXPERIENCE
          </h2>
          {experiences.map(
            (exp, idx) =>
              exp.designation && (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <span
                        className="font-semibold"
                        style={{ fontSize: "10pt" }}
                      >
                        {exp.designation}
                        {exp.companyName && `, ${exp.companyName}`}
                      </span>
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <div
                        className="text-right font-medium"
                        style={{ fontSize: "9pt" }}
                      >
                        {exp.startDate} {exp.endDate && `- ${exp.endDate}`}
                      </div>
                    )}
                  </div>
                  {exp.responsibilities && (
                    <ul
                      className="list-disc ml-5 mt-1"
                      style={{ fontSize: "9.5pt" }}
                    >
                      {exp.responsibilities
                        .split("\n")
                        .filter((r) => r.trim())
                        .map((resp, i) => (
                          <li key={i} className="mb-1">
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
        <div className="mb-5">
          <h2
            className="font-bold mb-2 pb-1 border-b uppercase"
            style={{ fontSize: "11pt", color: "#1a5490", borderColor: "#ccc" }}
          >
            PROJECTS
          </h2>
          {projects.map(
            (proj, idx) =>
              proj.title && (
                <div key={idx} className="mb-3">
                  <div
                    className="font-semibold mb-1"
                    style={{ fontSize: "10pt" }}
                  >
                    {proj.title}
                  </div>
                  {proj.description && (
                    <p style={{ fontSize: "9.5pt", lineHeight: "1.5" }}>
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
        <div className="mb-5">
          <h2
            className="font-bold mb-2 pb-1 border-b uppercase"
            style={{ fontSize: "11pt", color: "#1a5490", borderColor: "#ccc" }}
          >
            INTERNSHIP EXPERIENCE
          </h2>
          {internships.map(
            (intern, idx) =>
              intern.position && (
                <div key={idx} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className="font-semibold"
                      style={{ fontSize: "10pt" }}
                    >
                      {intern.position}
                      {intern.company && `, ${intern.company}`}
                    </span>
                    {intern.duration && (
                      <span
                        className="text-right font-medium"
                        style={{ fontSize: "9pt" }}
                      >
                        {intern.duration}
                      </span>
                    )}
                  </div>
                  {intern.description && (
                    <p style={{ fontSize: "9.5pt", lineHeight: "1.5" }}>
                      {intern.description}
                    </p>
                  )}
                </div>
              )
          )}
        </div>
      )}

      {/* Education */}
      {educations && educations.length > 0 && educations[0].degree && (
        <div className="mb-5">
          <h2
            className="font-bold mb-2 pb-1 border-b uppercase"
            style={{ fontSize: "11pt", color: "#1a5490", borderColor: "#ccc" }}
          >
            EDUCATION
          </h2>
          {educations.map(
            (edu, idx) =>
              edu.degree && (
                <div key={idx} className="mb-3">
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className="font-semibold"
                      style={{ fontSize: "10pt" }}
                    >
                      {edu.degree}
                    </span>
                    {edu.endDate && (
                      <span
                        className="text-right font-medium"
                        style={{ fontSize: "9pt" }}
                      >
                        {edu.endDate}
                      </span>
                    )}
                  </div>
                  {edu.college && (
                    <div style={{ fontSize: "9.5pt" }}>{edu.college}</div>
                  )}
                  {edu.university && (
                    <div style={{ fontSize: "9.5pt" }}>{edu.university}</div>
                  )}
                </div>
              )
          )}
        </div>
      )}

      {/* Certifications */}
      {certifications &&
        certifications.length > 0 &&
        certifications[0].name && (
          <div className="mb-5">
            <h2
              className="font-bold mb-2 pb-1 border-b uppercase"
              style={{
                fontSize: "11pt",
                color: "#1a5490",
                borderColor: "#ccc",
              }}
            >
              CERTIFICATIONS
            </h2>
            <ul className="list-disc ml-5" style={{ fontSize: "9.5pt" }}>
              {certifications.map(
                (cert, idx) =>
                  cert.name && (
                    <li key={idx} className="mb-1">
                      <span className="font-semibold">{cert.name}</span>
                      {cert.issuer && ` - ${cert.issuer}`}
                      {cert.date && ` (${cert.date})`}
                    </li>
                  )
              )}
            </ul>
          </div>
        )}

      {/* Strengths */}
      {strengths && (
        <div className="mb-5">
          <h2
            className="font-bold mb-2 pb-1 border-b uppercase"
            style={{ fontSize: "11pt", color: "#1a5490", borderColor: "#ccc" }}
          >
            STRENGTHS
          </h2>
          <p style={{ fontSize: "9.5pt", lineHeight: "1.5" }}>{strengths}</p>
        </div>
      )}
    </div>
  );
};

export default BlackWhiteElegantTemplate;
