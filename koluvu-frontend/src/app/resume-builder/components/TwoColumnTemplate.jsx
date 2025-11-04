import React from "react";

const TwoColumnTemplate = ({ formData, photoUrl, resumeType }) => {
  // Default values to prevent undefined errors
  const personalInfo = formData?.personal || {};
  const skills = formData?.skills || "";
  const educations = formData?.educations || [];
  const experiences = formData?.experiences || [];
  const projects = formData?.projects || [];
  const internships = formData?.internships || [];
  const certifications = formData?.certifications || [];
  const strengths = formData?.strengths || "";

  // Combine first name and last name
  const fullName =
    personalInfo.fullName ||
    `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim() ||
    "JOHN DOE";

  return (
    <div className="resume-template two-column-resume max-w-4xl mx-auto bg-white shadow-lg border">
      <div className="grid grid-cols-3 min-h-screen">
        {/* Left Column - Main Content */}
        <div className="col-span-2 p-8 pr-4">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
              {fullName}
            </h1>
            <p className="text-lg text-gray-600 mb-1">
              {personalInfo.designation || "Senior Software Engineer"}
            </p>
            <p className="text-sm text-gray-500">
              {personalInfo.address ||
                personalInfo.city ||
                "Lorem Ipsum City, CA"}
            </p>
          </div>

          {/* Work Experience Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              WORK EXPERIENCE
            </h2>
            <hr className="border-gray-300 mb-6" />

            {experiences.length > 0 ? (
              experiences.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold text-gray-900 uppercase">
                      {exp.companyName || "COMPANY JOE"}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate || "Jollen Ipsum 2023"} -{" "}
                      {exp.endDate || "Lorem Ipsum 2023"}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    {exp.designation ||
                      "Lorem ipsum dolor labellē consectetly anty text"}
                  </div>
                  {exp.responsibilities && (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {exp.responsibilities
                        .split("\n")
                        .filter((item) => item.trim())
                        .map((item, idx) => (
                          <li key={idx}>{item.trim()}</li>
                        ))}
                    </ul>
                  )}
                  {!exp.responsibilities && (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>
                        Noke Im erm sect lores bea fast, sed dolor interdum
                        molluır, vitad wild eitmod licat sit and oumention.
                      </li>
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold text-gray-900 uppercase">
                      COMPANY JOE
                    </h3>
                    <span className="text-sm text-gray-600">
                      Jollen Ipsum 2023 - Lorem Ipsum 2023
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Lorem ipsum dolor labellē consectetly anty text
                  </div>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>
                      Noke Im erm sect lores bea fast, sed dolor interdum
                      molluır, vitad wild eitmod licat sit and oumention.
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-base font-bold text-gray-900 uppercase">
                      COMPANY JOE
                    </h3>
                    <span className="text-sm text-gray-600">
                      Jollen Ipsum 2025 - Lorem Ipsum 2025
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    Lorem ipsum dolor labellē consectetly anty text
                  </div>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>
                      Noke Im erm sect lores bea fast, sed dolor interdum
                      molluır, vitad wild eitmod licat sit and oumention.
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Education Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
              EDUCATION
            </h2>
            <hr className="border-gray-300 mb-6" />

            {educations.length > 0 ? (
              educations.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        {edu.degree || "Jorem Iollen 2018"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {edu.college ||
                          edu.university ||
                          "Lorem Ipsum Ity and veniam aestre"}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {edu.endDate || "2018"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        Jorem Iollen 2018
                      </h3>
                      <p className="text-sm text-gray-600">
                        Lorem Ipsum Ity and veniam aestre
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">2018</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-gray-900">
                        UNIVE SITR 2026
                      </h3>
                      <p className="text-sm text-gray-600">Jorem Iollen 2018</p>
                      <p className="text-sm text-gray-600">
                        Lorem Ipsum Ity and veniam aestre
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">2026</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Additional sections for projects, internships, certifications if needed */}
          {projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
                PROJECTS
              </h2>
              <hr className="border-gray-300 mb-6" />
              {projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-base font-bold text-gray-900">
                    {project.title || "Project Title"}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {project.description || "Project description"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Sidebar with teal accent */}
        <div className="col-span-1 bg-white relative">
          {/* Teal accent line */}
          <div className="absolute left-0 top-0 w-1 h-full bg-teal-400"></div>

          <div className="p-8 pl-12">
            {/* Name section for right column */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
                {fullName}
              </h1>
              <p className="text-base text-gray-600">
                {personalInfo.designation || "Senior Software Engineer"}
              </p>
            </div>

            {/* Contact Information */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                CONTACT INFORMATION
              </h2>

              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">
                    {personalInfo.phone || "Loker-sme.com"}
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">
                    {personalInfo.email || "Linkeni emnonie.com"}
                  </span>
                </div>

                <div className="flex items-center">
                  <div className="w-6 h-6 bg-teal-400 rounded-full flex items-center justify-center mr-3">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-700">
                    {personalInfo.portfolio ||
                      personalInfo.website ||
                      "www.enmeake.com"}
                  </span>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                SKILLS
              </h2>

              <div className="space-y-2">
                {skills ? (
                  skills.split(",").map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      <span className="text-sm text-gray-700">
                        {skill.trim()}
                      </span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      <span className="text-sm text-gray-700">
                        Programming Languages
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      <span className="text-sm text-gray-700">Tools</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                      <span className="text-sm text-gray-700">Frameworks</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Additional sections if needed */}
            {strengths && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">
                  STRENGTHS
                </h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {strengths}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoColumnTemplate;
