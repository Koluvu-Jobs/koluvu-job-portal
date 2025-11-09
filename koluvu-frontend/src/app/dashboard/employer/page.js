// src/app/dashboard/employer/page.js

"use client";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import DashboardCards from "./components/DashboardCards";
import JobListings from "./components/JobListings";
import AICandidates from "./ai-candidates/page";
import RecentActivities from "./components/RecentActivites";
import { useTheme } from "./context/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

// Tab mapping for employer dashboard
const tabToSlug = {
  Dashboard: "",
  "Company Profile": "profile",
  "Post Job": "post-jobs",
  "Active Jobs": "active-jobs",
  "Expired Jobs": "expired-jobs",
  "Closed Jobs": "closed-jobs",
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
  Settings: "settings",
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

const ActiveJobsComponent = dynamic(() => import("./active-jobs/page"), {
  loading: () => <div className="p-8">Loading active jobs...</div>,
});

const ExpiredJobsComponent = dynamic(() => import("./expired-jobs/page"), {
  loading: () => <div className="p-8">Loading expired jobs...</div>,
});

const ClosedJobsComponent = dynamic(() => import("./closed-jobs/page"), {
  loading: () => <div className="p-8">Loading closed jobs...</div>,
});

const SettingsComponent = dynamic(() => import("./settings/page"), {
  loading: () => <div className="p-8">Loading settings...</div>,
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
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 min-h-screen animate-fadeIn">
      {/* Enhanced Welcome Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1E3B8B] via-[#2563EB] to-[#1E40AF] min-h-[200px] text-white shadow-xl rounded-2xl">
        {/* Background Pattern with enhanced opacity and animation */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              backgroundImage: 'url("/images/pattern-bg.png")',
              backgroundRepeat: "repeat",
              backgroundSize: "100px",
            }}
          ></div>
        </div>

        {/* Gradient Overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between h-full">
            {/* Left Section - Welcome Text */}
            <div className="mb-6 lg:mb-0">
              <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                <div className="mb-4 sm:mb-0 sm:mr-6">
                  <img
                    src="/images/koluvu-logo-white.png"
                    alt="Koluvu Logo"
                    className="h-10 sm:h-12 w-auto"
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                    {getGreeting()}, {getUserName()}! 👋
                  </h1>
                  <p className="text-base sm:text-lg text-blue-100 font-medium mt-2">
                    Welcome back to your recruitment dashboard
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-blue-100">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm sm:text-base opacity-90">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href={`/dashboard/employer/${user?.username}?tab=post-jobs`}
                className="inline-flex items-center space-x-2 bg-white text-[#1E3B8B] px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-gray-50 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg text-sm sm:text-base border border-white/20"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
                <span className="hidden xs:inline sm:inline">Post New Job</span>
                <span className="xs:hidden sm:hidden">Post Job</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Link
          href={`/dashboard/employer/${user?.username}?tab=ats`}
          className="group"
        >
          <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-blue-100 hover:border-blue-300 transition-all duration-200 hover:shadow-lg group-hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
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
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  ATS
                </h3>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Track applications
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href={`/dashboard/employer/${user?.username}?tab=interview-scheduler`}
          className="group"
        >
          <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-emerald-100 hover:border-emerald-300 transition-all duration-200 hover:shadow-lg group-hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0">
              <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600"
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
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Interviews
                </h3>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Schedule meetings
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href={`/dashboard/employer/${user?.username}?tab=boolean-search`}
          className="group"
        >
          <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-purple-100 hover:border-purple-300 transition-all duration-200 hover:shadow-lg group-hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600"
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
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Search
                </h3>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Find candidates
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href={`/dashboard/employer/${user?.username}?tab=verification`}
          className="group"
        >
          <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 rounded-xl border border-amber-100 hover:border-amber-300 transition-all duration-200 hover:shadow-lg group-hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 space-y-2 sm:space-y-0">
              <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600"
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
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  Verify
                </h3>
                <p className="text-xs text-gray-600 hidden sm:block">
                  Check credentials
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Dashboard Stats Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <DashboardCards />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <JobListings />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <RecentActivities />
          </div>
        </div>
      </div>

      {/* <AICandidates /> Removed AI candidate suggestion from dashboard */}
    </div>
  );
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const username = params?.username ?? null;
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
        // Preserve the tab query parameter during redirect
        const tabSlug = searchParams.get("tab");
        const redirectUrl = tabSlug
          ? `/dashboard/employer/${user.username}?tab=${tabSlug}`
          : `/dashboard/employer/${user.username}`;
        console.log("Redirecting to username-based dashboard:", redirectUrl);
        router.replace(redirectUrl);
      }
      return;
    }
  }, [loading, isAuthenticated, user, router, isUsernameRoute, searchParams]);

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
      router.replace("/dashboard/employee");
      return;
    }

    // Allow access for employers or users with employer profiles
    // --- PATCH: allow all employer dashboard pages for employer users, even if employer_profile is missing ---
    if (user && user.user_type === "employer") {
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
      ? `/dashboard/employer/${user?.username}?tab=${slug}`
      : `/dashboard/employer/${user?.username}`;
    router.push(href);
    setActiveTab(tabName);
  };

  // Render content based on active tab
  const renderTabContent = () => {
    return (
      <>
        {/* Show loading state while checking authentication */}
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : !isAuthenticated ? null : (
          (() => {
            switch (activeTab) {
              case "Dashboard":
                return <DashboardContent />;
              case "Company Profile":
                return <ProfileComponent />;
              case "Post Job":
                return <PostJobsComponent />;
              case "Active Jobs":
                return <ActiveJobsComponent />;
              case "Expired Jobs":
                return <ExpiredJobsComponent />;
              case "Closed Jobs":
                return <ClosedJobsComponent />;
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
              case "Settings":
                return <SettingsComponent />;
              case "Help Center":
                return <HelpCenterComponent />;
              default:
                return <DashboardContent />;
            }
          })()
        )}
      </>
    );
  };

  return renderTabContent();
}
