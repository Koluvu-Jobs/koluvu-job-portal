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
      <footer className="bg-green-600 text-white">
        <div className="w-full py-8 px-4">
          {/* --- Links Section: Responsive grid layout --- */}
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-8 justify-between text-center lg:text-left">
              {/* Logo & Description Section */}
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center justify-center lg:justify-start gap-3 pb-2 mb-4">
                  <Link href="/" className="flex items-center gap-3">
                    <Image
                      src="/images/koluvu_logo.jpg"
                      alt="Koluvu"
                      width={36}
                      height={36}
                      className="rounded"
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
              <div>
                <h3 className="text-lg font-semibold border-b border-white pb-2 mb-4">
                  Company
                </h3>
                <div className="flex flex-col space-y-2 text-sm">
                  <Link
                    href="/about"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    About Koluvu
                  </Link>
                  <Link
                    href="/career-opportunities"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    Career Opportunities
                  </Link>
                  <Link
                    href="/about/faq"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    FAQs
                  </Link>
                  <Link
                    href="/help-center"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    Help Center
                  </Link>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-semibold border-b border-white pb-2 mb-4">
                  Quick Links
                </h3>
                <div className="flex flex-col space-y-2 text-sm">
                  <Link
                    href="/download"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    Download App
                  </Link>
                  <Link
                    href="/job-alerts"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    Free Job Alerts
                  </Link>
                  <Link
                    href="/legal/privacy-policy"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/legal/terms"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    Terms & Conditions
                  </Link>
                  <Link
                    href="/legal/vulnerability-disclosure-policy"
                    className="hover:text-gray-200 transition-all duration-200 hover:pl-1 break-words"
                  >
                    Vulnerability Disclosure Policy
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
              <div>
                <h3 className="text-lg font-semibold border-b border-white pb-2 mb-4">
                  Follow Koluvu
                </h3>
                <div className="flex flex-col space-y-2 text-sm">
                  <Link
                    href="https://www.facebook.com/share/1BoXwcecvY/"
                    className="flex items-center justify-center lg:justify-start gap-2 hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    <FacebookIcon /> <span>Facebook</span>
                  </Link>
                  <Link
                    href="https://x.com/Koluvu_jobs?t=HK-a3d7NUNyK-NSdbElSCA&s=09"
                    className="flex items-center justify-center lg:justify-start gap-2 hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    <TwitterIcon /> <span>Twitter (X)</span>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/company/koluvu-com"
                    className="flex items-center justify-center lg:justify-start gap-2 hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    <LinkedInIcon /> <span>LinkedIn</span>
                  </Link>
                  <Link
                    href="https://www.instagram.com/koluvujobs?utm_source=qr"
                    className="flex items-center justify-center lg:justify-start gap-2 hover:text-gray-200 transition-all duration-200 hover:pl-1"
                  >
                    <InstagramIcon /> <span>Instagram</span>
                  </Link>
                  <Link
                    href="https://whatsapp.com/channel/0029VbA9OVbBqbr1gugLVb0s"
                    className="flex items-center justify-center lg:justify-start gap-2 hover:text-gray-200 transition-all duration-200 hover:pl-1 break-words"
                  >
                    <WhatsAppIcon /> <span>WhatsApp Channel</span>
                  </Link>
                </div>
              </div>

              {/* Contact Us */}
              <div className="flex-1 min-w-[200px]">
                <h3 className="text-lg font-semibold border-b border-white pb-2 mb-4">
                  Contact Us
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="break-words">
                    H-no 8-3-230/1/a/b V Giri, Safi Residency, 2nd Floor,
                    Yousufguda, Hyderabad, Telangana, India, 500045
                  </p>
                  <a
                    href="mailto:support@koluvu.com"
                    className="block hover:text-gray-200 transition-all duration-200 hover:pl-1 break-all"
                  >
                    support@koluvu.com
                  </a>
                  <p>9866875709</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Copyright Section - Centered */}
      <div className="bg-orange-500 text-white py-3 text-sm">
        <div className="text-center">
          © 2025 Koluvu.com | Powered by Bhuvih HR Solutions Pvt. Ltd. | All
          Rights Reserved
        </div>
      </div>
    </>
  );
}
