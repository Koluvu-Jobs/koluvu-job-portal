import React from "react";
import { FaPhone, FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

const CreativeTemplate = ({ formData, photoUrl, resumeType }) => {
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
    <div className="resume-template creative-resume w-full max-w-4xl mx-auto bg-white relative p-4">
      {/* Thick Creative Border Frame */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-lg shadow-2xl border-8 border-gray-600"></div>
      <div className="absolute inset-4 bg-white rounded-lg shadow-inner border-4 border-gray-300"></div>

      {/* Main Content Container with Subtle Pastel Styling */}
      <div className="relative z-10 flex min-h-screen rounded-lg overflow-hidden shadow-xl border-8 border-slate-200 bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Left Column - Subtle Pastel Gradient Sidebar */}
        <div className="w-1/3 bg-gradient-to-b from-slate-100 via-blue-100 to-purple-100 p-8 border-r-8 border-slate-200 relative">
          {/* Subtle decorative accent border */}
          <div className="absolute left-0 top-0 w-3 h-full bg-gradient-to-b from-blue-200 via-purple-200 to-pink-200 border-r-2 border-white shadow-lg"></div>

          {/* Name Section with Subtle Text */}
          <div className="mb-12 ml-4">
            <h1 className="text-3xl font-bold text-slate-700 mb-4 drop-shadow-sm">
              {fullName}
            </h1>
            <div className="w-16 h-3 bg-gradient-to-r from-blue-300 to-purple-300 mb-8 border-2 border-slate-300 rounded shadow-md"></div>
          </div>

          {/* Contact Information with Subtle Pastel Borders */}
          <div className="space-y-6 ml-4">
            <div className="flex items-center text-slate-700 p-3 border-l-8 border-green-200 bg-gradient-to-r from-green-50 to-blue-50 rounded-r-lg shadow-sm transform hover:scale-102 transition-all">
              <FaPhone className="mr-4 text-slate-600" size={16} />
              <span className="text-base font-medium">
                {personalInfo.phone || "+220-5000"}
              </span>
            </div>

            <div className="flex items-center text-slate-700 p-3 border-l-8 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-r-lg shadow-sm transform hover:scale-102 transition-all">
              <FaEnvelope className="mr-4 text-slate-600" size={16} />
              <span className="text-base font-medium break-all">
                {personalInfo.email || "imail@tmn"}
              </span>
            </div>

            <div className="flex items-center text-slate-700 p-3 border-l-8 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 rounded-r-lg shadow-sm transform hover:scale-102 transition-all">
              <FaLinkedin className="mr-4 text-slate-600" size={16} />
              <span className="text-base font-medium break-all">
                {personalInfo.portfolio || "linkedan/infrecot/ttrp/"}
              </span>
            </div>

            <div className="flex items-center text-slate-700 p-3 border-l-8 border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50 rounded-r-lg shadow-sm transform hover:scale-102 transition-all">
              <FaGithub className="mr-4 text-slate-600" size={16} />
              <span className="text-base font-medium">Github/gitHub</span>
            </div>
          </div>
        </div>
        {/* Right Column - Subtle Pastel Main Content with Soft Decorative Borders */}
        <div className="w-2/3 p-8 bg-gradient-to-br from-slate-50 to-blue-50 relative border-l-8 border-slate-200">
          {/* Subtle decorative corner borders */}
          <div className="absolute top-0 right-0 w-24 h-24 border-8 border-blue-100 border-l-0 border-b-0 rounded-tr-2xl bg-gradient-to-bl from-blue-50 to-purple-50 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 border-8 border-purple-100 border-r-0 border-t-0 rounded-bl-2xl bg-gradient-to-tr from-purple-50 to-pink-50 opacity-60"></div>

          {/* Summary Section with Subtle Pastel Border */}
          <div className="mb-12 border-4 border-emerald-200 rounded-lg p-6 shadow-md bg-gradient-to-r from-emerald-50 to-teal-50">
            <h2 className="text-2xl font-bold text-emerald-600 mb-6 border-b-4 border-emerald-300 pb-3 inline-block">
              SUMMARY
            </h2>
            <div className="w-full h-2 bg-gradient-to-r from-emerald-200 to-teal-200 mb-8 border-t-2 border-emerald-300 rounded shadow-sm"></div>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-black text-lg mb-1">
                    Company Name
                  </h3>
                  <p className="text-gray-600 text-base">
                    {personalInfo.summary ||
                      personalInfo.careerObjective ||
                      "John Doe"}
                  </p>
                </div>
                <div className="text-right ml-8">
                  <div className="text-gray-600 text-base font-semibold">
                    Jitr
                  </div>
                  <div className="text-gray-600 text-base">201/2022</div>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-black text-lg mb-1">
                    Company Name
                  </h3>
                  <p className="text-gray-600 text-base">Tirer Title</p>
                  <p className="text-gray-600 text-base">Orleuer GUPhare</p>
                </div>
                <div className="text-right ml-8">
                  <div className="text-gray-600 text-base font-semibold">
                    Jitr
                  </div>
                  <div className="text-gray-600 text-base">271/2021</div>
                </div>
              </div>
            </div>
          </div>

          {/* Experience Section with Subtle Pastel Border */}
          <div className="mb-12 border-4 border-violet-200 rounded-lg p-6 shadow-md bg-gradient-to-r from-violet-50 to-purple-50">
            <h2 className="text-2xl font-bold text-violet-600 mb-6 border-b-4 border-violet-300 pb-3 inline-block">
              EXPERIENCE
            </h2>
            <div className="w-full h-2 bg-gradient-to-r from-violet-200 to-purple-200 mb-8 border-t-2 border-violet-300 rounded shadow-sm"></div>

            <div className="space-y-8">
              {experiences.length > 0 ? (
                experiences.map((exp, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-black text-lg mb-3">
                      {exp.companyName || "Company Name"}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-base ml-4">
                      {exp.responsibilities ? (
                        exp.responsibilities
                          .split("\n")
                          .filter((item) => item.trim())
                          .map((item, idx) => <li key={idx}>{item.trim()}</li>)
                      ) : (
                        <li>
                          Cowelcet dolor sit, clerr the aneeebitno and frignd
                          und ceptend otognae sent ipit colure Yair maleweon
                        </li>
                      )}
                    </ul>

                    <div className="mt-4">
                      <h4 className="font-bold text-black text-lg mb-2">
                        {exp.designation || "Prakeech Station"}
                      </h4>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 text-base ml-4">
                        <li>
                          Comieslo dolor sbleeits inthel ussemeatung the
                          trudeeitics for hettogramly illoeleut doley and
                          ooscalge
                        </li>
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <h3 className="font-bold text-black text-lg mb-3">
                    Company Name
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-base ml-4">
                    <li>
                      Cowelcet dolor sit, clerr the aneeebitno and frignd und
                      ceptend otognae sent ipit colure Yair maleweon
                    </li>
                  </ul>

                  <div className="mt-4">
                    <h4 className="font-bold text-black text-lg mb-2">
                      Prakeech Station
                    </h4>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 text-base ml-4">
                      <li>
                        Comieslo dolor sbleeits inthel ussemeatung the
                        trudeeitics for hettogramly illoeleut doley and ooscalge
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Skills Section with Subtle Pastel Border */}
          <div className="mb-12 border-4 border-rose-200 rounded-lg p-6 shadow-md bg-gradient-to-r from-rose-50 to-pink-50">
            <h2 className="text-2xl font-bold text-rose-600 mb-6 border-b-4 border-rose-300 pb-3 inline-block">
              SKILLS
            </h2>
            <div className="w-full h-2 bg-gradient-to-r from-rose-200 to-pink-200 mb-8 border-t-2 border-rose-300 rounded shadow-sm"></div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-rose-600 text-lg mb-3">
                  Frameworks
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills ? (
                    skills
                      .split(",")
                      .slice(0, 4)
                      .map((skill, index) => {
                        const colors = [
                          "bg-blue-200 text-blue-700",
                          "bg-green-200 text-green-700",
                          "bg-purple-200 text-purple-700",
                          "bg-orange-200 text-orange-700",
                        ];
                        return (
                          <span
                            key={index}
                            className={`${
                              colors[index % colors.length]
                            } px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-gray-200`}
                          >
                            {skill.trim()}
                          </span>
                        );
                      })
                  ) : (
                    <>
                      <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                        Alemelam
                      </span>
                      <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                        Frameworks
                      </span>
                      <span className="bg-purple-200 text-purple-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                        Preheworke
                      </span>
                      <span className="bg-orange-200 text-orange-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                        Tools
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <p className="text-rose-600 text-base font-semibold mb-4">
                  Programming Languages / Occuetaints
                </p>
              </div>

              <div>
                <h3 className="font-bold text-rose-600 text-lg mb-3">
                  Additional Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                    Tools
                  </span>
                  <span className="bg-pink-200 text-pink-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                    Development
                  </span>
                  <span className="bg-teal-200 text-teal-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                    Parts
                  </span>
                  <span className="bg-red-200 text-red-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                    Integration
                  </span>
                  <span className="bg-yellow-200 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm border border-gray-200">
                    Analytics
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Education Section with Subtle Pastel Border */}
          <div className="mb-8 border-4 border-amber-200 rounded-lg p-6 shadow-md bg-gradient-to-r from-amber-50 to-orange-50">
            <h2 className="text-2xl font-bold text-amber-600 mb-6 border-b-4 border-amber-300 pb-3 inline-block">
              EDUCATION
            </h2>
            <div className="w-full h-2 bg-gradient-to-r from-amber-400 to-orange-400 mb-8 border-t-2 border-amber-500 rounded shadow-sm"></div>

            <div className="space-y-6">
              {educations.length > 0 ? (
                educations.map((edu, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-black text-lg mb-1">
                        {edu.degree || "Degree"}
                      </h3>
                      <p className="text-gray-600 text-base">
                        {edu.college || edu.university || "Secretrition Cun"}
                      </p>
                    </div>
                    <div className="text-right ml-8">
                      <div className="text-gray-600 text-base font-semibold">
                        {edu.endDate || "Uniangh"}
                      </div>
                      <div className="text-gray-600 text-base">291S7/2023</div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-black text-lg mb-1">
                        Degree
                      </h3>
                      <p className="text-gray-600 text-base">
                        Secretrition Cun
                      </p>
                    </div>
                    <div className="text-right ml-8">
                      <div className="text-gray-600 text-base font-semibold">
                        Uniangh
                      </div>
                      <div className="text-gray-600 text-base">291S7/2023</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-black text-lg mb-1">
                        Graduation
                      </h3>
                      <p className="text-gray-600 text-base">Graduation Date</p>
                    </div>
                    <div className="text-right ml-8">
                      <div className="text-gray-600 text-base font-semibold">
                        Osten
                      </div>
                      <div className="text-gray-600 text-base">
                        30dorlion 2ate
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional sections for projects, internships, certifications */}
          {projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-6">PROJECTS</h2>
              <div className="w-full h-px bg-gray-300 mb-8"></div>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-black text-lg mb-1">
                      {project.title || "Project Title"}
                    </h3>
                    <p className="text-gray-700 text-base">
                      {project.description || "Project description"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {internships.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-6">
                INTERNSHIPS
              </h2>
              <div className="w-full h-px bg-gray-300 mb-8"></div>
              <div className="space-y-4">
                {internships.map((internship, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-black text-lg mb-1">
                      {internship.position || "Position"}
                    </h3>
                    <p className="text-gray-600 text-base">
                      {internship.company || "Company Name"}
                    </p>
                    {internship.description && (
                      <p className="text-gray-700 text-base mt-1">
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
              <h2 className="text-2xl font-bold text-black mb-6">
                CERTIFICATIONS
              </h2>
              <div className="w-full h-px bg-gray-300 mb-8"></div>
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-black text-lg mb-1">
                      {cert.name || "Certification Name"}
                    </h3>
                    <p className="text-gray-600 text-base">
                      {cert.issuer || "Issuing Organization"}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {cert.date || "Date"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {strengths && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-6">STRENGTHS</h2>
              <div className="w-full h-px bg-gray-300 mb-8"></div>
              <p className="text-gray-700 text-base leading-relaxed">
                {strengths}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;
