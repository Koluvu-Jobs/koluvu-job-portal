// src/app/dashboard/employer/page.js

"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import DashboardCards from "./components/DashboardCards";
import JobListings from "./components/JobListings";
import AICandidates from "./ai-candidates/page";
import RecentActivities from "./components/RecentActivites";
import NotificationInboxRow from "./NotificationInboxRow";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

// Tab mapping for employer dashboard
const tabToSlug = {
  Dashboard: "",
  "Company Profile": "profile",
  "Post Job": "post-jobs",
  "Boolean Search": "boolean-search",
  ATS: "ats",
  "AI Candidates": "ai-candidates",
  "Interview Scheduler": "interview-scheduler",
  "Proxying Detector": "proxying-detector",
  "Feedback Form": "feedback-form",
  "Candidate Status": "candidate-status",
  Verification: "verification",
  "Subscription Plans": "subscription-plans",
  "Help Center": "help-center",
};

const slugToTab = Object.fromEntries(
  Object.entries(tabToSlug).map(([k, v]) => [v, k])
);

// Lazy load components for different tabs
const ProfileComponent = dynamic(() => import("./profile/page"), {
  loading: () => <div className="p-8">Loading profile...</div>,
});

const PostJobsComponent = dynamic(() => import("./post-jobs/page"), {
  loading: () => <div className="p-8">Loading post jobs...</div>,
});

const BooleanSearchComponent = dynamic(() => import("./boolean-search/page"), {
  loading: () => <div className="p-8">Loading boolean search...</div>,
});

const ATSComponent = dynamic(() => import("./ats/page"), {
  loading: () => <div className="p-8">Loading ATS...</div>,
});

const AICandidatesComponent = dynamic(() => import("./ai-candidates/page"), {
  loading: () => <div className="p-8">Loading AI candidates...</div>,
});

const InterviewSchedulerComponent = dynamic(
  () => import("./interview-scheduler/page"),
  {
    loading: () => <div className="p-8">Loading interview scheduler...</div>,
  }
);

const ProxyingDetectorComponent = dynamic(
  () => import("./proxying-detector/page"),
  {
    loading: () => <div className="p-8">Loading proxying detector...</div>,
  }
);

const FeedbackFormComponent = dynamic(
  () => import("./interview-update/feedback/page"),
  {
    loading: () => <div className="p-8">Loading feedback form...</div>,
  }
);

const CandidateStatusComponent = dynamic(
  () => import("./interview-update/candidate-status/page"),
  {
    loading: () => <div className="p-8">Loading candidate status...</div>,
  }
);

const VerificationComponent = dynamic(() => import("./verification/page"), {
  loading: () => <div className="p-8">Loading verification...</div>,
});

const SubscriptionPlansComponent = dynamic(
  () => import("./subscription/plans/page"),
  {
    loading: () => <div className="p-8">Loading subscription plans...</div>,
  }
);

const HelpCenterComponent = dynamic(() => import("./help-center/page"), {
  loading: () => <div className="p-8">Loading help center...</div>,
});

// Main Dashboard Content
const DashboardContent = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getUserName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "there";
  };

  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1E3B8B] via-[#1E3B8B] to-[#1E3B8B] min-h-[200px] text-white shadow-md">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("/images/pattern-bg.png")',
              backgroundRepeat: "repeat",
              backgroundSize: "100px",
            }}
          ></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between h-full">
            {/* Left Section - Welcome Text */}
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img
                    src="/images/koluvu-logo-white.png"
                    alt="Koluvu Logo"
                    className="h-12 w-auto"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight">
                    {getGreeting()}, {getUserName()}! 👋
                  </h1>
                  <p className="text-lg text-gray-200 font-medium">
                    Welcome back to your recruitment dashboard
                  </p>
                </div>
              </div>
              <p className="text-gray-200 opacity-90">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Right Section - Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <NotificationInboxRow />
              <Link
                href="/dashboard/employer?tab=post-jobs"
                className="inline-flex items-center space-x-2 bg-white text-[#1E3B8B] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Post New Job</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Link href="/dashboard/employer?tab=ats" className="group">
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-lg group-hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">ATS</h3>
                <p className="text-xs text-gray-600">Track applications</p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/employer?tab=interview-scheduler"
          className="group"
        >
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all duration-200 hover:shadow-lg group-hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Interviews</h3>
                <p className="text-xs text-gray-600">Schedule meetings</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/employer?tab=boolean-search" className="group">
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-lg group-hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Search</h3>
                <p className="text-xs text-gray-600">Find candidates</p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/employer?tab=verification" className="group">
          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-amber-100 hover:border-amber-300 transition-all duration-200 hover:shadow-lg group-hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verify</h3>
                <p className="text-xs text-gray-600">Check credentials</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <JobListings />
        </div>
        <div>
          <RecentActivities />
        </div>
      </div>

      <AICandidates />
    </div>
  );
};

