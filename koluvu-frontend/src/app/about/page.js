// src/app/about/page.js

import Header from '@koluvu/components/Header/Header';
import Footer from '@koluvu/components/Footer/Footer';
import AboutHero from '@koluvu/components/about/AboutHero';
import MissionSection from '@koluvu/components/about/MissionSection';
import TeamSection from '@koluvu/components/about/TeamSection';
import ValuesSection from '@koluvu/components/about/ValuesSection';
import CTA from '@koluvu/components/ui/about/CTA';
import styles from '@koluvu/styles/components/about/about.module.css';

export const metadata = { 
  title: 'About Koluvu - Revolutionizing Hiring',
  description: 'Learn about our mission to transform the hiring landscape with intelligent, inclusive job matching.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className={`bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 ${styles.fadeIn}`}>
        <AboutHero className="text-6xl md:text-7xl lg:text-8xl" />
        
        <div className="relative overflow-hidden py-2">
          <div className={`absolute inset-0 ${styles.gradientMesh}`}></div>
          <MissionSection className="text-5xl md:text-6xl" />
        </div>

        <div className={`relative ${styles.parallaxBg}`}>
          <TeamSection className="text-5xl md:text-6xl" />
        </div>

        <ValuesSection className="text-5xl md:text-6xl" />

        <div className={`px-4 sm:px-6 lg:px-8 py-16 ${styles.ctaGlow}`}>
          <CTA
            title="Ready to revolutionize your hiring?"
            subtitle="Join Koluvu today and experience the future of recruitment."
            primaryAction={{ label: 'For Employers', href: 'auth/register/employer' }}
            secondaryAction={{ label: 'For Job Seekers', href: 'auth/register/employee' }}
            className="text-4xl md:text-5xl"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
