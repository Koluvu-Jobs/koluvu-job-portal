// src/app/page.js

"use client";

import Header from "@koluvu/components/Header/Header";
import dynamic from "next/dynamic";
import HeroSection from "@koluvu/components/home/HeroSection";
import JobSearchSection from "@koluvu/components/home/JobSearchSection";
import FeaturesSection from "@koluvu/components/home/FeaturesSection";
const FAQSection = dynamic(() => import("@koluvu/components/home/FAQSection"));
const NewsletterSection = dynamic(() =>
  import("@koluvu/components/home/NewsletterSection")
);
import Footer from "@koluvu/components/Footer/Footer";
const SuccessStories = dynamic(() =>
  import("@koluvu/components/home/SuccessStories")
);
import SidebarContent from "@koluvu/components/home/SidebarContent";
import MainContent from "@koluvu/components/home/MainContent";
const FuturisticQRSection = dynamic(() =>
  import("@koluvu/components/home/QRCodeSection")
);
import { useAuth } from "@/contexts/AuthContext";
import { getRedirectPath } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, userType, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if we have valid auth data and we're not loading
    if (!loading && user && userType) {
      const redirectPath = getRedirectPath(userType, user.username);
      console.log(`Redirecting authenticated ${userType} to:`, redirectPath);
      router.push(redirectPath);
    }
  }, [loading, user, userType, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, show nothing (will redirect)
  if (user && userType) {
    return null;
  }

  // Show main page for non-authenticated users
  return (
    <>
      <Header />
      <main className="overflow-hidden">
        <HeroSection />

        {/* Added padding here for the gap */}
        <div>
          {/* Job Search Section - full width */}
          <div className="bg-white w-full">
            <JobSearchSection />
          </div>
        </div>

        {/* Main content section with centered headings */}
        <div
          className="w-full px-4 py-12 bg-slate-50"
          style={{ height: "auto", overflow: "visible" }}
        >
          {" "}
          {/* Removed container mx-auto, added w-full */}
          <div
            className="flex flex-col lg:flex-row lg:gap-8 lg:items-start"
            style={{ height: "auto", overflow: "visible" }}
          >
            <SidebarContent position="left" className="lg:w-1/3" />
            <MainContent className="lg:w-1/3" />
            <SidebarContent position="right" className="lg:w-1/3" />
          </div>
        </div>

        <FeaturesSection />
        <SuccessStories />
        <FAQSection />

        <FuturisticQRSection />

        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