export default function DashboardPage({ username = null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const { user, loading, isAuthenticated } = useAuth();

  // If we're on the base route and have a username prop, don't redirect
  const isUsernameRoute = !!username;

  // Redirect to username-based URL if user is authenticated and we're not already on a username route
  useEffect(() => {
    if (!loading && isAuthenticated && user?.username && !isUsernameRoute) {
      const currentPath = window.location.pathname;
      // Only redirect if we're on the base employer dashboard path
      if (currentPath === "/dashboard/employer") {
        console.log(
          "Redirecting to username-based dashboard:",
          `/dashboard/employer/${user.username}`
        );
        router.replace(`/dashboard/employer/${user.username}`);
      }
      return;
    }
  }, [loading, isAuthenticated, user, router, isUsernameRoute]);

  // Authentication and role guard - simplified to avoid redirect loops
  useEffect(() => {
    console.log("Employer dashboard auth check:", {
      loading,
      isAuthenticated,
      user: user
        ? { id: user.id, email: user.email, user_type: user.user_type }
        : null,
      hasEmployerProfile: !!user?.employer_profile,
    });

    // Wait for auth to finish loading before making decisions
    if (loading) {
      console.log("Auth still loading, waiting...");
      return;
    }

    // If definitely not authenticated after loading is complete
    if (!isAuthenticated && !user) {
      console.log(
        "User not authenticated after loading complete, redirecting to login"
      );
      router.replace("/auth/login/employer");
      return;
    }

    // If user is authenticated but is definitely an employee (not employer)
    if (user && user.user_type === "employee" && !user.employer_profile) {
      console.log("User is employee, redirecting to employee dashboard");
      router.replace("/dashboard/employee");
      return;
    }

    // Allow access for employers or users with employer profiles
    if (user && (user.user_type === "employer" || user.employer_profile)) {
      console.log("Access granted - employer user detected");
      return;
    }

    // If we have a user but unclear role, allow access (better than redirect loop)
    if (user) {
      console.log(
        "User found with unclear role, allowing access to avoid redirect loop"
      );
      return;
    }
  }, [loading, isAuthenticated, user, router]);

  // Keep activeTab synced with URL
  useEffect(() => {
    const tabSlug = searchParams.get("tab") ?? "";
    const tabName = slugToTab[tabSlug] || "Dashboard";
    setActiveTab(tabName);
  }, [searchParams]);

  // Function to navigate when sidebar calls setActiveTab
  const navigateToTab = (tabName) => {
    const slug = tabToSlug[tabName] ?? "";
    const href = slug
      ? `/dashboard/employer?tab=${slug}`
      : "/dashboard/employer";
    router.push(href);
    setActiveTab(tabName);
  };

  // Render content based on active tab
  const renderTabContent = () => {
    // Show loading state while checking authentication
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Don't render content if not authenticated (will redirect)
    if (!isAuthenticated) {
      return null;
    }

    switch (activeTab) {
      case "Dashboard":
        return <DashboardContent />;
      case "Company Profile":
        return <ProfileComponent />;
      case "Post Job":
        return <PostJobsComponent />;
      case "Boolean Search":
        return <BooleanSearchComponent />;
      case "ATS":
        return <ATSComponent />;
      case "AI Candidates":
        return <AICandidatesComponent />;
      case "Interview Scheduler":
        return <InterviewSchedulerComponent />;
      case "Proxying Detector":
        return <ProxyingDetectorComponent />;
      case "Feedback Form":
        return <FeedbackFormComponent />;
      case "Candidate Status":
        return <CandidateStatusComponent />;
      case "Verification":
        return <VerificationComponent />;
      case "Subscription Plans":
        return <SubscriptionPlansComponent />;
      case "Help Center":
        return <HelpCenterComponent />;
      default:
        return <DashboardContent />;
    }
  };

  return renderTabContent();
}
