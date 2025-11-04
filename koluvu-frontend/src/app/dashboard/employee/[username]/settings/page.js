"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import EmployeeDashboard from "../../dashboard-component";

export default function UserSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading, isAuthenticated } = useAuth();
  const username = params.username;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/login/employee");
      return;
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Use the same EmployeeDashboard component but force it to show settings
  return <EmployeeDashboard username={username} forceTab="Account Settings" />;
}
