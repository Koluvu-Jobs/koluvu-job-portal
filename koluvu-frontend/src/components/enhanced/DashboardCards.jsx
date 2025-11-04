// src/components/enhanced/DashboardCards.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, TrendingUp, Star } from "lucide-react";

const DashboardCards = ({ userType = "employee" }) => {
  const employeeCards = [
    {
      title: "Applications Sent",
      value: "24",
      change: "+12%",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "Profile Views",
      value: "1,247",
      change: "+5%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Interview Calls",
      value: "8",
      change: "+25%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Success Rate",
      value: "33%",
      change: "+8%",
      icon: Star,
      color: "text-orange-600",
    },
  ];

  const employerCards = [
    {
      title: "Active Jobs",
      value: "12",
      change: "+3",
      icon: Briefcase,
      color: "text-blue-600",
    },
    {
      title: "Applications Received",
      value: "486",
      change: "+24%",
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Interviews Scheduled",
      value: "18",
      change: "+12%",
      icon: TrendingUp,
      color: "text-purple-600",
    },
    {
      title: "Hire Rate",
      value: "28%",
      change: "+5%",
      icon: Star,
      color: "text-orange-600",
    },
  ];

  const cards = userType === "employee" ? employeeCards : employerCards;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-green-600 mt-1">
                {card.change} from last month
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardCards;
