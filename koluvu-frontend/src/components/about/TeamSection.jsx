// src/components/TeamSection.jsx

import styles from '@koluvu/styles/components/about/about.module.css';

export default function TeamSection({ className }) {
  const team = [
    {
      name: "HR Professionals",
      role: "Founders",
      description: "Seasoned experts with decades of combined experience in recruitment, talent acquisition, and workforce planning.",
      image: "/images/team-hr.jpg",
    },
    {
      name: "Tech Team",
      role: "Innovators",
      description: "Building intelligent matching algorithms and seamless user experiences.",
      image: "/images/team-tech.jpg",
    },
    {
      name: "Advisors",
      role: "Industry Leaders",
      description: "Guiding our vision with insights from Fortune 500 companies and startups alike.",
      image: "/images/team-advisors.jpg",
    },
  ];

  return (
    <section className={`relative py-28 overflow-hidden bg-gray-50`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className={`${className || 'text-5xl md:text-6xl'} !font-bold !tracking-tight !text-gray-900 sm:!text-6xl`}>
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Our Team
            </span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Passionate professionals dedicated to transforming the hiring experience
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {team.map((member, index) => (
            <div 
              key={index}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl opacity-20 blur-lg group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative h-full bg-white rounded-xl overflow-hidden shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="!text-3xl !font-bold !text-gray-900 group-hover:!text-blue-700 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-blue-800 my-4 rounded-full"></div>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
