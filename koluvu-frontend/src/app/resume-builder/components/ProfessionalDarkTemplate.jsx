import React from "react";
import { FaPhone, FaEnvelope, FaLinkedin, FaGlobe } from "react-icons/fa";

const ProfessionalDarkTemplate = ({ formData, photoUrl, resumeType }) => {
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
    "NAME";

  return (
    <div className="resume-template professional-dark-resume w-full max-w-4xl mx-auto bg-gray-800 text-white">
      {/* Top Section */}
      <div className="flex">
        {/* Left Side - Name and Contact */}
        <div className="w-1/2 bg-gray-800 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 border-b-2 border-orange-400 pb-2 inline-block">
              {fullName}
            </h1>
            <div className="text-orange-400 text-lg font-semibold mt-4">
              +003 50000
            </div>
            <div className="text-gray-300">
              {personalInfo.jobTitle ||
                personalInfo.designation ||
                "Your Next Name"}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            {personalInfo.phone && (
              <div className="flex items-center text-gray-300">
                <FaPhone className="text-orange-400 mr-3" size={16} />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {!personalInfo.phone && (
              <div className="flex items-center text-gray-300">
                <FaPhone className="text-orange-400 mr-3" size={16} />
                <div>
                  <div>+221 70000</div>
                  <div>+253 70000</div>
                </div>
              </div>
            )}

            {personalInfo.email && (
              <div className="flex items-center text-gray-300">
                <FaEnvelope className="text-orange-400 mr-3" size={16} />
                <span className="break-all">{personalInfo.email}</span>
              </div>
            )}
            {!personalInfo.email && (
              <div className="flex items-center text-gray-300">
                <FaEnvelope className="text-orange-400 mr-3" size={16} />
                <span>Linkedoma uttrol</span>
              </div>
            )}

            {personalInfo.portfolio && (
              <div className="flex items-center text-gray-300">
                <FaGlobe className="text-orange-400 mr-3" size={16} />
                <span className="break-all">{personalInfo.portfolio}</span>
              </div>
            )}
            {!personalInfo.portfolio && (
              <div className="flex items-center text-gray-300">
                <FaGlobe className="text-orange-400 mr-3" size={16} />
                <div>
                  <div>Optional website</div>
                  <div>Website</div>
                </div>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-4 border-b-2 border-orange-400 pb-2 inline-block">
              SKILLS
            </h2>
            <div className="space-y-2">
              {skills ? (
                skills.split(",").map((skill, index) => {
                  const colors = [
                    "bg-orange-400",
                    "bg-orange-500",
                    "bg-orange-600",
                    "bg-yellow-500",
                  ];
                  return (
                    <div key={index} className="flex items-center">
                      <div
                        className={`w-3 h-3 ${
                          colors[index % colors.length]
                        } mr-3`}
                      ></div>
                      <span className="text-gray-300">{skill.trim()}</span>
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-400 mr-3"></div>
                    <span className="text-gray-300">Mexicane</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 mr-3"></div>
                    <span className="text-gray-300">Worlde</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-600 mr-3"></div>
                    <span className="text-gray-300">Creanalitee</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 mr-3"></div>
                    <span className="text-gray-300">Geeonite</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Summary/Profile */}
        <div className="w-1/2 bg-gray-800 p-8 border-l border-gray-600">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 border-b-2 border-orange-400 pb-2 inline-block">
              SUMMARY/PROFILE
            </h2>
            <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
              <p>
                {personalInfo.summary ||
                  personalInfo.careerObjective ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris dolore tellgit ut enim aliquip."}
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
                eiusmod lorem volum dolorum come fugitque dolur quiti
                dispilocquie.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
                eiusmod lorem dolorum come fugitque manus dolur quiti
                dispilocquie.
              </p>
            </div>
          </div>

          {/* Experience Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b-2 border-orange-400 pb-2 inline-block">
              EXPERIENCE
            </h2>
            <div className="text-gray-300 text-sm leading-relaxed">
              {experiences.length > 0 ? (
                experiences
                  .slice(0, 1)
                  .map((exp, index) => (
                    <p key={index}>
                      {exp.responsibilities ||
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ipsum lorem volum dolorum come furique tisaure quiti dispilocquia."}
                    </p>
                  ))
              ) : (
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod ipsum lorem volum dolorum come furique tisaure
                  quiti dispilocquia.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex">
        {/* Left Side - Awards, Technical Proficiencies */}
        <div className="w-1/2 bg-gray-800 p-8">
          {/* Awards/Certifications Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 border-b-2 border-orange-400 pb-2 inline-block">
              AWARDS/CERTIFICATIONS
            </h2>
            <div className="text-gray-300 text-sm leading-relaxed">
              {certifications.length > 0 ? (
                <p>
                  {certifications[0].name ||
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit cum coniqicuing elit sede micommiment carre sed quam ex nihil est molestias."}
                </p>
              ) : (
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit cum
                  coniqicuing elit sede micommiment carre sed quam ex nihil est
                  molestias.
                </p>
              )}
            </div>
          </div>

          {/* Technical Proficiencies Section */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4 border-b-2 border-orange-400 pb-2 inline-block">
              TECHNICAL PROFICIENCIES
            </h2>
            <div className="space-y-4">
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-3 h-3 bg-orange-400 mr-3 mt-2 flex-shrink-0"></div>
                    <div className="text-gray-300 text-sm">
                      <div className="font-semibold mb-1">
                        {project.title || "Lorem ipsum dolor titecoce"}
                      </div>
                      <div>
                        {project.description || "exercitation ullam dolorem"}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-orange-400 mr-3 mt-2 flex-shrink-0"></div>
                    <div className="text-gray-300 text-sm">
                      <div className="font-semibold mb-1">
                        Lorem ipsum dolor titecoce
                      </div>
                      <div>exercitation ullam dolorem</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-orange-400 mr-3 mt-2 flex-shrink-0"></div>
                    <div className="text-gray-300 text-sm">
                      <div className="font-semibold mb-1">
                        Operd calne tomslinto clogue
                      </div>
                      <div>dui pinnis cruue</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-orange-400 mr-3 mt-2 flex-shrink-0"></div>
                    <div className="text-gray-300 text-sm">
                      <div className="font-semibold mb-1">
                        Open ipsum dorcolouretmius
                      </div>
                      <div>aliquie</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-orange-400 mr-3 mt-2 flex-shrink-0"></div>
                    <div className="text-gray-300 text-sm">
                      <div className="font-semibold mb-1">
                        Loeve oere ceum olne qque
                      </div>
                      <div>dovverne</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-3 h-3 bg-orange-400 mr-3 mt-2 flex-shrink-0"></div>
                    <div className="text-gray-300 text-sm">
                      <div className="font-semibold mb-1">
                        Lorem pael ovell otnuce lanct
                      </div>
                      <div>alique</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Education, Publications */}
        <div className="w-1/2 bg-gray-800 p-8 border-l border-gray-600">
          {/* Education Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 border-b-2 border-orange-400 pb-2 inline-block">
              EDUCATION
            </h2>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white mb-2">
                {educations.length > 0
                  ? educations[0].college ||
                    educations[0].university ||
                    "OFERIWEATHER"
                  : "OFERIWEATHER"}
              </h3>
              <div className="text-gray-300 text-sm leading-relaxed">
                {educations.length > 0 ? (
                  <p>
                    {educations[0].degree ||
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ipsum lorem volum dolorum come fugitque tiseure quiti dispilocquie est."}
                  </p>
                ) : (
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod ipsum lorem volum dolorum come fugitque tiseure
                    quiti dispilocquie est.
                  </p>
                )}
              </div>
            </div>

            <div className="text-gray-300 text-sm leading-relaxed">
              <p>
                Open Sans dolotett amet, consectetur adipiscing elit, sed do
                eiusmod lorem volum dolorum marteud en elimmoe cereuli nisl
                negam qriss uli elis aveta seirere tegitatt dolqu un nigeren
                ootigie.
              </p>
            </div>
          </div>

          {/* Publications Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4 border-b-2 border-orange-400 pb-2 inline-block">
              PUBLICATIONS
            </h2>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">
                PUBLICATIONS
              </h3>
              <div className="text-gray-300 text-sm leading-relaxed">
                {strengths ? (
                  <p>{strengths}</p>
                ) : (
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod ipsum lorem volum dolorum aveta eximrme cereuli
                    nisl negam qris uli ellis aveta cotique tegiatt dolqu un
                    rigeren coitique.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Additional sections for internships if available */}
          {internships.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4 border-b-2 border-orange-400 pb-2 inline-block">
                INTERNSHIPS
              </h2>
              <div className="space-y-4">
                {internships.map((internship, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {internship.company || "Company Name"}
                    </h3>
                    <p className="text-gray-400 text-sm mb-1">
                      {internship.position || "Position"}
                    </p>
                    {internship.description && (
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {internship.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDarkTemplate;
