import React from "react";

const ClassicTemplate = ({ formData, photoUrl, resumeType }) => {
  // Default values to prevent undefined errors
  const personalInfo = formData?.personal || {};
  const skills = formData?.skills || "";
  const educations = formData?.educations || [];
  const experiences = formData?.experiences || [];
  const projects = formData?.projects || [];
  const internships = formData?.internships || [];
  const certifications = formData?.certifications || [];
  const strengths = formData?.strengths || "";

  return (
    <div className="resume-template classic-resume max-w-4xl mx-auto bg-white p-8 border-2 border-gray-300">
      {/* Header Section */}
      <div className="resume-header text-center mb-6 border-b-2 border-gray-400 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wider">
          {personalInfo.fullName || personalInfo.firstName || "Your Name"}
        </h1>
        <div className="contact-info flex justify-center space-x-6 text-sm text-gray-700 font-medium">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.address && <span>• {personalInfo.address}</span>}
        </div>
      </div>

      {/* Summary Section */}
      {personalInfo.summary && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Objective
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {/* Skills Section */}
      {skills && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {skills.split(",").map((skill, index) => (
              <div key={index} className="text-gray-700 font-medium">
                • {skill.trim() || "Skill Name"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Experience
          </h2>
          {experiences.map((exp, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-base font-bold text-gray-900">
                  {exp.designation || "Job Title"}
                </h3>
                <span className="text-sm text-gray-600 font-medium">
                  {exp.startDate || "Start Date"} - {exp.endDate || "End Date"}
                </span>
              </div>
              <p className="text-gray-700 font-medium mb-2">
                {exp.companyName || "Company Name"}
              </p>
              {exp.responsibilities && (
                <p className="text-gray-700 leading-relaxed text-sm">
                  {exp.responsibilities}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {educations.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Education
          </h2>
          {educations.map((edu, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-base font-bold text-gray-900">
                {edu.degree || "Degree Name"}
              </h3>
              <p className="text-gray-700 font-medium">
                {edu.college || edu.university || "University Name"}
              </p>
              <p className="text-sm text-gray-600">
                {edu.endDate || "Completion Year"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {projects.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Projects
          </h2>
          {projects.map((project, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-base font-bold text-gray-900">
                {project.title || "Project Title"}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm mt-1">
                {project.description || "Project description"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Internship Section */}
      {internships.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Internship
          </h2>
          {internships.map((internship, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-base font-bold text-gray-900">
                {internship.position || "Position"}
              </h3>
              <p className="text-gray-700 font-medium mb-1">
                {internship.company || "Company Name"}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {internship.duration || "Duration"}
              </p>
              {internship.description && (
                <p className="text-gray-700 leading-relaxed text-sm">
                  {internship.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications Section */}
      {certifications.length > 0 && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Certifications
          </h2>
          {certifications.map((cert, index) => (
            <div key={index} className="mb-3">
              <h3 className="text-base font-bold text-gray-900">
                {cert.name || "Certification Name"}
              </h3>
              <p className="text-gray-700 font-medium">
                {cert.issuer || "Issuing Organization"}
              </p>
              <p className="text-sm text-gray-600">{cert.date || "Date"}</p>
            </div>
          ))}
        </div>
      )}

      {/* Strengths Section */}
      {strengths && (
        <div className="resume-section mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
            Strengths
          </h2>
          <p className="text-gray-700 leading-relaxed">{strengths}</p>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
