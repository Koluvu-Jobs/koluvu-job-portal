// src/app/kolink/page.js
import React from "react";

export const metadata = {
  title: "Kolink - Professional Social Network | Koluvu",
  description:
    "Connect with professionals, share insights, and build your network with Kolink by Koluvu.",
};

export default function KolinkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8" style={{ paddingTop: 0 }}>
      <style>{`body { padding-top: 0 !important; }`}</style>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 pt-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Kolink
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional Social Network - Connect, Share, and Grow Your Career
          </p>
        </div>

        {/* Coming Soon Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're building something amazing! Kolink will be your professional
              social network where you can:
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: "🤝",
                title: "Network with Professionals",
                description:
                  "Connect with industry experts and like-minded professionals",
              },
              {
                icon: "�‍🏫",
                title: "Find Mentors",
                description:
                  "Connect with experienced mentors to guide your career",
              },
              {
                icon: "💡",
                title: "Share Insights",
                description:
                  "Share your knowledge and learn from others in your field",
              },
              {
                icon: "📈",
                title: "Career Growth",
                description:
                  "Discover opportunities and accelerate your career development",
              },
              {
                icon: "🎯",
                title: "Industry Updates",
                description:
                  "Stay updated with the latest trends in your industry",
              },
              {
                icon: "💼",
                title: "Business Opportunities",
                description:
                  "Find collaboration opportunities and potential business partners",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 bg-gray-50 rounded-xl"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Notification Signup */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Be the First to Know</h3>
            <p className="mb-6">
              Get notified when Kolink launches and be among the first to join
              our professional community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
