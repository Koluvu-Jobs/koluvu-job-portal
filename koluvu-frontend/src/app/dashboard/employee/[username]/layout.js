"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "../components/sidebar";

// Create query client
const queryClient = new QueryClient();

export default function UsernameLayout({ children, params }) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-50">

        {/* Main Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </QueryClientProvider>
  );
}
