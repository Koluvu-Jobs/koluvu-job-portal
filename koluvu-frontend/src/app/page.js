// src/app/page.js

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
import SubscriptionPopup from "@koluvu/components/SubscriptionPopup";
const FuturisticQRSection = dynamic(() =>
  import("@koluvu/components/home/QRCodeSection")
);

// Metadata for SEO and performance
export const metadata = {
  title: "Koluvu - Connecting Jobs, Creating Futures | Job Portal India",
  description:
    "Find your dream job with Koluvu - India's leading job portal. Connect with top companies, build your career, and create your future.",
  keywords: "jobs, careers, employment, job search, hiring, recruitment, India",
  openGraph: {
    title: "Koluvu - Connecting Jobs, Creating Futures",
    description:
      "Find your dream job with Koluvu - India's leading job portal.",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <SubscriptionPopup />
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
          className="w-full px-4 py-12"
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
