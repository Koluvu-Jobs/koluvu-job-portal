// src/app/main/resume-builder/components/PreviewSection.jsx

'use client';

import React from 'react';

const PreviewSection = ({ 
  formData = {
    firstName: '',
    lastName: '',
    jobTitle: '',
    address: '',
    city: '',
    phone: '',
    email: '',
    linkedin: '',
    portfolio: '',
    careerObjective: '',
    skills: '',
    experiences: [],
    internships: [],
    educations: [],
    technicalQualifications: '',
    technicalKnowledge: '',
    projects: [],
    certifications: [],
    languages: '',
    strengths: '',
    declarationName: '',
    declarationPlace: '',
    declarationDate: ''
  }, 
  photo = null, 
  signature = null, 
  template = "professional-dark" 
}) => {
  // Safe filtering of empty entries
  const validExperiences = (formData.experiences || []).filter(exp => 
    exp.designation || 
    exp.companyName || 
    exp.startDate || 
    exp.endDate || 
    exp.responsibilities
  );

  const validInternships = (formData.internships || []).filter(internship => 
    internship.position || 
    internship.company || 
    internship.startDate || 
    internship.endDate || 
    internship.description
  );

  // Safe URL handling for photos and signatures
  const getMediaUrl = (media) => {
    if (!media) return null;
    if (typeof media === 'string') return media;
    if (media instanceof File || media instanceof Blob) {
      return URL.createObjectURL(media);
    }
    return null;
  };

  const photoUrl = getMediaUrl(photo);
  const signatureUrl = getMediaUrl(signature);

  // Clean up object URLs
  React.useEffect(() => {
    return () => {
      if (photoUrl && (photo instanceof File || photo instanceof Blob)) {
        URL.revokeObjectURL(photoUrl);
      }
      if (signatureUrl && (signature instanceof File || signature instanceof Blob)) {
        URL.revokeObjectURL(signatureUrl);
      }
    };
  }, [photo, signature]);

  return (
    <div className="bg-white p-6 font-sans text-gray-800 max-w-3xl mx-auto shadow-md rounded-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
        <div className="w-24 h-24 md:w-28 md:h-28 flex-shrink-0">
          {photo ? (
            <img 
              src={photoUrl} 
              alt="Profile" 
              className="w-full h-full rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-300 shadow-sm">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-bold mb-1 text-gray-800">
            {formData.firstName || 'Your'} {formData.lastName || 'Name'}
          </h1>
          {formData.jobTitle && <p className="text-lg text-blue-600 font-medium mb-2">{formData.jobTitle}</p>}
          <div className="space-y-1 text-sm text-gray-600">
            {formData.address && <p>{formData.address}</p>}
            {formData.city && <p>{formData.city}</p>}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-1 mt-2">
              {formData.phone && <span>{formData.phone}</span>}
              {formData.email && <span>• {formData.email}</span>}
              {formData.linkedin && <span>• <a href={formData.linkedin} className="text-blue-600 hover:underline">LinkedIn</a></span>}
              {formData.portfolio && <span>• <a href={formData.portfolio} className="text-blue-600 hover:underline">Portfolio</a></span>}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {formData.careerObjective && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-1 text-gray-700">Professional Summary</h2>
          <p className="text-gray-700">{formData.careerObjective}</p>
        </div>
      )}

      {/* Work Experience */}
      {validExperiences.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-1 text-gray-700">Work Experience</h2>
          {validExperiences.map((exp, index) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{exp.designation}</h3>
                  <p className="text-gray-600 italic">{exp.companyName}</p>
                </div>
                <p className="text-gray-600 whitespace-nowrap">
                  {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                </p>
              </div>
              {exp.responsibilities && (
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                  {exp.responsibilities.split('\n').map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Internships */}
      {validInternships.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-1 text-gray-700">Internships</h2>
          {validInternships.map((internship, index) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{internship.position}</h3>
                  <p className="text-gray-600 italic">{internship.company}</p>
                </div>
                <p className="text-gray-600 whitespace-nowrap">
                  {internship.startDate} - {internship.currentlyWorking ? 'Present' : internship.endDate}
                </p>
              </div>
              {internship.description && (
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                  {internship.description.split('\n').map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {(formData.educations?.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-1 text-gray-700">Education</h2>
          {formData.educations.map((edu, index) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.college}</p>
                  {edu.university && <p className="text-gray-600 italic">{edu.university}</p>}
                </div>
                <p className="text-gray-600 whitespace-nowrap">
                  {edu.startDate} - {edu.currentlyStudying ? 'Present' : edu.endDate}
                </p>
              </div>
              {edu.gpa && <p className="text-gray-700 mt-1">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills */}
      {(formData.skills || formData.technicalKnowledge) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-1 text-gray-700">Technical Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.skills && (
              <div>
                <h3 className="font-semibold text-gray-800 text-base">Programming Languages:</h3>
                <p className="text-gray-700">{formData.skills}</p>
              </div>
            )}
            {formData.technicalKnowledge && (
              <div>
                <h3 className="font-semibold text-gray-800 text-base">Frameworks & Technologies:</h3>
                <p className="text-gray-700">{formData.technicalKnowledge}</p>
              </div>
            )}
            {formData.technicalQualifications && (
              <div>
                <h3 className="font-semibold text-gray-800 text-base">Technical Qualifications:</h3>
                <p className="text-gray-700">{formData.technicalQualifications}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {(formData.projects?.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-1 text-gray-700">Projects</h2>
          {formData.projects.map((project, index) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-gray-800">{project.title}</h3>
                {project.duration && <p className="text-gray-600">{project.duration}</p>}
              </div>
              {project.role && <p className="text-gray-600 italic">Role: {project.role}</p>}
              {project.technologies && (
                <p className="text-gray-600 mt-1">Technologies: {project.technologies}</p>
              )}
              {project.description && (
                <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                  {project.description.split('\n').map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {project.link && (
                <a 
                  href={project.link} 
                  className="inline-block mt-2 text-blue-600 hover:underline text-sm"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {(formData.certifications?.length > 0) && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-1 text-gray-700">Certifications</h2>
          {formData.certifications.map((cert, index) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">{cert.name}</p>
                  <p className="text-gray-600 italic">{cert.issuer}</p>
                </div>
                {cert.date && <p className="text-gray-600">{cert.date}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {formData.languages && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-1 text-gray-700">Languages</h2>
          <p className="text-gray-700">{formData.languages}</p>
        </div>
      )}

      {/* Strengths */}
      {formData.strengths && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3 border-b border-gray-300 pb-1 text-gray-700">Strengths</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {formData.strengths.split(',').map((strength, index) => (
              <li key={index}>{strength.trim()}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Declaration */}
      {(formData.declarationName || signature) && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              {formData.declarationPlace && (
                <p className="text-gray-700">Place: {formData.declarationPlace}</p>
              )}
              {formData.declarationDate && (
                <p className="text-gray-700">Date: {formData.declarationDate}</p>
              )}
              {formData.declarationName && (
                <p className="font-medium text-gray-800 mt-2">{formData.declarationName}</p>
              )}
            </div>
            {signatureUrl && (
              <div className="w-40 h-20">
                <img 
                  src={signatureUrl} 
                  alt="Signature" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewSection;
