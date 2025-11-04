import React from "react";

const BoldTemplate = ({ formData, photoUrl, resumeType }) => {
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
    "Lato Black";

  return (
    <div className="resume-template bold-resume w-full max-w-4xl mx-auto bg-white shadow-lg relative overflow-hidden">
      {/* Colorful Geometric Header */}
      <div className="relative h-32">
        {/* Blue section */}
        <div className="absolute top-0 left-0 w-3/5 h-full bg-blue-500"></div>
        {/* Pink section */}
        <div className="absolute top-0 right-0 w-2/5 h-full bg-pink-500"></div>
        {/* White overlay sections */}
        <div className="absolute top-4 left-4 w-48 h-12 bg-white"></div>
        <div className="absolute top-4 right-16 w-32 h-8 bg-white"></div>

        {/* Logo/Brand */}
        <div className="absolute top-6 left-6 flex items-center">
          <div className="w-8 h-8 bg-orange-400 rounded-full mr-2 flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">Montserrat</div>
            <div className="text-xs text-gray-600">ODUM MENG</div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Two Columns */}
      <div className="flex p-8 gap-8">
        {/* Left Column */}
        <div className="w-2/3">
          {/* Name and Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              {fullName}
            </h1>
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              {personalInfo.jobTitle || personalInfo.designation || "Marketing"}
            </h2>
            <div className="w-16 h-1 bg-orange-500"></div>
          </div>

          {/* Professional Summary */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Professional Summary
            </h3>
            <div className="w-full h-0.5 bg-gray-300 mb-4"></div>
            <p className="text-gray-700 leading-relaxed text-sm">
              {personalInfo.summary ||
                personalInfo.careerObjective ||
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
            </p>
          </div>

          {/* Work Experience */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Work Experience
            </h3>
            <div className="w-full h-0.5 bg-gray-300 mb-4"></div>
            {experiences.length > 0 ? (
              experiences.map((exp, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-bold text-gray-900 text-base mb-1">
                    {exp.designation || "Lato Black"}
                  </h4>
                  <p className="text-gray-700 text-sm mb-2">
                    {exp.responsibilities ||
                      "Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod tempor."}
                  </p>
                  <p className="font-bold text-gray-900 text-sm mb-1">
                    {exp.companyName || "Roboto"}
                  </p>
                  <p className="text-gray-700 text-sm mb-3">
                    Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod
                    tempor incididunt.
                  </p>
                </div>
              ))
            ) : (
              <div>
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 text-base mb-1">
                    Lato Black
                  </h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod
                    tempor.
                  </p>
                  <h4 className="font-bold text-gray-900 text-base mb-1">
                    Roboto
                  </h4>
                  <p className="text-gray-700 text-sm mb-3">
                    Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod
                    tempor incididunt.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Worksation */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Worksation</h3>
            <div className="w-full h-0.5 bg-gray-300 mb-4"></div>
            <div className="mb-4">
              <h4 className="font-bold text-gray-900 text-base mb-1">
                Open Sans
              </h4>
              <p className="text-gray-700 text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>

          {/* Education */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Education</h3>
            <div className="w-full h-0.5 bg-gray-300 mb-4"></div>
            {educations.length > 0 ? (
              educations.map((edu, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-bold text-gray-900 text-base mb-1">
                    {edu.college || edu.university || "Roboto"}
                  </h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod
                    tempor.
                  </p>
                </div>
              ))
            ) : (
              <div>
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 text-base mb-1">
                    Roboto
                  </h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod
                    tempor.
                  </p>
                </div>
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 text-base mb-1">
                    Mortnor
                  </h4>
                  <p className="text-gray-700 text-sm mb-2">
                    Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod
                    tempor.
                  </p>
                </div>
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 text-base mb-1">
                    Wehause
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod
                    tempor.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="w-1/3 space-y-6">
          {/* Contact Information */}
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {fullName}
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {!personalInfo.phone && <div>001 2223 7500</div>}
              {personalInfo.portfolio && <div>{personalInfo.portfolio}</div>}
              {!personalInfo.portfolio && <div>your.see.com</div>}
            </div>

            {/* Social Icons */}
            <div className="flex justify-end space-x-2 mt-3">
              <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-xs">📞</span>
              </div>
              <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-xs">📧</span>
              </div>
              <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-xs">💼</span>
              </div>
              <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-xs">🔗</span>
              </div>
            </div>
          </div>

          {/* Chart/Graph Section */}
          <div className="bg-gray-50 p-4 rounded">
            <div className="flex items-end justify-center space-x-1 h-24">
              <div className="bg-cyan-400 w-3 h-8"></div>
              <div className="bg-blue-500 w-3 h-12"></div>
              <div className="bg-green-500 w-3 h-16"></div>
              <div className="bg-yellow-500 w-3 h-10"></div>
              <div className="bg-orange-500 w-3 h-14"></div>
              <div className="bg-red-500 w-3 h-18"></div>
              <div className="bg-purple-500 w-3 h-20"></div>
              <div className="bg-pink-500 w-3 h-24"></div>
            </div>
            <div className="flex justify-center text-xs text-gray-500 mt-2 space-x-1">
              <span>19</span>
              <span>21</span>
              <span>23</span>
              <span>24</span>
              <span>25</span>
              <span>26</span>
              <span>27</span>
            </div>
          </div>

          {/* Skills Tags */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                Open
              </div>
              <div className="text-xs text-gray-600 ml-2">
                Lorem ipsum dolor sit amet, adipiscing elit sed do eiusmod
                tempor.
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                Rocata
              </div>
              <div className="text-xs text-gray-600 ml-2">
                Lorem ipsum dolor sit amet adipiscing elit sed do eiusmod
                tempor.
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                Neboron
              </div>
              <div className="text-xs text-gray-600 ml-2">
                Lorem ipsum dolor sit amet adipiscing elit sed do eiusmod
                tempor.
              </div>
            </div>
          </div>

          {/* Skills Badges */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">Skills</h3>
            <div className="flex gap-2 mb-4">
              {skills ? (
                skills
                  .split(",")
                  .slice(0, 3)
                  .map((skill, index) => {
                    const colors = [
                      "bg-purple-500",
                      "bg-green-500",
                      "bg-orange-500",
                    ];
                    return (
                      <div
                        key={index}
                        className={`${
                          colors[index % 3]
                        } text-white px-3 py-2 rounded text-xs font-bold text-center flex-1`}
                      >
                        {skill.trim() || "Skill"}
                      </div>
                    );
                  })
              ) : (
                <>
                  <div className="bg-purple-500 text-white px-3 py-2 rounded text-xs font-bold text-center flex-1">
                    Skill
                  </div>
                  <div className="bg-green-500 text-white px-3 py-2 rounded text-xs font-bold text-center flex-1">
                    Skill
                  </div>
                  <div className="bg-orange-500 text-white px-3 py-2 rounded text-xs font-bold text-center flex-1">
                    Skill
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Awards/Achievement */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Awards/Achievement
            </h3>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 leading-relaxed">
                {strengths ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
              </p>
            </div>
          </div>

          {/* Additional sections for projects, internships, certifications */}
          {projects.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Projects</h3>
              {projects.slice(0, 2).map((project, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded mb-2">
                  <h4 className="font-bold text-sm text-gray-900 mb-1">
                    {project.title || "Project Title"}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {project.description || "Project description here..."}
                  </p>
                </div>
              ))}
            </div>
          )}

          {internships.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Internships
              </h3>
              {internships.slice(0, 2).map((internship, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded mb-2">
                  <h4 className="font-bold text-sm text-gray-900 mb-1">
                    {internship.position || "Position"}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {internship.company || "Company Name"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Certifications
              </h3>
              {certifications.slice(0, 2).map((cert, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded mb-2">
                  <h4 className="font-bold text-sm text-gray-900 mb-1">
                    {cert.name || "Certification Name"}
                  </h4>
                  <p className="text-xs text-gray-600">
                    {cert.issuer || "Issuing Organization"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom colored sections */}
      <div className="absolute bottom-0 left-0 w-1/4 h-8 bg-green-500"></div>
      <div className="absolute bottom-0 left-1/4 w-3/4 h-8 bg-orange-500"></div>
    </div>
  );
};

export default BoldTemplate;
