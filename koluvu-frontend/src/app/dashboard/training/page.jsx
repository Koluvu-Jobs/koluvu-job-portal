//src/app/main/dashboard/training/page.js

"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrainingHeader } from "@/components/Header/TrainingHeader";
import Footer from "@/components/Footer/Footer";
import InstituteSetupModal from "@koluvu/components/training/InstituteSetupModal";
import PostTrainingPage from "./PostTrainingPage";
import CoursesOfferedPage from "./CoursesOfferedPage";
import ActiveTrainingPostPage from "./ActiveTrainingPostPage";
import ExpiredTrainingPostPage from "./ExpiredTrainingPostPage";
import DraftTrainingPostPage from "./DraftTrainingPostPage";
import PlacementsPage from "./PlacementsPage";
import InternshipPage from "./InternshipPage";
import NotificationsPage from "./NotificationsPage";
import ProfileSetupPage from "./ProfileSetupPage";
import Sidebar from "./Sidebar";
import InboxPage from "./InboxPage";
import AccountSettingsPage from "./AccountSettingsPage";
import ContactUsPage from "./ContactUsPage";
import LogoutPage from "./LogoutPage";
import BillingsPage from "./BillingsPage";
import AdvancedSearch from "./advancedsearch";
import KoluvuBusiness from "./koluvu-business.jsx";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";

// ---------------- Tab mapping ----------------
const tabToSlug = {
  Dashboard: "",
  "Profile Setup": "profile",
  "Post Training": "post",
  "Active Training post": "active",
  "Expired Training post": "expired",
  "Draft Training post": "draft",
  "Courses offered": "courses",
  "Advanced Search": "search",
  placements: "placements",
  internship: "internship",
  notifications: "notifications",
  inbox: "inbox",
  billings: "billings",
  "account settings": "account-settings",
  "contact us": "contact-us",
  logout: "logout",
  login: "login",
  register: "register",
};
const slugToTab = Object.fromEntries(
  Object.entries(tabToSlug).map(([k, v]) => [v, k])
);

const data = [
  { name: "Week 1", enrollments: 30 },
  { name: "Week 2", enrollments: 45 },
  { name: "Week 3", enrollments: 70 },
  { name: "Week 4", enrollments: 50 },
  { name: "Week 5", enrollments: 55 },
  { name: "Week 6", enrollments: 65 },
];

