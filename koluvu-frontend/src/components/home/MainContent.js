// src/components/home/MainContent.js

"use client";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import JobRow from "@koluvu/components/home/JobRow";
import { Sparkles, TrendingUp, Users, Clock, Award } from "lucide-react";

const BackgroundAnimation = dynamic(() => import("./BackgroundAnimation"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 w-full h-full pointer-events-none" />
  ),
});

const StatCard = ({ icon, title, value, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setCount((prev) => {
            if (prev < parseInt(value)) {
              return prev + Math.ceil(parseInt(value) / 20);
            }
            clearInterval(interval);
            return parseInt(value);
          });
        }, 50);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, value, delay]);

  return (
    <div
      ref={cardRef}
      className={`relative group p-3 md:p-4 lg:p-6 rounded-2xl bg-white border border-slate-200 hover:border-orange-300 hover:shadow-lg transition-all duration-500 transform hover:scale-105 cursor-pointer ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

      <div className="relative">
        <div className="flex items-center justify-between mb-2 lg:mb-3">
          <div className="p-1.5 md:p-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            {icon}
          </div>
          <div className="text-right">
            <div className="text-lg md:text-2xl lg:text-3xl font-bold text-orange-500">
              {count.toLocaleString()}
            </div>
            <div
              className="text-xs md:text-sm text-slate-600"
              style={{ fontSize: "12px" }}
            >
              {title}
            </div>
          </div>
        </div>
        <p className="text-slate-500" style={{ fontSize: "10px" }}>
          {description}
        </p>
      </div>
    </div>
  );
};

const fresherJobs = [
  {
    id: 1,
    title: "Junior Software Developer",
    company: "XYZ",
    location: "Remote",
    type: "Full-Time",
    salary: "₹6L/year",
    logo: "/company_logos/xyz_logo.jpg",
    badge: "New",
    titleStyle: "text-base",
  },
  {
    id: 2,
    title: "Frontend Developer Intern",
    company: "WebCraft",
    location: "Bangalore",
    type: "Internship",
    salary: "₹25K/month",
    logo: "/company_logos/webcrafts_logo.jpg",
    titleStyle: "text-base",
  },
  {
    id: 3,
    title: "Backend Engineer (Entry)",
    company: "DataSys",
    location: "Hybrid",
    type: "Full-Time",
    salary: "₹6.5L/year",
    logo: "/company_logos/datasystems_logo.png",
    badge: "Hot",
    titleStyle: "text-base",
  },
];

const experienceJobs = [
  {
    id: 1,
    title: "Senior Developer",
    company: "TechGiant",
    location: "Bangalore",
    type: "Full-Time",
    salary: "₹15L/year",
    logo: "/company_logos/tech_gaints_logo.png",
    titleStyle: "text-base",
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Innovate",
    location: "Delhi",
    type: "Full-Time",
    salary: "₹20L/year",
    logo: "/company_logos/innovate_inc_logo.jpg",
    titleStyle: "text-base",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudM",
    location: "Remote",
    type: "Contract",
    salary: "₹800/hr",
    logo: "/company_logos/cloudmasters_logo.jpg",
    titleStyle: "text-base",
  },
];

const remoteJobs = [
  {
    id: 1,
    title: "Content Writer",
    company: "RemoteW",
    location: "Remote",
    type: "Part-Time",
    salary: "₹500/hr",
    logo: "/company_logos/remote_works_logo.png",
    titleStyle: "text-base",
  },
  {
    id: 2,
    title: "UX Designer",
    company: "DigitalC",
    location: "Remote",
    type: "Full-Time",
    salary: "₹10L/year",
    logo: "/company_logos/digital_creations.jpg",
    titleStyle: "text-base",
  },
  {
    id: 3,
    title: "Customer Support",
    company: "GlobalS",
    location: "Remote",
    type: "Full-Time",
    salary: "₹4.5L/year",
    logo: "/company_logos/global_support_logo.jpg",
    titleStyle: "text-base",
  },
];

const internshipJobs = [
  {
    id: 1,
    title: "Marketing Intern",
    company: "GrowthM",
    location: "Hybrid",
    type: "Internship",
    salary: "₹15K/month",
    logo: "/company_logos/growth_marketing_logo.jpg",
    titleStyle: "text-base",
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "AILabs",
    location: "Remote",
    type: "Internship",
    salary: "₹20K/month",
    logo: "/company_logos/ai_labs_logo.png",
    titleStyle: "text-base",
  },
  {
    id: 3,
    title: "HR Intern",
    company: "TalentS",
    location: "Mumbai",
    type: "Internship",
    salary: "₹12K/month",
    logo: "/company_logos/talent_solutions_logo.png",
    titleStyle: "text-base",
  },
];

const partTimeJobs = [
  {
    id: 1,
    title: "Social Media Manager",
    company: "DigitalB",
    location: "Remote",
    type: "Part-Time",
    salary: "₹500/hr",
    logo: "/company_logos/digital_buzz_logo.jpg",
    titleStyle: "text-base",
  },
  {
    id: 2,
    title: "Graphic Designer",
    company: "CreativeM",
    location: "Hybrid",
    type: "Part-Time",
    salary: "₹600/hr",
    logo: "/company_logos/creative_minds_logo.jpg",
    titleStyle: "text-base",
  },
  {
    id: 3,
    title: "Tutor",
    company: "EduCare",
    location: "Remote",
    type: "Part-Time",
    salary: "₹400/hr",
    logo: "/company_logos/EduCare_logo.jpg",
    titleStyle: "text-base",
  },
];

const JobSection = ({ title, jobs, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`relative z-10 mb-8 md:mb-12 transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-1 w-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"></div>
        <h3
          className="text-xl md:text-2xl font-bold text-slate-900"
          style={{ fontSize: "20px" }}
        >
          {title}
        </h3>
      </div>
      <JobRow title={title} jobs={jobs} />
    </div>
  );
};

export default function MainContent() {
  const [isVisible, setIsVisible] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (mainRef.current) {
      observer.observe(mainRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={mainRef}
      className="relative w-full lg:w-2/4 space-y-6 md:space-y-8 mt-0 lg:mt-0 px-4 lg:px-0"
    >
      <BackgroundAnimation />

      {/* Remove or reduce the spacer for small screens */}
      {/* <div className="block lg:hidden" style={{ height: 250 }} /> */}

      {/* Header Section with responsive spacing */}
      <div className="relative z-10 text-center pb-8 md:pb-12 transition-all duration-1000 mt-0 sm:mt-28 md:mt-48 lg:mt-32">
        <div className="inline-flex items-center gap-2 md:gap-3 mb-4 px-3 md:px-4 py-2 bg-orange-50 rounded-full border border-orange-200">
          <Sparkles className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-orange-500" />
          <span className="text-orange-600 font-medium text-xs md:text-sm lg:text-base">
            Latest Job Opportunities
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-4">
          Discover Your Dream Career
        </h2>
        <p
          className="text-slate-600 text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed"
          style={{ fontSize: "14px" }}
        >
          Connect with top companies and find opportunities that match your
          skills and aspirations. Your next career move starts here.
        </p>
      </div>

      <JobSection title="Fresh Opportunities" jobs={fresherJobs} delay={300} />
      <JobSection title="Experience Roles" jobs={experienceJobs} delay={400} />
      <JobSection title="Remote Work" jobs={remoteJobs} delay={500} />
      <JobSection title="Internships" jobs={internshipJobs} delay={600} />
      <JobSection title="Part-Time Roles" jobs={partTimeJobs} delay={700} />
    </div>
  );
}
