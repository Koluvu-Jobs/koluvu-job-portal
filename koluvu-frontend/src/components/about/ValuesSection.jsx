// src/components/ValuesSection.jsx

import styles from "@koluvu/styles/components/about/about.module.css";

export default function ValuesSection({ className }) {
  const values = [
    {
      name: "Innovation",
      description:
        "Constantly evolving our platform with cutting-edge technology to stay ahead of hiring trends.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      color: "from-blue-600 to-blue-800",
    },
    {
      name: "Inclusion",
      description:
        "Creating equal opportunities for all candidates regardless of background.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
      color: "from-blue-500 to-blue-700",
    },
    {
      name: "Integrity",
      description:
        "Transparent processes that respect both employers and job seekers.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "Impact",
      description:
        "Measuring success by the careers we help build and the talent we help discover.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      color: "from-blue-300 to-blue-500",
    },
  ];

  return (
    <section
      className={`relative py-28 bg-white overflow-hidden ${styles.gradientMesh}`}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2
            className={`${
              className || "text-5xl md:text-6xl"
            } !font-bold !tracking-tight !text-gray-900 sm:!text-6xl`}
          >
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Our Values
            </span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            The principles that guide everything we do at Koluvu
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl opacity-20 blur-lg group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative h-full bg-white rounded-xl p-8 text-center shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-r ${value.color} text-white shadow-lg transition-transform duration-500 group-hover:scale-110`}
                >
                  {value.icon}
                </div>
                <h3 className="!text-3xl !font-bold !text-gray-900 mb-3">
                  {value.name}
                </h3>
                <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto my-4 rounded-full"></div>
                <p className="text-gray-600">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
