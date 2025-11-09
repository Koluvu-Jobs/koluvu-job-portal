"use client";

import { useParams, useSearchParams } from "next/navigation";
import DashboardPage from "../page";

export default function UsernameDashboardPage() {
  // The main DashboardPage component already handles username and tab parameters
  // so we can just render it directly
  return <DashboardPage />;
}
