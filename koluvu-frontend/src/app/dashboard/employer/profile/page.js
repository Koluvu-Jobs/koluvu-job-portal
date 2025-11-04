"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const EmployerProfileRedirect = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const getUsername = () => {
      if (user?.username) return user.username;
      if (user?.email) return user.email.split("@")[0];
      return "user";
    };

    const username = getUsername();
    router.replace(`/dashboard/employer/${username}/profile`);
  }, [user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-600">Redirecting to your profile...</p>
    </div>
  );
};

export default EmployerProfileRedirect;
