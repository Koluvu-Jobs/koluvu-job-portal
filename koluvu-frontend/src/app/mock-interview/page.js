// src/app/dashboard/employee/interview/page.js

"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import Header from "@koluvu/components/Header/Header";
import Footer from "@koluvu/components/Footer/Footer";

const faqs = [
  {
    q: "Is my data and voice recording secure?",
    a: "Absolutely. Your recordings and transcripts are private and only accessible to you. We use industry-standard encryption and never share your data without consent.",
  },
  {
    q: "How accurate is the AI feedback?",
    a: "Our feedback is powered by state-of-the-art AI models (Gemini, Whisper, Google TTS) and is designed to be as insightful and actionable as possible.",
  },
  {
    q: "Can I practice for different roles or interview types?",
    a: "Yes! You can select your role, experience level, and interview type (Technical, HR, Behavioral, etc.) for a tailored experience.",
  },
  {
    q: "Is it really free?",
    a: "Yes, you can practice as many times as you want for free. Premium features may be added in the future, but core practice is always free.",
  },
];

const testimonials = [
  {
    quote:
      "This platform helped me land my dream job! The AI feedback was spot on and the experience felt just like a real interview.",
    name: "Priya S.",
    role: "Frontend Developer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "I love how easy and private it is. Practicing with voice and getting instant tips made a huge difference in my confidence.",
    name: "Rahul M.",
    role: "Data Analyst",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "The best mock interview tool I've tried. The questions were relevant and the feedback was actionable.",
    name: "Ayesha K.",
    role: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

const logos = [
  {
    name: "Google",
    url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg",
  },
  {
    name: "Amazon",
    url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/amazon.svg",
  },
  {
    name: "Microsoft",
    url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/microsoft.svg",
  },
  {
    name: "Facebook",
    url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg",
  },
  {
    name: "Twitter",
    url: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg",
  },
];

const stats = [
  { label: "Interviews Simulated", value: "1,200+" },
  { label: "Avg. User Rating", value: "4.9/5" },
  { label: "Feedback Given", value: "5,000+" },
];

const DynamicChevronDown = dynamic(
  () => import("lucide-react").then((mod) => mod.ChevronDown),
  { ssr: false }
);

export default function MockInterviewLanding() {
  const router = useRouter();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div
        className="flex-1 bg-gray-50 overflow-x-hidden font-sans"
        style={{ fontFamily: "Inter, Segoe UI, Roboto, Arial, sans-serif" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center"
          >
            {/* Hero Section */}
            <section className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-16 px-4 md:px-8">
              {/* Left: Text Content */}
              <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                <h1 className="text-4xl md:text-5xl bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-blue-600 bg-clip-text text-transparent font-extrabold tracking-tight mb-4 leading-tight">
                  Land Your Dream Job with AI powered mock interviews
                </h1>
                <p className="text-lg md:text-xl text-slate-700 font-normal tracking-normal mb-7 max-w-lg">
                  Simulate real interviews, get instant feedback, and build
                  confidence—free, private, and always available.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto mb-3">
                  <button
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition duration-300 transform hover:scale-105 text-lg flex items-center gap-2"
                    onClick={() => router.push("/mock-interview/setup")}
                  >
                    <span>Start My Mock Interview</span>
                    <span aria-hidden="true" className="text-xl">
                      🎤
                    </span>
                  </button>
                  <button
                    type="button"
                    className="px-8 py-3 bg-white border border-indigo-200 text-indigo-700 font-medium rounded-lg shadow hover:bg-indigo-50 transition duration-200 text-lg flex items-center gap-2"
                    onClick={() => {
                      const el = document.getElementById("how-it-works");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <span>See How It Works</span>
                    <span aria-hidden="true" className="text-xl">
                      →
                    </span>
                  </button>
                </div>
                {/* Trusted by Professionals in Hero */}
                <div className="w-full max-w-lg flex flex-col items-center mt-6">
                  <div className="text-xs text-slate-500 mb-2 tracking-wide uppercase text-center">
                    Trusted by professionals from
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-6 w-full">
                    {logos.map((logo, i) => (
                      <div
                        key={logo.name}
                        className="flex flex-col items-center"
                      >
                        <img
                          src={logo.url}
                          alt={logo.name + " logo"}
                          className="h-8 w-8 md:h-10 md:w-10 object-contain mb-1"
                          style={{ filter: "grayscale(1)", opacity: 0.8 }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Right: Hero Image */}
              <div className="flex-1 flex items-center justify-center mt-10 md:mt-0">
                <img
                  src="/images/hero-pic.png"
                  alt="AI Mock Interview Hero"
                  className="w-full max-w-xl h-auto rounded-2xl shadow-xl border border-indigo-100 bg-white object-contain"
                  style={{ boxShadow: "0 8px 32px 0 rgba(99,102,241,0.10)" }}
                />
              </div>
            </section>

            {/* What is AI Mock Interview? */}
            <section className="w-full max-w-3xl mx-auto py-10 px-4 md:px-0">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-indigo-700 mb-3 text-center">
                What is an AI Mock Interview?
              </h2>
              <p className="text-slate-700 text-center text-base md:text-lg font-normal tracking-normal max-w-2xl mx-auto">
                An AI Mock Interview simulates a real interview experience using
                advanced artificial intelligence. You&apos;ll interact with a
                virtual interviewer that asks domain-specific questions, listens
                to your spoken answers, transcribes your responses in real time,
                and provides instant, actionable feedback—just like a real
                interview, but in a safe, supportive environment.
              </p>
            </section>

            {/* Section Divider */}
            <div className="w-full flex justify-center">
              <svg
                height="32"
                width="100%"
                viewBox="0 0 1440 32"
                className="block"
              >
                <path
                  fill="#e0e7ff"
                  fillOpacity="1"
                  d="M0,16L1440,32L1440,32L0,32Z"
                ></path>
              </svg>
            </div>

            {/* How It Works */}
            <section
              id="how-it-works"
              className="w-full max-w-4xl mx-auto py-10 px-4 md:px-0"
            >
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-indigo-700 mb-6 text-center">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[
                  {
                    icon: "📝",
                    label: "Setup",
                    desc: "Choose your role, experience, and interview type.",
                  },
                  {
                    icon: "🔊",
                    label: "AI Asks",
                    desc: "AI asks questions, you answer via mic.",
                  },
                  {
                    icon: "📜",
                    label: "Transcript",
                    desc: "See live transcripts and get encouragement.",
                  },
                  {
                    icon: "📈",
                    label: "Feedback",
                    desc: "Get a detailed feedback summary at the end.",
                  },
                  {
                    icon: "📚",
                    label: "History",
                    desc: "Review all your past sessions anytime.",
                  },
                ].map((step, i) => (
                  <div
                    key={step.label}
                    className="flex flex-col items-center text-center"
                  >
                    <span className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-3xl mb-2 border-2 border-indigo-200 shadow">
                      {step.icon}
                    </span>
                    <div className="font-medium text-indigo-700 mb-1 tracking-tight">
                      {step.label}
                    </div>
                    <div className="text-slate-600 text-sm font-normal tracking-normal">
                      {step.desc}
                    </div>
                    {i < 4 && (
                      <span className="hidden md:block w-8 h-1 bg-indigo-100 mt-3 mb-3" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Key Features */}
            <section className="w-full max-w-5xl mx-auto py-10 px-4 md:px-0">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-indigo-700 mb-6 text-center">
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "🤖",
                    title: "Human-like AI Interviewer",
                    desc: "Get domain-specific questions tailored to your role and experience. The AI adapts to your answers for a realistic flow.",
                  },
                  {
                    icon: "🎤",
                    title: "Live Voice & Transcript",
                    desc: "Speak your answers, see real-time transcripts, and review your performance instantly.",
                  },
                  {
                    icon: "💡",
                    title: "Smart AI Feedback",
                    desc: "Receive instant, actionable feedback and improvement tips after every session.",
                  },
                  {
                    icon: "🔒",
                    title: "Private & Secure",
                    desc: "Your data and recordings are encrypted and never shared without your consent.",
                  },
                  {
                    icon: "🌐",
                    title: "Multi-Language Support",
                    desc: "Practice interviews in English or your preferred language.",
                  },
                  {
                    icon: "📈",
                    title: "Progress Tracking",
                    desc: "See your improvement over time and revisit past sessions anytime.",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="flex flex-col items-center bg-white rounded-2xl px-6 py-8 shadow-md border border-slate-100 hover:shadow-lg transition-shadow"
                  >
                    <span className="text-3xl mb-3">{f.icon}</span>
                    <div className="font-medium text-indigo-700 mb-1 text-center tracking-tight">
                      {f.title}
                    </div>
                    <div className="text-slate-600 text-sm text-center font-normal tracking-normal">
                      {f.desc}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Why Practice with Us? */}
            <section className="w-full max-w-4xl mx-auto py-10 px-4 md:px-0">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-indigo-700 mb-6 text-center">
                Why Practice with Us?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-indigo-50 rounded-xl p-6 text-center shadow">
                  <div className="text-2xl mb-2">🚀</div>
                  <div className="font-medium text-indigo-800 mb-1 tracking-tight">
                    Boost Your Confidence
                  </div>
                  <div className="text-slate-600 text-sm font-normal">
                    Practice as many times as you want, whenever you want. No
                    pressure, just progress.
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-xl p-6 text-center shadow">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="font-medium text-indigo-800 mb-1 tracking-tight">
                    Safe & Supportive
                  </div>
                  <div className="text-slate-600 text-sm font-normal">
                    No judgment, no stress. Our AI is here to help you grow, not
                    to grade you.
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-xl p-6 text-center shadow">
                  <div className="text-2xl mb-2">🌟</div>
                  <div className="font-medium text-indigo-800 mb-1 tracking-tight">
                    Trusted by Job Seekers
                  </div>
                  <div className="text-slate-600 text-sm font-normal">
                    Hundreds of users have improved their interview skills with
                    our platform.
                  </div>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="w-full max-w-4xl mx-auto py-10 px-4 md:px-0">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-indigo-700 mb-6 text-center">
                What Our Users Say
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center border border-slate-100 hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-16 h-16 rounded-full mb-3 object-cover border-2 border-indigo-100"
                    />
                    <div className="text-slate-700 italic mb-3 text-sm">
                      “{t.quote}”
                    </div>
                    <div className="font-medium text-indigo-700 text-sm">
                      {t.name}
                    </div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Trusted by Professionals Section */}
            <section className="w-full bg-indigo-50 py-10 px-4 md:px-0 flex flex-col items-center border-t border-b border-indigo-100 my-8">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-indigo-700 mb-6 text-center">
                Trusted by Professionals from
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-8 w-full max-w-2xl">
                {logos.map((logo, i) => (
                  <div key={logo.name} className="flex flex-col items-center">
                    <img
                      src={logo.url}
                      alt={logo.name + " logo"}
                      className="h-10 w-10 md:h-12 md:w-12 object-contain mb-2"
                      style={{ filter: "grayscale(1)", opacity: 0.8 }}
                    />
                    <span className="text-xs text-slate-500 mt-1">
                      {logo.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Stats Row */}
            <section className="w-full max-w-3xl mx-auto py-8 px-4 md:px-0 flex flex-col md:flex-row items-center justify-center gap-8">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center flex-1"
                >
                  <div className="text-2xl md:text-3xl font-semibold text-indigo-700 mb-1 animate-pulse-slow">
                    {s.value}
                  </div>
                  <div className="text-xs text-slate-500 font-normal tracking-wide uppercase">
                    {s.label}
                  </div>
                </div>
              ))}
            </section>

            {/* FAQ */}
            <section className="w-full max-w-3xl mx-auto py-10 px-4 md:px-0">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-indigo-700 mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="divide-y divide-gray-200 rounded-xl bg-white shadow-lg overflow-hidden">
                {faqs.map((faq, i) => (
                  <div key={faq.q} className="px-6 py-4">
                    <button
                      className="flex justify-between items-center w-full text-left font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 focus:outline-none"
                      onClick={() => toggleFAQ(i)}
                    >
                      <span>{faq.q}</span>
                      {isMounted && (
                        <DynamicChevronDown
                          className={`w-5 h-5 text-indigo-500 transition-transform duration-200 ${
                            openFAQ === i ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>
                    {openFAQ === i && (
                      <div className="mt-4 text-slate-700 text-sm font-normal tracking-normal">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Final CTA */}
            <section className="w-full max-w-2xl mx-auto py-12 px-4 md:px-0 flex flex-col items-center">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-indigo-700 mb-4 text-center">
                Ready to Ace Your Next Interview?
              </h2>
              <button
                className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-medium rounded-xl shadow-lg text-base md:text-lg tracking-tight transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 animate-glow"
                onClick={() => router.push("/mock-interview/setup")}
                aria-label="Start My Mock Interview Now"
              >
                Start My Mock Interview Now
              </button>
              <div className="text-xs text-gray-500 mt-2 font-normal">
                It's free, private, and takes less than 5 minutes to get
                started.
              </div>
            </section>

            {/* Custom CSS for subtle CTA animation and stats pulse */}
            <style jsx global>{`
              .animate-glow {
                animation: glow 2s infinite alternate;
              }
              @keyframes glow {
                from {
                  box-shadow: 0 0 16px 2px #a5b4fc, 0 2px 8px 0 #6366f1;
                }
                to {
                  box-shadow: 0 0 32px 8px #c7d2fe, 0 2px 16px 0 #a5b4fc;
                }
              }
              .animate-pulse-slow {
                animation: pulse-slow 2.5s infinite;
              }
              @keyframes pulse-slow {
                0%,
                100% {
                  opacity: 1;
                }
                50% {
                  opacity: 0.7;
                }
              }
            `}</style>
          </motion.div>
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
