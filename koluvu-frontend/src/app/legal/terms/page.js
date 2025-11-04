import React from "react";
import styles from "@koluvu/styles/components/legal/terms.module.css";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";

const TermsPage = () => {
  return (
    <>
      <Header />
      <div
        className={`${styles.termsContainer} min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 ${styles.fadeIn}`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1
              className={`text-4xl font-extrabold text-gray-900 sm:text-5xl ${styles.titleUnderline}`}
            >
              Terms and Conditions
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Koluvu Job Portal - Operated by Bhuvih HR Solutions Private
              Limited
            </p>
            <div className="mt-6 flex justify-center space-x-4">
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Effective Date: [Insert Effective Date]
                </p>
              </div>
              <div className="bg-indigo-100 px-4 py-2 rounded-lg">
                <p className="text-sm font-medium text-indigo-800">
                  Last Updated: [Insert Last Updated Date]
                </p>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Koluvu is a digital platform offering services to job seekers,
              employers, and training providers. Our platform includes job
              search and postings, resume services, employer dashboards,
              AI-powered tools (resume parsing, job matching, interview
              questions), and more. The platform is owned and operated by Bhuvih
              HR Solutions Private Limited, based in India.
            </p>
          </div>

          {/* Eligibility */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              2. Eligibility
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You must be at least 18 years old.</li>
              <li>
                You must provide accurate, complete, and up-to-date information.
              </li>
              <li>
                You must use the platform in accordance with all applicable
                laws.
              </li>
            </ul>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Koluvu reserves the right to deny or suspend access to any user
              who violates these Terms or provides false information.
            </p>
          </div>

          {/* Account Registration */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              3. Account Registration and Security
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Users must register for an account to access personalized
                features.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                login credentials.
              </li>
              <li>
                You must immediately notify us of any unauthorized use or
                security breach.
              </li>
            </ul>
          </div>

          {/* Services */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              4. Description of Services
            </h2>

            <h3 className="text-xl font-semibold text-gray-700 mt-4 mb-2">
              4.1 For Job Seekers:
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Create and manage your profile.</li>
              <li>
                Upload resumes and receive AI-powered resume scores and
                suggestions.
              </li>
              <li>
                Search and apply for jobs based on preferences and AI
                recommendations.
              </li>
              <li>Schedule interviews and receive interview Q&A via AI.</li>
              <li>Access training recommendations and skill gap analysis.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
              4.2 For Employers:
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                Post job openings with standard and premium listing options.
              </li>
              <li>Access an advanced Applicant Tracking System (ATS).</li>
              <li>
                Use AI tools for candidate screening, resume filtering, and
                interview scheduling.
              </li>
              <li>
                Utilize analytics dashboards for hiring insights and success
                predictions.
              </li>
              <li>
                Communicate with candidates via built-in chat and video
                conferencing.
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-2">
              4.3 For Training Providers:
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>List HR and skill-based training programs.</li>
              <li>
                Connect with job seekers and offer relevant certifications.
              </li>
            </ul>
          </div>

          {/* Subscription */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              5. Subscription and Payments
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Employers may purchase subscription plans (Monthly, Quarterly,
              Half-Yearly, Yearly). Premium features include resume downloads,
              SMS/WhatsApp notifications, AI analytics, and highlighted job
              listings. All payments are processed securely and are
              non-refundable unless required by law. Koluvu reserves the right
              to change pricing or subscription terms with prior notice.
            </p>
          </div>

          {/* AI Tools */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              6. Use of AI Tools
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Koluvu incorporates AI-based features such as:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800">• Resume parsing and scoring</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800">
                  • AI-powered job recommendations
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800">• Mock interview generation</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800">• Skill gap analysis</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg md:col-span-2">
                <p className="text-blue-800">
                  • Salary predictions and career path guidance
                </p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed italic">
              Disclaimer: AI tools are designed to assist, not replace, human
              judgment. While we strive for accuracy, we do not guarantee
              results, and users should use these tools with discretion.
            </p>
          </div>

          {/* User Responsibilities */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              7. User Responsibilities and Code of Conduct
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All users agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Post misleading, fraudulent, or discriminatory content.</li>
              <li>
                Upload harmful or malicious code, spam, or illegal content.
              </li>
              <li>Harvest or scrape data from the platform.</li>
              <li>Use another users account or misrepresent their identity.</li>
              <li>Interfere with the platforms security or integrity.</li>
            </ul>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Violation of this section may lead to account suspension or legal
              action.
            </p>
          </div>

          {/* Content Ownership */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              8. Content Ownership and License
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All content posted by users remains their property, but by
              uploading, you grant Koluvu a non-exclusive, royalty-free,
              worldwide license to display and distribute such content for
              platform-related purposes.
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              All Koluvu content, including branding, design, code, and data
              structures, is the property of Bhuvih HR Solutions Private Limited
              and is protected under intellectual property laws.
            </p>
          </div>

          {/* Privacy */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              9. Privacy and Data Protection
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Koluvu values user privacy. Our Privacy Policy outlines how we
              collect, store, use, and protect your data, including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-indigo-800">
                  • Personal data provided during registration
                </p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-indigo-800">
                  • Resume and employment history
                </p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-indigo-800">• Communication preferences</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg">
                <p className="text-indigo-800">
                  • Behavioral data for improving AI tools
                </p>
              </div>
            </div>
            <p className="mt-4 text-gray-700 leading-relaxed">
              We comply with Indian data protection laws and applicable global
              privacy regulations (e.g., GDPR, if applicable).
            </p>
          </div>

          {/* Third-Party */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              10. Third-Party Services and Links
            </h2>
            <p className="text-gray-700 leading-relaxed">
              The platform may include links or integrations with third-party
              services (e.g., payment gateways, calendar services, training
              partners). Koluvu is not responsible for the content, data
              practices, or service performance of these third parties.
            </p>
          </div>

          {/* Termination */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              11. Termination and Account Deletion
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate any account without
              prior notice if:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You breach these Terms or applicable laws</li>
              <li>You misuse the platform</li>
              <li>Fraudulent activities are detected</li>
            </ul>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Users may also request deletion of their account by contacting our
              support team.
            </p>
          </div>

          {/* Liability */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              12. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Koluvu and Bhuvih HR Solutions Private Limited shall not be liable
              for:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Loss of data, business, revenue, or opportunities</li>
              <li>Third-party content or job listings</li>
              <li>AI recommendation errors or mismatches</li>
              <li>
                Delays or interruptions in service due to technical issues
              </li>
            </ul>
            <p className="mt-4 text-gray-700 leading-relaxed">
              Our total liability is limited to the amount paid by the user (if
              any) in the last 6 months.
            </p>
          </div>

          {/* Indemnification */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              13. Indemnification
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Users agree to indemnify and hold Koluvu, its parent company,
              employees, and affiliates harmless from any claim, liability, or
              legal expense arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2 text-gray-700">
              <li>Your use of the platform</li>
              <li>Your violation of these Terms</li>
              <li>Your interactions with other users</li>
            </ul>
          </div>

          {/* Dispute Resolution */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              14. Dispute Resolution and Jurisdiction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms are governed by the laws of India. Any disputes shall
              be subject to the exclusive jurisdiction of courts in Hyderabad,
              Telangana, India.
            </p>
          </div>

          {/* Changes to Terms */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              15. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Koluvu reserves the right to update or modify these Terms at any
              time. Changes will be posted on our website with an updated date.
              Continued use of the platform after changes implies acceptance.
            </p>
          </div>

          {/* Section 16 - Contact Information (same style as other terms) */}
          <div
            className={`bg-white rounded-xl shadow-lg p-6 mb-8 ${styles.cardHover}`}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              16. Contact Information
            </h2>
            <div className="space-y-4 text-gray-700">
              <h3 className="text-xl font-semibold">
                Bhuvih HR Solutions Private Limited
              </h3>
              <div className="space-y-3">
                <p className="flex items-start">
                  <svg
                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    H-no 8-3-230/1/a/b, V Giri, Safi Residency, 2nd Floor,
                    Yousufguda, Hyderabad, Khairatabad, Telangana, India &ndash;
                    500045
                  </span>
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+91 98668 75709</span>
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span>bhuvihhr@outlook.com</span>
                </p>
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>www.koluvu.com</span>
                </p>
              </div>
            </div>
          </div>

          {/* "Have questions" section moved below all terms */}
          <div className="mt-8 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl inline-block">
              <p className="text-lg font-medium text-gray-800 mb-4">
                Have questions about our Terms?
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsPage;