const DashboardContent = ({ profileData, dashboardStats }) => {
  // Use dashboard stats from API or fallback to defaults
  const stats = dashboardStats || {
    programs: { total: 0, active: 0, expired: 0, draft: 0 },
    enrollments: { total: 0, active: 0, completed: 0 },
    monthly_views: 0,
    enrollment_trend: data
  };

  return (
  <>
    {/* Institute Profile Info */}
    {profileData && (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profileData.organization_name || "Your Institute"}</h2>
              <p className="text-gray-600 mt-1">{profileData.contact_person && `Contact: ${profileData.contact_person}`}</p>
            </div>
            {profileData.website && (
              <a 
                href={profileData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                🌐 Visit Website
              </a>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {profileData.phone && (
              <div>
                <span className="text-gray-500">📞 Phone:</span>
                <p className="font-medium">{profileData.phone}</p>
              </div>
            )}
            {profileData.email && (
              <div>
                <span className="text-gray-500">📧 Email:</span>
                <p className="font-medium">{profileData.email}</p>
              </div>
            )}
            {profileData.address && (
              <div>
                <span className="text-gray-500">📍 Address:</span>
                <p className="font-medium">{profileData.address}</p>
              </div>
            )}
          </div>

          {(profileData.founded_year || profileData.team_size || profileData.experience_years) && (
            <div className="flex gap-6 mt-4 pt-4 border-t border-gray-200 text-sm">
              {profileData.founded_year && (
                <div>
                  <span className="text-gray-500">Founded:</span>
                  <span className="font-medium ml-1">{profileData.founded_year}</span>
                </div>
              )}
              {profileData.team_size && (
                <div>
                  <span className="text-gray-500">Team Size:</span>
                  <span className="font-medium ml-1">{profileData.team_size}</span>
                </div>
              )}
              {profileData.experience_years && (
                <div>
                  <span className="text-gray-500">Experience:</span>
                  <span className="font-medium ml-1">{profileData.experience_years} years</span>
                </div>
              )}
            </div>
          )}

          {/* Social Links */}
          {(profileData.linkedin || profileData.twitter || profileData.facebook) && (
            <div className="flex gap-4 mt-4">
              {profileData.linkedin && (
                <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                  LinkedIn
                </a>
              )}
              {profileData.twitter && (
                <a href={profileData.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                  Twitter
                </a>
              )}
              {profileData.facebook && (
                <a href={profileData.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                  Facebook
                </a>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )}

    {/* Stats Cards - Responsive Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📄</span>
            <div>
              <p className="text-sm text-gray-500">Total Programs</p>
              <h3 className="text-xl font-bold">{stats.programs.total}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">✅</span>
            <div>
              <p className="text-sm text-gray-500">Active Programs</p>
              <h3 className="text-xl font-bold">{stats.programs.active}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <div>
              <p className="text-sm text-gray-500">Total Enrollments</p>
              <h3 className="text-xl font-bold">{stats.enrollments.total}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Chart and Notifications - Responsive Layout */}
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="lg:flex-1">
        <Card className="h-full">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-3">Enrollments Trend</h2>
            <div className="h-60 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.enrollment_trend}
                  margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="enrollments"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications - Responsive Width */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <Card className="h-full">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-3">Recent Notifications</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-xl">📩</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    New Enrollment
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    You have a new enrollment request
                  </p>
                  <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">⚡</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    Subscription Alert
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Your subscription expires in 3 days
                  </p>
                  <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">💬</span>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    Student Message
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    New message from student
                  </p>
                  <p className="text-xs text-gray-400 mt-1">4 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Recent Activities - Responsive Card */}
    <div className="mt-6">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-3">Recent Activities</h2>
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="text-xl">📩</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">
                  New Enrollment
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  You have a new enrollment request
                </p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">
                  Subscription Alert
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Your subscription expires in 3 days
                </p>
                <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </>
)};

export default function TrainingInstituteDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoize searchParams parsing to prevent hook order changes
  const currentSlug = useMemo(
    () => searchParams.get("tab") ?? "",
    [searchParams]
  );

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Profile setup modal states
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Check profile completeness on mount
  useEffect(() => {
    const checkProfileCompleteness = async () => {
      console.log("🔍 Starting profile completeness check...");
      try {
        console.log("📡 Calling API: /api/training/profile/check-completeness");
        const response = await fetch("/api/training/profile/check-completeness", {
          method: "GET",
          credentials: 'include', // Important: send cookies with the request
        });

        console.log("📥 Response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Profile data received:", data);
          setProfileData(data.profile);
          
          // Show modal if profile is incomplete
          if (!data.is_complete) {
            console.log("🚨 Profile incomplete! Showing modal. Missing fields:", data.missing_fields);
            setShowSetupModal(true);
          } else {
            console.log("✅ Profile is complete!");
          }
        } else {
          console.error("❌ Failed to check profile completeness. Status:", response.status);
          const errorText = await response.text();
          console.error("Error response:", errorText);
        }
      } catch (error) {
        console.error("💥 Error checking profile:", error);
      } finally {
        setIsCheckingProfile(false);
        console.log("🏁 Profile check complete");
      }
    };

    checkProfileCompleteness();
  }, []);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch("/api/training/dashboard/statistics", {
          method: "GET",
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Dashboard statistics loaded:", data);
          setDashboardStats(data);
        } else {
          console.error("❌ Failed to fetch dashboard statistics");
        }
      } catch (error) {
        console.error("💥 Error fetching dashboard statistics:", error);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleProfileSubmit = async (formData) => {
    try {
      console.log("💾 Submitting profile data...");
      const response = await fetch("/api/training/profile/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("❌ Failed to save profile:", error);
        throw new Error(error.message || "Failed to save profile");
      }

      const updatedProfile = await response.json();
      console.log("✅ Profile saved successfully:", updatedProfile);
      setProfileData(updatedProfile);
      setShowSetupModal(false);
      
      // Show success message
      alert("Profile setup completed successfully!");
    } catch (error) {
      console.error("💥 Error submitting profile:", error);
      throw error;
    }
  };

  // Check for training_provider/partner authentication
  useEffect(() => {
    const checkAuth = async () => {
      // Since user_type is in httpOnly cookies, we trust the middleware
      // If we reached this page, we're authenticated as partner
      console.log("✅ Authentication check: User is authenticated as partner");
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // ---- Keep activeTab synced with URL ----
  useEffect(() => {
    const tabName = slugToTab[currentSlug] || "Dashboard";
    setActiveTab(tabName);
  }, [currentSlug]);

  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      setSidebarOpen(!isMobileView);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Show login page only if explicitly requesting login
  if (!isLoading && currentSlug === "login") {
    return <LoginPage />;
  }

  // Show register page if explicitly requesting register
  if (currentSlug === "register") {
    return <RegisterPage />;
  }

  // Show loading state
  if (isLoading || isCheckingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {isCheckingProfile ? "Checking your profile..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  // ---- Function to navigate when sidebar calls setActiveTab ----
  const navigateToTab = (tabName) => {
    const slug = tabToSlug[tabName] ?? "";
    const href = slug
      ? `/dashboard/training?tab=${slug}`
      : "/dashboard/training";
    router.push(href);
    setActiveTab(tabName);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardContent profileData={profileData} dashboardStats={dashboardStats} />;
      case "Profile Setup":
        return <ProfileSetupPage />;
      case "Post Training":
        return <PostTrainingPage />;
      case "Active Training post":
        return <ActiveTrainingPostPage />;
      case "Expired Training post":
        return <ExpiredTrainingPostPage />;
      case "Draft Training post":
        return <DraftTrainingPostPage />;
      case "Courses offered":
        return <CoursesOfferedPage />;
      case "Advanced Search":
        return <AdvancedSearch />;
      case "Koluvu Business":
        return <KoluvuBusiness />;
      case "placements":
        return <PlacementsPage />;
      case "internship":
        return <InternshipPage />;
      case "notifications":
        return <NotificationsPage />;
      case "inbox":
        return <InboxPage />;
      case "billings":
        return <BillingsPage />;
      case "account settings":
        return <AccountSettingsPage />;
      case "contact us":
        return <ContactUsPage />;
      case "logout":
        return <LogoutPage />;
      case "login":
        return <LoginPage />;
      case "register":
        return <RegisterPage />;
      default:
        return <DashboardContent profileData={profileData} dashboardStats={dashboardStats} />;
    }
  };

  // Page title mapping
  const pageTitles = {
    "Dashboard": "Training Institute Dashboard",
    "Profile Setup": "Institute Profile",
    "Post Training": "Post Training",
    "Active Training post": "Active Trainings",
    "Expired Training post": "Expired Trainings",
    "Draft Training post": "Draft Trainings",
    "Courses offered": "Courses Offered",
    "Advanced Search": "Advanced Search",
    "placements": "Placements",
    "internship": "Internships",
    "notifications": "Notifications",
    "inbox": "Inbox",
    "billings": "Billing",
    "account settings": "Account Settings",
    "contact us": "Contact Us",
  };

  const currentPageTitle = pageTitles[activeTab] || "Training Institute Dashboard";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Institute Setup Modal */}
      <InstituteSetupModal
        isOpen={showSetupModal}
        onClose={() => {}} // Prevent closing until setup is complete
        onSubmit={handleProfileSubmit}
        existingData={profileData}
      />

      {/* Training Header - At the very top */}
      <TrainingHeader
        pageTitle={currentPageTitle}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        showSidebarToggle={true}
        isSidebarOpen={sidebarOpen}
        profileData={profileData}
      />

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 bg-gray-100">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={navigateToTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isMobile={isMobile}
        />

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {/* Content Container with Responsive Padding */}
          <div className="p-3 sm:p-4 md:p-6">{renderContent()}</div>
        </main>
      </div>

      {/* Original Footer */}
      <Footer />
    </div>
  );
}
