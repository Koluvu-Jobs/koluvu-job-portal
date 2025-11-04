import React from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaGlobe,
  FaUser,
  FaBriefcase,
  FaUsers,
} from "react-icons/fa";

const AcademicTemplate = ({ formData, photoUrl, resumeType }) => {
  // Default values to prevent undefined errors
  const personalInfo = formData?.personal || {};
  const skills = formData?.skills || "";
  const educations = formData?.educations || [];
  const experiences = formData?.experiences || [];
  const projects = formData?.projects || [];
  const internships = formData?.internships || [];
  const certifications = formData?.certifications || [];
  const strengths = formData?.strengths || "";
  const languages = formData?.languages || "";

  // Combine first name and last name
  const fullName =
    personalInfo.fullName ||
    `${personalInfo.firstName || ""} ${personalInfo.lastName || ""}`.trim() ||
    "OLIVIA WILSON";

  return (
    <div className="resume-template academic-resume w-full max-w-4xl mx-auto bg-white shadow-lg">
      {/* Main Header Section */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-8">
        <div className="flex items-start gap-8">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="w-40 h-48 border-4 border-white shadow-lg overflow-hidden">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <FaUser className="text-gray-500 text-4xl" />
                </div>
              )}
            </div>
          </div>

          {/* Name and Title */}
          <div className="flex-grow">
            <h1 className="text-4xl font-bold text-gray-800 mb-2 tracking-wide">
              {fullName}
            </h1>
            <h2 className="text-xl text-gray-600 mb-6">
              {personalInfo.jobTitle ||
                personalInfo.designation ||
                "Graphics Designer"}
            </h2>

            {/* Profile Section */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <FaUser className="text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Profile</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {personalInfo.summary ||
                  personalInfo.careerObjective ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              {personalInfo.phone && (
                <div className="flex items-center">
                  <FaPhone className="text-gray-500 mr-2 text-xs" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-center">
                  <FaEnvelope className="text-gray-500 mr-2 text-xs" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.portfolio && (
                <div className="flex items-center">
                  <FaGlobe className="text-gray-500 mr-2 text-xs" />
                  <span className="break-all">{personalInfo.portfolio}</span>
                </div>
              )}
              {personalInfo.address && (
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-gray-500 mr-2 text-xs" />
                  <span>{personalInfo.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-1/3 bg-gray-100 p-6">
          {/* Education Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              Education
            </h3>
            {educations.length > 0 ? (
              educations.map((edu, index) => (
                <div key={index} className="mb-6">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    {edu.degree || "Bachelor of Design"}
                  </h4>
                  <p className="text-gray-600 text-sm mb-1">
                    {edu.college || edu.university || "Wardiere University"}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {edu.startDate || "2006"} - {edu.endDate || "2008"}
                  </p>
                </div>
              ))
            ) : (
              <>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    Bachelor of Design
                  </h4>
                  <p className="text-gray-600 text-sm mb-1">
                    Wardiere University
                  </p>
                  <p className="text-gray-500 text-xs">2006 - 2008</p>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">
                    Bachelor of Design
                  </h4>
                  <p className="text-gray-600 text-sm mb-1">
                    Wardiere University
                  </p>
                  <p className="text-gray-500 text-xs">2006 - 2008</p>
                </div>
              </>
            )}
          </div>

          {/* Expertise/Skills Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              Expertise
            </h3>
            {skills ? (
              <div className="space-y-2">
                {skills.split(",").map((skill, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    {skill.trim()}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-700">
                <div>Digital Marketing</div>
                <div>Branding</div>
                <div>Copywriting</div>
                <div>SEO</div>
              </div>
            )}
          </div>

          {/* Language Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              Language
            </h3>
            {languages ? (
              <div className="space-y-2">
                {languages.split(",").map((lang, index) => (
                  <div key={index} className="text-sm text-gray-700">
                    {lang.trim()}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-sm text-gray-700">
                <div>English</div>
                <div>French</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-2/3 p-6">
          {/* Work Experience Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <FaBriefcase className="text-gray-600 mr-3" />
              <h3 className="text-lg font-bold text-gray-800">
                Work Experience
              </h3>
            </div>

            {experiences.length > 0 ? (
              experiences.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">
                        {exp.companyName || "Ginyard International Co."}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {exp.designation || "Product Design Manager"}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>{exp.startDate || "2020"}</div>
                      <div>-</div>
                      <div>
                        {exp.currentlyWorking
                          ? "Present"
                          : exp.endDate || "2023"}
                      </div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {exp.responsibilities ? (
                      exp.responsibilities
                        .split("\n")
                        .filter((item) => item.trim())
                        .map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item.trim()}</span>
                          </li>
                        ))
                    ) : (
                      <>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Working with the wider development team.</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>
                            Manage website design, content, and SEO Marketing,
                            Branding and Logo Design
                          </span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <>
                {/* Sample work experiences */}
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">
                        Ginyard International Co.
                      </h4>
                      <p className="text-sm text-gray-600">
                        Product Design Manager
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>2020</div>
                      <div>-</div>
                      <div>2023</div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Working with the wider development team.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Manage website design, content, and SEO Marketing,
                        Branding and Logo Design
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">
                        Aronwai Industries
                      </h4>
                      <p className="text-sm text-gray-600">
                        Product Design Manager
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>2019</div>
                      <div>-</div>
                      <div>2020</div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Working with the wider development team.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Manage website design, content, and SEO Marketing,
                        Branding and Logo Design
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">
                        Ginyard International Co.
                      </h4>
                      <p className="text-sm text-gray-600">
                        Product Design Manager
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>2017</div>
                      <div>-</div>
                      <div>2019</div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Working with the wider development team.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Manage website design, content, and SEO Marketing,
                        Branding and Logo Design
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800 text-base">
                        Aronwai Industries
                      </h4>
                      <p className="text-sm text-gray-600">
                        Product Design Manager
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      <div>2017</div>
                      <div>-</div>
                      <div>2019</div>
                    </div>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Working with the wider development team.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>
                        Manage website design, content, and SEO Marketing,
                        Branding and Logo Design
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* References Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <FaUsers className="text-gray-600 mr-3" />
              <h3 className="text-lg font-bold text-gray-800">References</h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  Bailey Dupont
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  Wardiere Inc. / CEO
                </p>
                <div className="text-xs text-gray-700 space-y-1">
                  <div>
                    <strong>Phone:</strong> 123-456-7890
                  </div>
                  <div>
                    <strong>Email:</strong> hello@reallygreatsite.com
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 text-sm">
                  Harumi Kobayashi
                </h4>
                <p className="text-xs text-gray-600 mb-2">
                  Wardiere Inc. / CEO
                </p>
                <div className="text-xs text-gray-700 space-y-1">
                  <div>
                    <strong>Phone:</strong> 123-456-7890
                  </div>
                  <div>
                    <strong>Email:</strong> hello@reallygreatsite.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicTemplate;
