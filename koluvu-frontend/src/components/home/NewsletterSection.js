// src/components/home/NewsletterSection.js

import styles from '@koluvu/styles/home/home.module.css';

export default function NewsletterSection() {
  return (
    <div className={`${styles.newsletterSection} py-16 px-4 text-white bg-orange-500`}>
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          {/* Newsletter content on the left */}
          <div className="lg:w-1/2 w-full">
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Stay Updated with Job Opportunities</h2>
                <p className="text-white/90">
                  Subscribe to our newsletter and get the latest job openings
                  directly to your inbox
                </p>
              </div>
              <form className="w-full flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none"
                  required
                />
                <button 
                  type="submit" 
                  className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Video section on the right */}
          <div className="lg:w-1/2 w-full">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-auto rounded-lg shadow-lg"
            >
              <source src="/videos/stay_updated_with_job_opportunities.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
