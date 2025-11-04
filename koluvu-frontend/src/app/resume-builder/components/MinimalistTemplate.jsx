import React from "react";
import { FaPhone, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

const MinimalistTemplate = ({ formData, photoUrl, resumeType }) => {
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
    "John Doe";

  return (
    <div className="resume-template minimalist-resume w-full max-w-4xl mx-auto bg-white flex shadow-lg">
      {/* Left Column - Gray Sidebar */}
      <div className="w-1/3 bg-gray-100 p-8">
        {/* Name */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{fullName}</h1>
          <div className="w-16 h-0.5 bg-gray-400"></div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          {personalInfo.phone && (
            <div className="flex items-center text-gray-700">
              <FaPhone className="mr-3 text-gray-500" size={14} />
              <span className="text-sm">{personalInfo.phone}</span>
            </div>
          )}
          {!personalInfo.phone && (
            <div className="flex items-center text-gray-700">
              <FaPhone className="mr-3 text-gray-500" size={14} />
              <span className="text-sm">+220-5000</span>
            </div>
          )}

          {personalInfo.email && (
            <div className="flex items-center text-gray-700">
              <FaEnvelope className="mr-3 text-gray-500" size={14} />
              <span className="text-sm break-all">{personalInfo.email}</span>
            </div>
          )}
          {!personalInfo.email && (
            <div className="flex items-center text-gray-700">
              <FaEnvelope className="mr-3 text-gray-500" size={14} />
              <span className="text-sm">imail@tmn</span>
            </div>
          )}

          {personalInfo.portfolio && (
            <div className="flex items-center text-gray-700">
              <FaLinkedin className="mr-3 text-gray-500" size={14} />
              <span className="text-sm break-all">
                {personalInfo.portfolio}
              </span>
            </div>
          )}
          {!personalInfo.portfolio && (
            <div className="flex items-center text-gray-700">
              <FaLinkedin className="mr-3 text-gray-500" size={14} />
              <span className="text-sm">linkedan/infrecot/ttrp/</span>
            </div>
          )}

          <div className="flex items-center text-gray-700">
            <FaGithub className="mr-3 text-gray-500" size={14} />
            <span className="text-sm">Github/gitHub</span>
          </div>
        </div>
      </div>

      {/* Right Column - Main Content */}
      <div className="w-2/3 p-8">
        {/* Summary Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-300 pb-2">
            SUMMARY
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">Company Name</h3>
                <p className="text-gray-600 text-sm">
                  {personalInfo.summary ||
                    personalInfo.careerObjective ||
                    "John Doe"}
                </p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>Jitr</div>
                <div>201/2022</div>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-900">Company Name</h3>
                <p className="text-gray-600 text-sm">Tirer Title</p>
                <p className="text-gray-600 text-sm">Orleuer GUPnare</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <div>Jitr</div>
                <div>271/2021</div>
              </div>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-300 pb-2">
            EXPERIENCE
          </h2>
          <div className="space-y-6">
            {experiences.length > 0 ? (
              experiences.map((exp, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {exp.companyName || "Company Name"}
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                    {exp.responsibilities ? (
                      exp.responsibilities
                        .split("\n")
                        .filter((item) => item.trim())
                        .map((item, idx) => <li key={idx}>{item.trim()}</li>)
                    ) : (
                      <li>
                        Cowelcet dolor sit, clerr the aneeebitno and frignd und
                        ceptend otognae sent ipit colure Yair maleweon
                      </li>
                    )}
                  </ul>
                  <div className="mt-2">
                    <h4 className="font-semibold text-gray-900">
                      {exp.designation || "Prakeech Station"}
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                      <li>
                        Comieslo dolor sbleeits inthel ussemeatung the
                        trudeeitics for hettogramly illoeleut doley and ooscalge
                      </li>
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Company Name
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                    <li>
                      Cowelcet dolor sit, clerr the aneeebitno and frignd und
                      ceptend otognae sent ipit colure Yair maleweon
                    </li>
                  </ul>
                  <div className="mt-2">
                    <h4 className="font-semibold text-gray-900">
                      Prakeech Station
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                      <li>
                        Comieslo dolor sbleeits inthel ussemeatung the
                        trudeeitics for hettogramly illoeleut doley and ooscalge
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-300 pb-2">
            SKILLS
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Frameworks</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                {skills ? (
                  skills
                    .split(",")
                    .map((skill, index) => <li key={index}>{skill.trim()}</li>)
                ) : (
                  <>
                    <li>Alemelam</li>
                    <li>Frameworks</li>
                    <li>Preheworke</li>
                    <li>Tools</li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <p className="text-gray-700 text-sm mb-2">
                Programming Languages / Occuetaints
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Frameworks</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-4">
                <li>Tools</li>
                <li>Desspationt incnidops</li>
                <li>Parts</li>
                <li>Sturt con</li>
                <li>Scupnattion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-300 pb-2">
            EDUCATION
          </h2>
          <div className="space-y-4">
            {educations.length > 0 ? (
              educations.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree || "Degree"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {edu.college || edu.university || "Secretrition Cun"}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>{edu.endDate || "Uniangh"}</div>
                    <div>291S7/2023</div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">Degree</h3>
                    <p className="text-gray-600 text-sm">Secretrition Cun</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>Uniangh</div>
                    <div>291S7/2023</div>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">Graduation</h3>
                    <p className="text-gray-600 text-sm">Graduation Date</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>Osten</div>
                    <div>30dorlion 2ate</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Additional sections for projects, internships, certifications */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-300 pb-2">
              PROJECTS
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {project.title || "Project Title"}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {project.description || "Project description"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {internships.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-300 pb-2">
              INTERNSHIPS
            </h2>
            <div className="space-y-4">
              {internships.map((internship, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {internship.position || "Position"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {internship.company || "Company Name"}
                  </p>
                  {internship.description && (
                    <p className="text-gray-700 text-sm mt-1">
                      {internship.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-300 pb-2">
              CERTIFICATIONS
            </h2>
            <div className="space-y-4">
              {certifications.map((cert, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {cert.name || "Certification Name"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {cert.issuer || "Issuing Organization"}
                  </p>
                  <p className="text-gray-500 text-xs">{cert.date || "Date"}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {strengths && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-4 border-b border-gray-300 pb-2">
              STRENGTHS
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">{strengths}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalistTemplate;
