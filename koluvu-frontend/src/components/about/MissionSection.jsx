// src/components/MissionSection.jsx

import styles from '@koluvu/styles/components/about/about.module.css';

export default function MissionSection({ className }) {
  return (
    <section className={`relative py-28 overflow-hidden ${styles.parallaxBg}`}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className={`${className || 'text-5xl md:text-6xl'} !font-bold !tracking-tight !text-gray-900 sm:!text-6xl`}>
            <span className="text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              Our Mission
            </span>
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 leading-relaxed">
            To create a seamless hiring experience for employers and an empowering job search journey for candidates
          </p>
        </div>

        <div className="grid gap-20">
          {/* Origin Story */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className={`${className || 'text-4xl'} !font-bold !text-gray-900`}>
                <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                  Our Origin
                </span>
              </h3>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Koluvu was founded by passionate HR professionals in Hyderabad who recognized the inefficiencies in traditional hiring processes.
                </p>
                <p>
                  With years of industry experience, we built a platform that truly understands what recruiters need and what candidates deserve.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl opacity-20 blur-lg group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="/images/hyderabad-tech.jpg"
                  alt="Hyderabad tech scene"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          {/* Name Meaning */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-1 md:order-2 space-y-6">
              <h3 className={`${className || 'text-4xl'} !font-bold !text-gray-900`}>
                <span className="text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                  The Name
                </span>
              </h3>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  "Koluvu" means "job" in Telugu, reflecting our mission to connect jobs and create futures.
                </p>
                <p>
                  Our tagline embodies our commitment to transforming hiring into a smart, accessible, and empowering experience for all.
                </p>
              </div>
            </div>
            <div className="order-2 md:order-1 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl opacity-20 blur-lg group-hover:opacity-30 transition-all duration-500"></div>
              <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 flex flex-col items-center justify-center shadow-2xl">
                <span className="text-7xl font-bold text-blue-700 mb-6">
                  కొలువు
                </span>
                <p className="text-gray-500 font-medium text-lg">
                  Telugu for "Job"
                </p>
                <div className="mt-6 w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
