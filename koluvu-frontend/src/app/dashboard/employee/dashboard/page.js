// src/app/main/dashboard/employee/dashboard/page.js
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard by default
    router.push("/main/dashboard/employee/dashboard");
  }, [router]);

  return null;
}
