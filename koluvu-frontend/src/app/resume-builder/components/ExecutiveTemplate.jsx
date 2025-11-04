import React from "react";

const ExecutiveTemplate = ({ formData, photoUrl, resumeType }) => {
  // Default values to prevent undefined errors
  const personalInfo = formData?.personal || {};
  const skills = formData?.skills || "";
  const educations = formData?.educations || [];
  const experiences = formData?.experiences || [];

  return (
    <div className="resume-template executive-resume max-w-5xl mx-auto bg-white flex">
      {/* Left Sidebar */}
      <div className="w-2/5 bg-blue-50 p-8">
        {/* Photo Section */}
        <div className="mb-8">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="w-full h-auto object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
              <span className="text-gray-400">Photo</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Details</h2>
          <div className="space-y-3 text-sm">
            {personalInfo.address && (
              <div>
                <p className="text-gray-600">{personalInfo.address}</p>
              </div>
            )}
            {personalInfo.phone && (
              <div>
                <p className="text-gray-800">{personalInfo.phone}</p>
              </div>
            )}
            {personalInfo.email && (
              <div>
                <p className="text-gray-800 break-words">{personalInfo.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Skills Section */}
        {skills && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
            <div className="space-y-2 text-sm">
              {skills.split(",").map((skill, index) => (
                <div key={index} className="text-blue-900 underline">
                  {skill.trim() || "Skill Name"}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">References</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-bold text-gray-900">Reference Name</p>
              <p className="text-gray-700">Company Name</p>
              <p className="text-gray-600">Phone: 123-456-7890</p>
              <p className="text-gray-600 break-words">email@example.com</p>
            </div>
            <div>
              <p className="font-bold text-gray-900">Reference Name</p>
              <p className="text-gray-700">Company Name</p>
              <p className="text-gray-600">Phone: 123-456-7890</p>
              <p className="text-gray-600 break-words">email@example.com</p>
            </div>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="mt-auto">
          <svg viewBox="0 0 200 100" className="w-full">
            <path d="M0,50 Q50,0 100,50 T200,50" fill="none" stroke="#1e3a8a" strokeWidth="15" />
            <path d="M0,70 Q50,20 100,70 T200,70" fill="none" stroke="#1e3a8a" strokeWidth="15" />
            <path d="M0,90 Q50,40 100,90 T200,90" fill="none" stroke="#1e3a8a" strokeWidth="15" />
          </svg>
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-3/5 p-8 bg-white">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-1">
            {personalInfo.fullName || personalInfo.firstName || "Your Name"}
          </h1>
          <p className="text-xl text-blue-900 font-semibold mb-4">
            {personalInfo.title || "Your Professional Title"}
          </p>
          {personalInfo.summary && (
            <p className="text-sm text-gray-700 leading-relaxed">
              {personalInfo.summary}
            </p>
          )}
        </div>

        {/* Employment History Section */}
        {experiences.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              Employment History
            </h2>
            {experiences.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-base font-bold text-gray-900">
                    {exp.designation || "Job Title"} at {exp.companyName || "Company Name"}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 italic mb-2">
                  {exp.startDate || "Start Date"} - {exp.endDate || "End Date"}
                </p>
                {exp.responsibilities && (
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    {exp.responsibilities.split(".").filter(r => r.trim()).map((resp, i) => (
                      <li key={i}>{resp.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education Section */}
        {educations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
              Education
            </h2>
            {educations.map((edu, index) => (
              <div key={index} className="mb-4">
                <h3 className="text-base font-bold text-gray-900">
                  {edu.degree || "Degree Name"} at {edu.college || edu.university || "University Name"}
                </h3>
                <p className="text-sm text-gray-600 italic">
                  {edu.startDate || "Start"} - {edu.endDate || "End"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutiveTemplate;