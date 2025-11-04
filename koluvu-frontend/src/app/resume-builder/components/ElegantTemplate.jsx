import React from "react";

const ElegantTemplate = ({ formData, photoUrl, resumeType }) => {
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
    "ELEGANT";

  return (
    <div className="resume-template elegant-resume max-w-4xl mx-auto bg-white p-12 shadow-lg">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-[0.3em] uppercase">
          ELEGANT
        </h1>
        <div className="w-full h-px bg-gray-400 mb-8"></div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-5 gap-12">
        {/* Left Column - Contact */}
        <div className="col-span-2">
          {/* Contact Section */}
          <div className="mb-10">
            <h2 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              CONTACT
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                {personalInfo.address ||
                  personalInfo.city ||
                  "1234 Your City, ST 12345"}
              </p>
              <p>{personalInfo.phone || "(123) 436-7880"}</p>
              <p>{personalInfo.email || "elegant@example.com"}</p>
            </div>
          </div>

          {/* Work Experience Section */}
          <div className="mb-10">
            <h2 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              WORK EXPERIENCE
            </h2>

            {experiences.length > 0 ? (
              experiences.map((exp, index) => (
                <div key={index} className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase">
                      {exp.designation || "FINANCIAL ANALYST"}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate || "2018"} - {exp.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {exp.companyName || "Company A"}
                  </p>
                  {exp.responsibilities ? (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {exp.responsibilities
                        .split("\n")
                        .filter((item) => item.trim())
                        .map((item, idx) => (
                          <li key={idx}>{item.trim()}</li>
                        ))}
                    </ul>
                  ) : (
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>
                        Analyzed financial data to identify trends and
                        opportunities.
                      </li>
                      <li>
                        Prepared detailed financial reports for senior
                        management.
                      </li>
                      <li>
                        Developed and managed budgets, ensuring alignment with
                        company goals.
                      </li>
                      <li>
                        Conducted variance analysis and provided
                        recommendations.
                      </li>
                      <li>
                        Collaborated with cross-functional teams to improve
                        financial processes.
                      </li>
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase">
                      FINANCIAL ANALYST
                    </h3>
                    <span className="text-sm text-gray-600">
                      2018 - Present
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">Company A</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>
                      Analyzed financial data to identify trends and
                      opportunities.
                    </li>
                    <li>
                      Prepared detailed financial reports for senior management.
                    </li>
                    <li>
                      Developed and managed budgets, ensuring alignment with
                      company goals.
                    </li>
                    <li>
                      Conducted variance analysis and provided recommendations.
                    </li>
                    <li>
                      Collaborated with cross-functional teams to improve
                      financial processes.
                    </li>
                  </ul>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase">
                      SENIOR ACCOUNTANT
                    </h3>
                    <span className="text-sm text-gray-600">2014 - 2018</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">Company B</p>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    <li>
                      Developed and managed budgets, ensuring alignment with
                      company goals.
                    </li>
                    <li>
                      Conducted variance analysis and provided recommendations.
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Education Section */}
          <div className="mb-10">
            <h2 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              EDUCATION
            </h2>
            <div className="w-full h-px bg-gray-400 mb-6"></div>

            {educations.length > 0 ? (
              educations.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 uppercase">
                        {edu.degree || "BACHELOR OF SCIENCE IN FINANCE"}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {edu.college ||
                          edu.university ||
                          "University of Your City"}
                      </p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {edu.startDate || "2010"} - {edu.endDate || "2014"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 uppercase">
                      BACHELOR OF SCIENCE IN FINANCE
                    </h3>
                    <p className="text-sm text-gray-700">
                      University of Your City
                    </p>
                  </div>
                  <span className="text-sm text-gray-600">2010 - 2014</span>
                </div>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="mb-10">
            <h2 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              SKILLS
            </h2>

            {skills ? (
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                {skills.split(",").map((skill, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-1 h-1 bg-gray-600 rounded-full mr-3"></span>
                    <span>{skill.trim()}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
                <div className="flex items-center">
                  <span className="w-1 h-1 bg-gray-600 rounded-full mr-3"></span>
                  <span>Financial Modeling</span>
                </div>
                <div className="flex items-center">
                  <span className="w-1 h-1 bg-gray-600 rounded-full mr-3"></span>
                  <span>Forecasting</span>
                </div>
                <div className="flex items-center">
                  <span className="w-1 h-1 bg-gray-600 rounded-full mr-3"></span>
                  <span>Budgeting</span>
                </div>
                <div className="flex items-center">
                  <span className="w-1 h-1 bg-gray-600 rounded-full mr-3"></span>
                  <span>Data Analysis</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Professional Summary */}
        <div className="col-span-3">
          <div className="mb-10">
            <h2 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">
              PROFESSIONAL SUMMARY
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed">
              {personalInfo.summary ||
                personalInfo.careerObjective ||
                "Resourceful finance professional with over 10 years of experience in financial analysis, budgeting, and reporting. Proven track record of delivering insights and recommendations that drive business growth."}
            </p>
          </div>

          {/* Additional sections for projects, internships, certifications if available */}
          {projects.length > 0 && (
            <div className="mb-10">
              <h2 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                PROJECTS
              </h2>
              <div className="w-full h-px bg-gray-400 mb-6"></div>
              {projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase mb-2">
                    {project.title || "Project Title"}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {project.description || "Project description"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {internships.length > 0 && (
            <div className="mb-10">
              <h2 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                INTERNSHIPS
              </h2>
              <div className="w-full h-px bg-gray-400 mb-6"></div>
              {internships.map((internship, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase">
                      {internship.position || "Position"}
                    </h3>
                    <span className="text-sm text-gray-600">
                      {internship.duration || "Duration"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {internship.company || "Company Name"}
                  </p>
                  {internship.description && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {internship.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div className="mb-10">
              <h2 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                CERTIFICATIONS
              </h2>
              <div className="w-full h-px bg-gray-400 mb-6"></div>
              {certifications.map((cert, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase">
                    {cert.name || "Certification Name"}
                  </h3>
                  <p className="text-sm text-gray-700">
                    {cert.issuer || "Issuing Organization"}
                  </p>
                  <p className="text-sm text-gray-600">{cert.date || "Date"}</p>
                </div>
              ))}
            </div>
          )}

          {strengths && (
            <div className="mb-10">
              <h2 className="text-base font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                STRENGTHS
              </h2>
              <div className="w-full h-px bg-gray-400 mb-6"></div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {strengths}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ElegantTemplate;
