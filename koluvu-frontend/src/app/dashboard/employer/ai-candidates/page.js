"use client";
// src/app/main/dashboard/ai-candidates/page.js
import Image from 'next/image';
import './AICandidatesPage.css';


import { useState } from 'react';
import { useRouter } from 'next/navigation';

function ProfileModal({ candidate, onClose }) {
  if (!candidate) return null;
  // Mocked extra details for demo
  const email = candidate.email || `${candidate.name.toLowerCase().replace(/ /g, '.')}@example.com`;
  const phone = candidate.phone || '+91-9876543210';
  const about = candidate.about || `Experienced ${candidate.position} with a passion for technology and innovation. Proven track record in delivering high-quality results and collaborating with cross-functional teams.`;
  const experience = candidate.experience || [
    { company: 'Tech Solutions', role: candidate.position, years: '2021 - Present' },
    { company: 'Global Corp', role: 'Software Engineer', years: '2018 - 2021' }
  ];
  const education = candidate.education || [
    { degree: 'B.Tech in Computer Science', school: 'IIT Delhi', years: '2014 - 2018' }
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <div className="flex flex-col items-center p-8 pt-10">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100 mb-3">
            <Image src={candidate.image} width={96} height={96} className="rounded-full object-cover w-full h-full" alt={candidate.name} />
          </div>
          <h2 className="text-2xl font-bold mb-1 text-center text-gray-900">{candidate.name}</h2>
          <p className="text-gray-500 mb-2 text-center text-base">{candidate.position}</p>
          <div className="flex flex-col items-center gap-1 mb-3">
            <span className="text-sm text-gray-500"><i className="fas fa-envelope mr-1"></i> {email}</span>
            <span className="text-sm text-gray-500"><i className="fas fa-phone mr-1"></i> {phone}</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {candidate.skills.map((skill, i) => (
              <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100">{skill}</span>
            ))}
          </div>
          <div className="w-full mb-3 flex items-center justify-center gap-2">
            <span className="font-semibold text-gray-700">ATS Match Score:</span>
            <span className="text-blue-700 font-bold text-lg">{candidate.score}%</span>
          </div>
          <div className="w-full mb-4 bg-gray-50 rounded-lg p-4">
            <span className="font-semibold block mb-1 text-gray-800">About</span>
            <span className="text-gray-600 text-sm block leading-relaxed">{about}</span>
          </div>
          <div className="w-full mb-4">
            <span className="font-semibold block mb-1 text-gray-800">Experience</span>
            <ul className="text-gray-700 text-sm pl-4 list-disc space-y-1">
              {experience.map((exp, i) => (
                <li key={i}><span className="font-medium">{exp.role}</span> at {exp.company} <span className="text-gray-400">({exp.years})</span></li>
              ))}
            </ul>
          </div>
          <div className="w-full mb-2">
            <span className="font-semibold block mb-1 text-gray-800">Education</span>
            <ul className="text-gray-700 text-sm pl-4 list-disc space-y-1">
              {education.map((edu, i) => (
                <li key={i}><span className="font-medium">{edu.degree}</span>, {edu.school} <span className="text-gray-400">({edu.years})</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScheduleModal({ candidate, onClose }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitted, setSubmitted] = useState(false);
  if (!candidate) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-xl font-bold mb-4 text-center">Schedule Interview with {candidate.name}</h2>
        {submitted ? (
          <div className="text-green-600 text-center font-semibold">Interview scheduled for {date} at {time}!</div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={e => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <label className="flex flex-col">
              <span className="mb-1 font-medium">Date</span>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="border rounded px-2 py-1" />
            </label>
            <label className="flex flex-col">
              <span className="mb-1 font-medium">Time</span>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="border rounded px-2 py-1" />
            </label>
            <button type="submit" className="bg-blue-600 text-white rounded py-2 font-semibold hover:bg-blue-700 transition">Schedule</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function AICandidatesPage() {
  const router = useRouter();
  const requiredSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Figma', 'Adobe XD', 'Prototyping', 'Digital Marketing', 'SEO', 'Social Media', 'Recruitment', 'Emp Relations', 'HR Policies', 'Strategy', 'Analytics', 'Agile', 'Machine Learning'];
  const candidates = [
    { id: 1, name: 'Rahul Sharma', position: 'Senior Software Engineer', skills: ['JavaScript', 'React', 'Node.js'], score: 92, image: 'https://randomuser.me/api/portraits/men/32.jpg', gradient: 'from-blue-400 via-purple-500 to-pink-500' },
    { id: 2, name: 'Priya Patel', position: 'Marketing Manager', skills: ['Digital Marketing', 'SEO', 'Social Media'], score: 85, image: 'https://randomuser.me/api/portraits/women/44.jpg', gradient: 'from-green-400 via-teal-500 to-blue-500' },
    { id: 3, name: 'Amit Kumar', position: 'HR Specialist', skills: ['Recruitment', 'Emp Relations', 'HR Policies'], score: 88, image: 'https://randomuser.me/api/portraits/men/67.jpg', gradient: 'from-orange-400 via-red-500 to-pink-500' },
    { id: 4, name: 'Sneha Gupta', position: 'UI/UX Designer', skills: ['Figma', 'Adobe XD', 'Prototyping'], score: 90, image: 'https://randomuser.me/api/portraits/women/68.jpg', gradient: 'from-purple-400 via-indigo-500 to-blue-500' },
    { id: 5, name: 'Vikash Singh', position: 'Data Scientist', skills: ['Python', 'Machine Learning', 'SQL'], score: 94, image: 'https://randomuser.me/api/portraits/men/45.jpg', gradient: 'from-cyan-400 via-teal-500 to-green-500' },
    { id: 6, name: 'Ananya Reddy', position: 'Product Manager', skills: ['Strategy', 'Analytics', 'Agile'], score: 87, image: 'https://randomuser.me/api/portraits/women/72.jpg', gradient: 'from-rose-400 via-pink-500 to-purple-500' },
  ];

  const [profileCandidate, setProfileCandidate] = useState(null);
  const [scheduleCandidate, setScheduleCandidate] = useState(null);

  return (
    <div className="ai-candidates-container">
      <div className="animated-background"></div>
      <div className="header-section">
        <h1 className="main-title">
          <span className="title-icon">🤖</span>
          AI Suggested Candidates
          <span className="title-glow"></span>
        </h1>
        <div className="filter-container">
          <button className="filter-btn">
            <i className="fas fa-filter"></i>
            <span>Advanced Filter</span>
            <div className="btn-ripple"></div>
          </button>
        </div>
      </div>
      <div className="candidates-grid">
        {candidates.map((candidate, index) => {
          const matching = candidate.skills.filter(skill => requiredSkills.includes(skill)).slice(0, 2);
          const missing = requiredSkills.filter(skill => !candidate.skills.includes(skill)).slice(0, 2);
          return (
            <div
              key={candidate.id}
              className="candidate-card"
              style={{
                '--card-delay': `${index * 0.1}s`,
                background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ef 100%)',
                boxShadow: '0 2px 12px 0 rgba(180, 200, 255, 0.10)'
              }}
            >
              <div className="card-inner">
                <div className="card-glow"></div>
                <div className="card-content">
                  <div className="profile-section">
                    <div className="image-container">
                      <div className="image-border"></div>
                      <Image
                        src={candidate.image}
                        width={80}
                        height={80}
                        className="profile-image"
                        alt={candidate.name}
                      />
                      <div className="status-indicator"></div>
                    </div>
                    <h3 className="candidate-name">{candidate.name}</h3>
                    <p className="candidate-position">{candidate.position}</p>
                    <div className="skills-container">
                      {candidate.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="skill-tag"
                          style={{ '--skill-delay': `${skillIndex * 0.1}s` }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="skill-details">
                      <span className="matching-skills-badge">
                        <span className="icon" aria-label="Matching">✔️</span>
                        <span className="label">Matching:</span>
                        <span className="value">{matching.length ? matching.join(', ') : 'None'}</span>
                      </span>
                      <span className="missing-skills-badge">
                        <span className="icon" aria-label="Missing">❌</span>
                        <span className="label">Missing:</span>
                        <span className="value">{missing.length ? missing.join(', ') : 'None'}</span>
                      </span>
                    </div>
                  </div>
                  <div className="score-section">
                    <div className="score-header">
                      <span className="score-label">ATS Match Score</span>
                      <span className="score-value">{candidate.score}%</span>
                    </div>
                    <div className="progress-container">
                      <div 
                        className="progress-bar"
                        style={{ '--score': `${candidate.score}%` }}
                      >
                        <div className="progress-fill"></div>
                        <div className="progress-glow"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className="action-btn primary"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        // Compose a full profile object with all expected fields
                        const profile = {
                          name: candidate.name,
                          position: candidate.position,
                          profilePic: candidate.image,
                          keySkills: candidate.skills || [],
                          score: candidate.score,
                          experience: candidate.experience || [
                            { company: 'Tech Solutions', role: candidate.position, years: '2021 - Present' },
                            { company: 'Global Corp', role: 'Software Engineer', years: '2018 - 2021' }
                          ],
                          education: candidate.education || [
                            { degree: 'B.Tech in Computer Science', school: 'IIT Delhi', years: '2014 - 2018' }
                          ],
                          about: candidate.about || `Experienced ${candidate.position} with a passion for technology and innovation. Proven track record in delivering high-quality results and collaborating with cross-functional teams.`,
                          internshipExperience: candidate.internshipExperience || [],
                          technicalQualifications: candidate.technicalQualifications || [],
                          projects: candidate.projects || [],
                          researches: candidate.researches || [],
                          additionalInfo: candidate.additionalInfo || [],
                          personalDetails: candidate.personalDetails || {
                            dob: '',
                            gender: '',
                            address: '',
                            phone: '',
                            email: '',
                            nationality: '',
                            maritalStatus: '',
                          },
                          social: candidate.social || {
                            github: '',
                            linkedin: '',
                            twitter: '',
                            portfolio: '',
                          },
                          // Defensive: ensure all sections are arrays
                          certifications: candidate.certifications || [],
                          languages: candidate.languages || [],
                          hobbies: candidate.hobbies || [],
                          awards: candidate.awards || [],
                          publications: candidate.publications || [],
                        };
                        localStorage.setItem('employeeProfile', JSON.stringify(profile));
                      }
                      router.push('/dashboard/employee?tab=profile');
                    }}
                  >
                    <i className="fas fa-eye"></i>
                    <span>View Profile</span>
                    <div className="btn-bg"></div>
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => {
                      router.push('/dashboard/employer/interview-scheduler');
                    }}
                  >
                    <i className="fas fa-calendar-check"></i>
                    <span>Schedule</span>
                    <div className="btn-bg"></div>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="load-more-section">
        <button className="load-more-btn">
          <div className="btn-content">
            <i className="fas fa-sync-alt"></i>
            <span>Discover More Talent</span>
          </div>
          <div className="btn-particles">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
        </button>
      </div>
      {profileCandidate && (
        <ProfileModal candidate={profileCandidate} onClose={() => setProfileCandidate(null)} />
      )}
      {scheduleCandidate && (
        <ScheduleModal candidate={scheduleCandidate} onClose={() => setScheduleCandidate(null)} />
      )}
    </div>
  );
}
