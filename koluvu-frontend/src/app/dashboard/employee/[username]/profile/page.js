"use client";

import React, { useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Profile from "../../profile/profile";

export default function UserProfilePage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { user, loading, isAuthenticated } = useAuth();
  const username = params.username;
  const tab = searchParams.get("tab");

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

  // Pass an editMode prop to make the profile immediately editable
  return (
    <Profile
      isDarkMode={false}
      initialEditMode={true}
      username={username}
      activeTabFromUrl={tab}
    />
  );
}
