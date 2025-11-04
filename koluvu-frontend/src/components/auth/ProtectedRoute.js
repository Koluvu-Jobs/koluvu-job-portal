"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({
  children,
  requiredRole,
  fallbackUrl = "/auth/login/employee",
}) => {
  const { user, userType, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check authentication
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to login");
        router.push(fallbackUrl);
        return;
      }

      // Check role authorization
      if (requiredRole && userType !== requiredRole) {
        console.log(
          `Role mismatch: required '${requiredRole}', user has '${userType}'`
        );

        // Redirect to correct dashboard based on user role
        const dashboardMap = {
          employee: "/dashboard/employee",
          employer: "/dashboard/employer",
          partner: "/dashboard/partner",
          admin: "/dashboard/admin",
        };

        const correctDashboard = dashboardMap[userType];
        if (correctDashboard && userType !== requiredRole) {
          router.push(correctDashboard);
        } else {
          // If no valid dashboard, redirect to login
          router.push(fallbackUrl);
        }
        return;
      }
    }
  }, [loading, isAuthenticated, userType, requiredRole, router, fallbackUrl]);

  // Show loading state
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

  // Don't render if not authenticated or wrong role
  if (!isAuthenticated || (requiredRole && userType !== requiredRole)) {
    return null;
  }

  // Render protected content
  return children;
};

export default ProtectedRoute;
