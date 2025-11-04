import React from 'react';
import PersonalInfoSection from './PersonalInfoSection';

const FresherResumeTemplate = ({ resumeData, onInputChange }) => {
  return (
    <div className="resume-template fresher-resume">
      <div className="resume-header">
        <h1>{resumeData.personalInfo.fullName || 'Your Name'}</h1>
        <div className="contact-info">
          <p>{resumeData.personalInfo.email || 'email@example.com'}</p>
          <p>{resumeData.personalInfo.phone || '+1 234 567 890'}</p>
          <p>{resumeData.personalInfo.address || 'City, Country'}</p>
        </div>
      </div>

      <div className="resume-section">
        <h2>Education</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="education-item">
            <h3>{edu.degree || 'Degree Name'}</h3>
            <p>{edu.institution || 'University Name'} | {edu.year || 'Year'}</p>
            <p>CGPA: {edu.gpa || 'X.XX'}</p>
          </div>
        ))}
      </div>

      <div className="resume-section">
        <h2>Skills</h2>
        <ul className="skills-list">
          {resumeData.skills.map((skill, index) => (
            <li key={index}>{skill || 'Skill Name'}</li>
          ))}
        </ul>
      </div>

      <div className="resume-section">
        <h2>Projects</h2>
        {resumeData.projects.map((project, index) => (
          <div key={index} className="project-item">
            <h3>{project.name || 'Project Name'}</h3>
            <p>{project.description || 'Project description...'}</p>
            <p>Technologies: {project.technologies || 'Tech used'}</p>
          </div>
        ))}
      </div>

      <div className="resume-section">
        <h2>Certifications</h2>
        <ul className="certifications-list">
          {resumeData.certifications.map((cert, index) => (
            <li key={index}>{cert.name || 'Certification Name'} - {cert.issuer || 'Issuer'} ({cert.year || 'Year'})</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FresherResumeTemplate;
