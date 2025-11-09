// src/components/Footer.js

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// Simple placeholder icons
const FacebookIcon = () => <svg width="16" height="16" fill="currentColor" />;
const TwitterIcon = () => <svg width="16" height="16" fill="currentColor" />;
const LinkedInIcon = () => <svg width="16" height="16" fill="currentColor" />;
const InstagramIcon = () => <svg width="16" height="16" fill="currentColor" />;
const WhatsAppIcon = () => <svg width="16" height="16" fill="currentColor" />;

export default function Footer() {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const shortDescription = `Koluvu – AI Powered Job Portal
Connecting Jobs, Creating Futures
Bridging the gap between talent and opportunity with intelligent matching.`;

  const fullDescription = `Koluvu – AI Powered Job Portal
Connecting Jobs, Creating Futures

Koluvu is an advanced AI-powered job portal built to bridge the gap between talent and opportunity. Unlike traditional job boards, our intelligent matching system analyzes skills, experience, and career aspirations to connect professionals with roles that truly align with their potential.

For Job Seekers
• Personalized job recommendations tailored to skills and career goals.
• Smart resume analysis to identify missing or in-demand skills.
• Direct access to trusted training institutes and learning partners, helping candidates upskill and stay competitive before applying for desired roles.

For Employers
• Powerful recruitment tools that simplify hiring and reduce time-to-hire.
• AI-driven shortlisting with precise candidate insights.
• Access to pre-skilled, industry-ready professionals.

Proudly Made with ❤ in India, Koluvu is more than just a job portal. It is a complete ecosystem that empowers professionals, strengthens organizations, and fosters continuous learning — creating a future where talent and opportunity meet seamlessly.`;

  return (
    <>
      <footer className="bg-green-600 text-white mt-auto">
        <div className="w-full py-6 sm:py-8 px-4 md:px-6 lg:px-8">
          {/* --- Links Section: Responsive grid layout --- */}
          <div className="max-w-7xl mx-auto container space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 items-start text-center lg:text-left">
              {/* Logo & Description Section */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1 mb-6 sm:mb-0">
                <div className="flex flex-col items-center lg:items-start gap-3 pb-2 mb-4">
                  <Link href="/" className="flex items-center gap-3">
                    <Image
                      src="/images/koluvu_logo.jpg"
                      alt="Koluvu"
                      width={36}
                      height={36}
                      className="rounded shadow-lg"
                      priority
                    />
                    <h3 className="text-lg font-semibold border-b border-white pb-2">
                      Koluvu
                    </h3>
                  </Link>
                </div>
                <div className="text-sm text-gray-100 leading-relaxed">
                  Koluvu – AI Powered Job Portal
                  <br />
                  Connecting Jobs, Creating Futures
                </div>
                <Link
                  href="/about"
                  className="inline-block mt-2 text-orange-200 hover:text-orange-100 underline text-sm transition-colors duration-200"
                >
                  Read More
                </Link>
              </div>

              {/* Company */}
              <div className="col-span-1 sm:col-span-1">
                <h3 className="text-lg font-semibold border-b border-white pb-2 mb-4">
                  Company
                </h3>
                <div className="flex flex-col space-y-3 text-sm">
                  <Link
                    href="/about"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1 py-1"
                  >
                    About Koluvu
                  </Link>
                  <Link
                    href="/career-opportunities"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1 py-1"
                  >
                    Career Opportunities
                  </Link>
                  <Link
                    href="/about/faq"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1 py-1"
                  >
                    FAQs
                  </Link>
                  <Link
                    href="/help-center"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1 py-1"
                  >
                    Help Center
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div className="col-span-1 sm:col-span-1">
                <h3 className="text-lg font-semibold border-b border-white pb-2 mb-4">
                  Quick Links
                </h3>
                <div className="flex flex-col space-y-3 text-sm items-center lg:items-start">
                  <Link
                    href="/download"
                    className="hover:text-gray-200 transition-all duration-200 hover:scale-105 py-1 flex items-center gap-2 group"
                  >
                    <svg
                      className="w-4 h-4 group-hover:text-orange-200 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download App
                  </Link>
                  <Link
                    href="/job-alerts"
                    className="hover:text-gray-200 transition-all duration-200 hover:scale-105 py-1 flex items-center gap-2 group"
                  >
                    <svg
                      className="w-4 h-4 group-hover:text-orange-200 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    Free Job Alerts
                  </Link>
                  <Link
                    href="/legal/privacy-policy"
                    className="hover:text-gray-200 transition-all duration-200 hover:scale-105 py-1 flex items-center gap-2 group"
                  >
                    <svg
                      className="w-4 h-4 group-hover:text-orange-200 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Privacy Policy
                  </Link>
                  <Link
                    href="/legal/terms"
                    className="hover:text-gray-200 transition-all duration-200 hover:scale-105 py-1 flex items-center gap-2 group"
                  >
                    <svg
                      className="w-4 h-4 group-hover:text-orange-200 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Terms & Conditions
                  </Link>
                  <Link
                    href="/legal/vulnerability-disclosure-policy"
                    className="hover:text-gray-200 transition-all duration-200 hover:scale-105 py-1 flex items-center gap-2 group break-words"
                  >
                    <svg
                      className="w-4 h-4 group-hover:text-orange-200 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7m-6 4h4"
                      />
                    </svg>
                    Vulnerability Disclosure
                  </Link>
                </div>
              </div>

              {/* Koluvu Labs */}
              <div>
                <h3 className="text-lg font-semibold border-b border-white pb-2 mb-4">
                  Koluvu Labs
                </h3>
                <div className="flex flex-col space-y-2 text-sm">
                  <Link
                    href="/dashboard/employee/resume-builder"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1 break-words"
                  >
                    Resume Building
                  </Link>
                  <Link
                    href="/dashboard/employee/mock-interview"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1 break-words"
                  >
                    AI Mock Interviews
                  </Link>
                  <Link
                    href="/dashboard/employee/ats"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1 break-words"
                  >
                    Applicant Tracking System (ATS)
                  </Link>
                </div>
              </div>

              {/* Follow Koluvu */}
              <div className="col-span-1 sm:col-span-1">
                <h3 className="text-lg font-semibold border-b border-white pb-2 mb-4">
                  Follow Koluvu
                </h3>
                <div className="flex flex-col space-y-3 text-sm items-center lg:items-start">
                  <Link
                    href="https://www.facebook.com/share/1BoXwcecvY/"
                    className="hover:text-gray-200 transition-all duration-200 hover:scale-105 py-1 flex items-center gap-2 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-5 h-5 group-hover:text-orange-200 transition-colors duration-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                    </svg>
                    <span>Facebook</span>
                  </Link>
                  <Link
                    href="https://x.com/Koluvu_jobs?t=HK-a3d7NUNyK-NSdbElSCA&s=09"
                    className="hover:text-gray-200 transition-all duration-200 hover:scale-105 py-1 flex items-center gap-2 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-5 h-5 group-hover:text-orange-200 transition-colors duration-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span>Twitter (X)</span>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/koluvu-com"
                    className="hover:text-gray-200 transition-all duration-200 hover:scale-105 py-1 flex items-center gap-2 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-5 h-5 group-hover:text-orange-200 transition-colors duration-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span>LinkedIn</span>
                  </Link>
                  <Link
                    href="https://www.instagram.com/koluvujobs?utm_source=qr"
                    className="hover:text-gray-200 transition-all duration-200 hover:scale-105 py-1 flex items-center gap-2 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-5 h-5 group-hover:text-orange-200 transition-colors duration-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>Instagram</span>
                  </Link>
                  <Link
                    href="https://whatsapp.com/channel/0029VbA9OVbBqbr1gugLVb0s"
                    className="hover:text-gray-200 transition-all duration-200 hover:scale-105 py-1 flex items-center gap-2 group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-5 h-5 group-hover:text-orange-200 transition-colors duration-200"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <span>WhatsApp</span>
                  </Link>
                </div>
              </div>

              {/* Contact Us */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                <h3 className="text-lg font-semibold border-b border-white pb-2 mb-4">
                  Contact Us
                </h3>
                <div className="space-y-4 text-sm lg:text-left">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-5 h-5 mt-1 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="break-words leading-relaxed">
                      H-no 8-3-230/1/a/b V Giri, Safi Residency, 2nd Floor,
                      Yousufguda, Hyderabad, Telangana, India, 500045
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a
                      href="mailto:support@koluvu.com"
                      className="hover:text-gray-200 transition-all duration-200 hover:pl-1"
                    >
                      support@koluvu.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <p>9866875709</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Section - Centered */}
      <div className="bg-orange-500 text-white py-4 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-center lg:justify-between items-center space-y-2 lg:space-y-0">
            <div className="text-center lg:text-left order-2 lg:order-1">
              © 2025 Koluvu.com
            </div>
            <div className="text-center order-1 lg:order-2 font-medium px-2">
              Powered by Bhuvih HR Solutions Pvt. Ltd.
            </div>
            <div className="text-center lg:text-right order-3 lg:order-3">
              All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
