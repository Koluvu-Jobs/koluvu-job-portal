import React from "react";

const CorporateTemplate = ({ formData, photoUrl, resumeType }) => {
  // Default values to prevent undefined errors
  const personalInfo = formData?.personal || {};
  const skills = formData?.skills || "";
  const educations = formData?.educations || [];
  const experiences = formData?.experiences || [];

  return (
    <div className="resume-template corporate-resume max-w-4xl mx-auto bg-white border-2 border-gray-300 p-8">
      {/* Header Section */}
      <div className="resume-header mb-8 pb-6 border-b-2 border-blue-600">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {personalInfo.fullName || personalInfo.firstName || "Your Name"}
            </h1>
            <div className="contact-info space-y-1 text-sm text-gray-700">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.address && <p>{personalInfo.address}</p>}
            </div>
          </div>
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-bold">
              {(personalInfo.fullName || personalInfo.firstName || "N")
                .charAt(0)
                .toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      {personalInfo.summary && (
        <div className="resume-section mb-8">
          <h2 className="text-xl font-bold text-blue-600 mb-4 border-b border-blue-200 pb-2">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">
            {personalInfo.summary}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          {/* Skills Section */}
          {skills && (
            <div className="resume-section mb-8">
              <h2 className="text-xl font-bold text-blue-600 mb-4 border-b border-blue-200 pb-2">
                Technical Skills
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {skills.split(",").map((skill, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 text-blue-800 px-3 py-2 rounded font-medium text-center"
                  >
                    {skill.trim() || "Skill Name"}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Section */}
          {educations.length > 0 && (
            <div className="resume-section mb-8">
              <h2 className="text-xl font-bold text-blue-600 mb-4 border-b border-blue-200 pb-2">
                Education
              </h2>
              {educations.map((edu, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {edu.degree || "Degree Name"}
                  </h3>
                  <p className="text-gray-700 font-medium mb-1">
                    {edu.college || edu.university || "University Name"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {edu.endDate || "Completion Year"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div>
          {/* Experience Section */}
          {experiences.length > 0 && (
            <div className="resume-section">
              <h2 className="text-xl font-bold text-blue-600 mb-4 border-b border-blue-200 pb-2">
                Work Experience
              </h2>
              {experiences.map((exp, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {exp.designation || "Job Title"}
                    </h3>
                    <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                      {exp.startDate || "Start Date"} -{" "}
                      {exp.endDate || "End Date"}
                    </span>
                  </div>
                  <p className="text-blue-600 font-semibold mb-2">
                    {exp.companyName || "Company Name"}
                  </p>
                  {exp.responsibilities && (
                    <p className="text-gray-700 leading-relaxed">
                      {exp.responsibilities}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CorporateTemplate;
