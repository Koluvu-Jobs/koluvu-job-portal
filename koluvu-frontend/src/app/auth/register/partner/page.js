// src/app/auth/register/partner/page.js

"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";

export default function InstituteRegistrationPage() {
  const [formData, setFormData] = useState({
    instituteName: "",
    contactPerson: "",
    mobile: "",
    email: "",
    address: "",
    trainingType: "",
    domain: "",
    website: "",
    registrationCertificate: null,
    panGst: null,
    brochure: null,
  });

  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoLoaded(true);
          })
          .catch((error) => {
            console.log("Video autoplay failed:", error);
            setVideoLoaded(false);
          });
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Submitted! Await admin verification.");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-grow flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-[center_20%] bg-fixed"
            style={{ backgroundImage: "url('/images/partner.jpeg')" }}
          >
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        </div>

        {/* Koluvu Text in Center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 mt-6 sm:mt-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white/10 select-none tracking-wider">
            KOLUVU
          </h1>
        </div>

        {/* Left Content - Centered on mobile, left-aligned on larger screens */}
        <div className="hidden lg:flex lg:w-1/3 justify-center text-white mb-10 lg:mb-0 text-center relative z-10">
          <div className="max-w-md">
            <h1 style={{ fontSize: "30px" }} className="font-bold mb-4">
              {" "}
              Welcome to{" "}
              <span style={{ fontSize: "30px" }} className="text-blue-400">
                KOLUVU HUB
              </span>{" "}
            </h1>

            <p className="text-lg mb-6 text-white/90">
              Empowering Institutions to Shape Future Talent
            </p>
            <div className="space-y-6 mx-auto">
              <div className="flex items-start gap-4 justify-center whitespace-nowrap">
                <div className="bg-blue-500/30 rounded-full p-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Verified Training Partners</h3>
                  <p className="text-white/80 text-sm">
                    Connect with thousands of verified institutes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 justify-center whitespace-nowrap">
                <div className="bg-blue-500/30 rounded-full p-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Seamless Management</h3>
                  <p className="text-white/80 text-sm">
                    Manage courses, students, and certifications
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 justify-center whitespace-nowrap">
                <div className="bg-blue-500/30 rounded-full p-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Industry Recognition</h3>
                  <p className="text-white/80 text-sm">
                    Gain visibility with top employers and partners
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Registration Form */}
        <div className="w-full max-w-md p-2 sm:p-4 bg-gray-900/70 rounded-xl shadow-2xl border-2 border-gray-600 relative z-10 lg:mr-16 mt-36 sm:mt-28 lg:mt-0 pt-20 sm:pt-20 lg:pt-4">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6 -mt-16 bg-gray-900 p-4 sm:p-5 rounded-lg border border-gray-700 max-w-[90%] mx-auto">
            <h1
              style={{ fontSize: "18px", color: "white" }}
              className="font-bold mb-4"
            >
              {" "}
              Welcome to{" "}
              <span style={{ fontSize: "18px" }} className="text-blue-400">
                KOLUVU HUB
              </span>{" "}
            </h1>

            <p className="text-gray-200 text-sm mb-4 mt-1">
              Empowering Institutions to Shape Future Talent
            </p>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/40 rounded-full p-1.5 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm text-white">
                    Verified Training Partners
                  </h3>
                  <p className="text-gray-300 text-xs">
                    Connect with thousands of verified institutes
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/40 rounded-full p-1.5 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm text-white">
                    Seamless Management
                  </h3>
                  <p className="text-gray-300 text-xs">
                    Manage courses, students, and certifications
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/40 rounded-full p-1.5 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm text-white">
                    Industry Recognition
                  </h3>
                  <p className="text-gray-300 text-xs">
                    Gain visibility with top employers and partners
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Institute Registration
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm mt-1">
              Join our network of verified partners
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Two Column Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* General Information Column */}
              <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-700">
                <h3 className="text-white text-sm font-semibold mb-3 border-b border-gray-600 pb-2">
                  General Information
                </h3>

                <div className="space-y-4">
                  <input
                    name="instituteName"
                    onChange={handleChange}
                    placeholder="Training Institute Name *"
                    className="w-full text-xs sm:text-sm font-medium border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                    required
                  />

                  <select
                    name="category"
                    onChange={handleChange}
                    className="w-full text-xs sm:text-sm font-medium border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  >
                    <option value="" className="text-gray-400">
                      Category of Institute *
                    </option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="NGO">NGO</option>
                    <option value="EdTech">EdTech</option>
                    <option value="Corporate Training Center">
                      Corporate Training Center
                    </option>
                  </select>

                  <select
                    name="instituteType"
                    onChange={handleChange}
                    className="w-full text-xs sm:text-sm font-medium border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required
                  >
                    <option value="" className="text-gray-400">
                      Type of Institute *
                    </option>
                    <option value="Technical">Technical</option>
                    <option value="Non-Technical">Non-Technical</option>
                    <option value="Skill Development">Skill Development</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="HR Training">HR Training</option>
                  </select>

                  <input
                    name="website"
                    onChange={handleChange}
                    placeholder="Domain Name (e.g., www.example.com)"
                    className="w-full text-xs sm:text-sm font-medium border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                  />

                  <input
                    name="registrationNumber"
                    onChange={handleChange}
                    placeholder="Registration Number *"
                    className="w-full text-xs sm:text-sm font-medium border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                    required
                  />

                  <input
                    name="panGstNumber"
                    onChange={handleChange}
                    placeholder="PAN / GST Number (Optional)"
                    className="w-full text-xs sm:text-sm font-medium border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                  />
                </div>
              </div>

              {/* Contact Details Column */}
              <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-700">
                <h3 className="text-white text-sm font-semibold mb-3 border-b border-gray-600 pb-2">
                  Contact Details
                </h3>

                <div className="space-y-4">
                  <input
                    name="contactPerson"
                    onChange={handleChange}
                    placeholder="Contact Person Name *"
                    className="w-full text-xs sm:text-sm font-medium border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                    required
                  />

                  <input
                    name="designation"
                    onChange={handleChange}
                    placeholder="Designation (e.g., Director) *"
                    className="w-full text-xs sm:text-sm font-medium border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                    required
                  />

                  <input
                    name="mobile"
                    onChange={handleChange}
                    placeholder="Mobile Number *"
                    className="w-full text-xs sm:text-sm font-medium border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="Email ID *"
                    className="w-full text-xs sm:text-sm font-medium border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                    required
                  />

                  <textarea
                    name="address"
                    onChange={handleChange}
                    placeholder="Institute Address (City, State, PIN) *"
                    className="w-full text-xs sm:text-sm font-medium border border-gray-600 bg-gray-800/50 rounded-lg px-3 py-2.5 h-20 sm:h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Documents Section - Full width below */}
            <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-700">
              <h3 className="text-white text-sm font-semibold mb-3 border-b border-gray-600 pb-2">
                Documents
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                    Registration Certificate *
                  </label>
                  <div className="flex">
                    <label className="flex-1 flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50 cursor-pointer hover:border-blue-500 transition-colors">
                      <span className="text-xs sm:text-sm text-gray-300 font-medium">
                        Upload PDF/Image
                      </span>
                      <input
                        type="file"
                        name="registrationCertificate"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleChange}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
                    Brochure (Optional)
                  </label>
                  <div className="flex">
                    <label className="flex-1 flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800/50 cursor-pointer hover:border-blue-500 transition-colors">
                      <span className="text-xs sm:text-sm text-gray-300 font-medium">
                        Upload PDF
                      </span>
                      <input
                        type="file"
                        name="brochure"
                        accept=".pdf"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium px-4 py-3 rounded-lg hover:opacity-90 transition-opacity text-xs sm:text-sm"
              >
                Submit for Verification
              </button>
            </div>
          </form>

          <p className="text-xs sm:text-sm text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <Link
              href="/auth/login/partner"
              className="text-blue-400 hover:underline font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
