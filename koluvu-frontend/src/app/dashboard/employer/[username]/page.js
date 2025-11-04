"use client";

import { useParams } from "next/navigation";
import DashboardPage from "../page";

export default function UsernameDashboardPage() {
  const params = useParams();
  
  // Pass the username as a prop to the main dashboard
  return <DashboardPage username={params.username} />;
}