// src/app/layout.js

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "../styles/globals.css";
import KoluvuChatbot from "@/components/chatbot/KoluvuChatbot";
import { Inter } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ToastProvider from "@/components/ToastProvider";

config.autoAddCss = false;

// Optimize font loading with Next.js font optimization
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Koluvu - Job Portal",
  description: "Find jobs, post jobs, and explore career opportunities",
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`h-full ${inter.variable}`}
    >
      <head>
        {/* Critical CSS for LCP optimization removed to prevent hydration mismatch. Add these styles to globals.css instead. */}
      </head>
      <body
        suppressHydrationWarning
        className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 antialiased ${inter.className}`}
        style={{
          fontSize: "14px",
        }}
      >
        <AuthProvider>
          <NotificationProvider>
            {children}
            <KoluvuChatbot />
          </NotificationProvider>
        </AuthProvider>
        <ToastProvider />
      </body>
    </html>
  );
}
