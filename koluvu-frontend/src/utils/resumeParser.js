import pdfParse from 'pdf-parse';

// List of common tech skills to match
const SKILL_KEYWORDS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', 'C++', 'Go', 'Ruby', 'Rails',
  'HTML', 'CSS', 'Sass', 'Less', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'GraphQL', 'REST', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'Firebase', 'Redux', 'MobX', 'Vue', 'Angular', 'Next.js', 'Express', 'Jest', 'Mocha', 'Chai', 'Cypress',
  'Jenkins', 'CI/CD', 'Git', 'GitHub', 'Bitbucket', 'Figma', 'Sketch', 'Photoshop', 'Illustrator', 'Agile', 'Scrum', 'Kanban',
  'Linux', 'Bash', 'Shell', 'Selenium', 'Pandas', 'NumPy', 'TensorFlow', 'Keras', 'PyTorch', 'Machine Learning', 'Data Science',
  'Tableau', 'Power BI', 'Excel', 'Word', 'PowerPoint', 'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Creativity'
];

export async function extractSkillsFromPDF(fileBuffer) {
  try {
    const data = await pdfParse(fileBuffer);
    const text = data.text;
    // Match skills (case-insensitive)
    const foundSkills = SKILL_KEYWORDS.filter(skill =>
      new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(text)
    );
    return foundSkills;
  } catch (err) {
    console.error('Failed to parse PDF:', err);
    return [];
  }
}
