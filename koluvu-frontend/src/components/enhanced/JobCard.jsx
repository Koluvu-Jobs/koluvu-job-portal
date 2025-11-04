// src/components/enhanced/JobCard.jsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, DollarSign, Building } from "lucide-react";

const JobCard = ({ job }) => {
  const {
    title = "Software Developer",
    company = "Tech Company",
    location = "Remote",
    salary = "$60,000 - $80,000",
    type = "Full-time",
    postedAt = "2 days ago",
    description = "We are looking for a talented developer...",
  } = job || {};

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Building className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{company}</span>
            </div>
          </div>
          <span className="text-xs text-gray-500">{postedAt}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{type}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">{salary}</span>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>

          <div className="flex gap-2 pt-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors">
              Apply Now
            </button>
            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-50 transition-colors">
              Save Job
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
