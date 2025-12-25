//src/app/dashboard/employer/applicants/page.js

import ApplicantsClient from "./ApplicantsClient";
import { Button } from "@koluvu/components/ui/buttons/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@koluvu/components/ui/table/page";
import { Checkbox } from "@koluvu/components/ui/checkbox/page";
import { CheckCircle2 } from "lucide-react";

// Function to get status styling based on status value
function getStatusStyling(status) {
  const statusStyles = {
    "Under Review": "bg-blue-100 text-blue-800",
    Shortlisted: "bg-green-100 text-green-800",
    "Interview Scheduled": "bg-purple-100 text-purple-800",
    "In Progress": "bg-indigo-100 text-indigo-800",
    Pending: "bg-yellow-100 text-yellow-800",
    "On Hold": "bg-gray-100 text-gray-800",
    Rejected: "bg-red-100 text-red-800",
  };

  return statusStyles[status] || "bg-gray-100 text-gray-800";
}

// Get applicants based on job title with exact numbers
async function getApplicants(jobTitle, applicantsCount) {
  // Define job-specific data
  const jobData = {
    "Frontend Developer": {
      department: "Engineering",
      skills: [
        "React",
        "JavaScript",
        "HTML",
        "CSS",
        "TypeScript",
        "Vue",
        "Angular",
        "Redux",
      ],
      designations: [
        "Frontend Developer",
        "UI Developer",
        "React Developer",
        "Frontend Engineer",
      ],
    },
    "Backend Developer": {
      department: "Engineering",
      skills: [
        "Node.js",
        "Python",
        "Java",
        "SQL",
        "MongoDB",
        "API Development",
        "Spring Boot",
        "Django",
      ],
      designations: [
        "Backend Developer",
        "Node.js Developer",
        "Java Developer",
        "Backend Engineer",
      ],
    },
    "UX Designer": {
      department: "Design",
      skills: [
        "Figma",
        "UI/UX",
        "User Research",
        "Wireframing",
        "Prototyping",
        "Adobe XD",
        "Sketch",
      ],
      designations: [
        "UX Designer",
        "UI/UX Designer",
        "Product Designer",
        "UX Researcher",
      ],
    },
    "Product Manager": {
      department: "Management",
      skills: [
        "Product Strategy",
        "Agile",
        "Market Research",
        "Project Management",
        "Roadmapping",
      ],
      designations: [
        "Product Manager",
        "Product Owner",
        "Senior Product Manager",
      ],
    },
    "Data Scientist": {
      department: "Analytics",
      skills: [
        "Python",
        "Machine Learning",
        "Data Analysis",
        "SQL",
        "R",
        "TensorFlow",
        "PyTorch",
      ],
      designations: [
        "Data Scientist",
        "ML Engineer",
        "Data Analyst",
        "Senior Data Scientist",
      ],
    },
  };

  // Get the job-specific data or use defaults
  const jobInfo = jobData[jobTitle] || {
    department: "General",
    skills: ["Problem Solving", "Communication", "Teamwork"],
    designations: ["Professional", "Specialist"],
  };

  // Generate applicants based on the exact count
  const applicants = [];
  const names = [
    "Ravi Kumar",
    "Priya Sharma",
    "Amit Patel",
    "Sneha Reddy",
    "Anjali Mehta",
    "Rajesh Singh",
    "Kavita Desai",
    "Vikram Malhotra",
    "Neha Gupta",
    "Arun Kumar",
    "Sarah Williams",
    "Emma Davis",
    "Michael Johnson",
    "Chen Lee",
    "Ananya Singh",
    "Rahul Verma",
    "Divya Nair",
    "Sanjay Gupta",
    "Pooja Mehta",
    "Vishal Sharma",
    "Nisha Patel",
    "Alok Kumar",
    "Sunita Reddy",
    "Mohan Das",
    "Kiran Deshpande",
    "Suresh Menon",
    "Lakshmi Iyer",
    "Gaurav Joshi",
    "Meera Banerjee",
    "Abhishek Tiwari",
    "Deepak Sharma",
    "Shilpa Reddy",
    "Karthik Nair",
    "Swati Singh",
    "Rajiv Menon",
    "Anjali Nair",
    "Vivek Kumar",
    "Preeti Sharma",
    "Harish Patel",
    "Sanjana Reddy",
  ];

  const educations = [
    "B.Tech in Computer Science",
    "MCA",
    "M.Tech in IT",
    "B.Sc in Computer Science",
    "B.E in CSE",
    "MS in Computer Science",
    "BCA",
    "M.Sc in Computer Science",
    "B.Tech in Electronics",
    "MBA in IT",
    "B.Com",
    "M.Des in UX Design",
    "MBA in Product Management",
    "MS in Data Science",
    "B.Tech in IT",
  ];

  const locations = [
    "Hyderabad",
    "Bangalore",
    "Pune",
    "Chennai",
    "Mumbai",
    "Delhi",
    "Gurgaon",
    "Noida",
  ];

  for (let i = 1; i <= applicantsCount; i++) {
    const nameIndex = (i - 1) % names.length;
    const educationIndex = (i - 1) % educations.length;
    const designationIndex = (i - 1) % jobInfo.designations.length;
    const locationIndex = (i - 1) % locations.length;

    const experience = Math.floor(Math.random() * 10) + 1;
    const profileCompletion = Math.floor(Math.random() * 20) + 80; // 80-100%
    const atsScore = Math.floor(Math.random() * 30) + 70; // 70-100
    const isVerified = Math.random() > 0.3; // 70% verified
    const applyDate = `2025-0${Math.floor(Math.random() * 3) + 4}-${
      Math.floor(Math.random() * 28) + 1
    }`.replace(/-(\d)$/, "-0$1");

    // Select 3-5 random skills
    const shuffledSkills = [...jobInfo.skills].sort(() => 0.5 - Math.random());
    const selectedSkills = shuffledSkills.slice(
      0,
      Math.floor(Math.random() * 3) + 3
    );

    // Generate realistic status based on application timing and profile quality
    let status;
    const daysSinceApplication = Math.floor(
      (new Date() - new Date(applyDate)) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceApplication <= 2) {
      status = "Under Review";
    } else if (daysSinceApplication <= 7) {
      if (atsScore >= 85 && isVerified) {
        status = "Shortlisted";
      } else if (atsScore >= 75) {
        status = "Under Review";
      } else {
        status = "Pending";
      }
    } else if (daysSinceApplication <= 14) {
      if (atsScore >= 90 && isVerified) {
        status = "Interview Scheduled";
      } else if (atsScore >= 80 && isVerified) {
        status = "Shortlisted";
      } else if (atsScore >= 70) {
        status = "Under Review";
      } else {
        status = "Rejected";
      }
    } else {
      if (atsScore >= 85 && isVerified) {
        status = "In Progress";
      } else if (atsScore >= 75 && isVerified) {
        status = "Interview Scheduled";
      } else if (atsScore >= 65) {
        status = "On Hold";
      } else {
        status = "Rejected";
      }
    }

    applicants.push({
      id: i,
      name: names[nameIndex],
      education: educations[educationIndex],
      experience: experience.toString(),
      skills: selectedSkills.join(", "),
      gender: Math.random() > 0.5 ? "Male" : "Female",
      profileCompletion: profileCompletion,
      noticePeriod: Math.random() > 0.5 ? "30 Days" : "Immediate",
      presentCTC: `${Math.floor(Math.random() * 10) + 5} LPA`,
      expectedCTC: `${Math.floor(Math.random() * 5) + 8} LPA`,
      preferredLocation: locations[locationIndex],
      applyDate: applyDate,
      atsScore: atsScore,
      department: jobInfo.department,
      designation: jobInfo.designations[designationIndex],
      isVerified: isVerified,
      status: status,
    });
  }

  return applicants;
}

export default async function ApplicantsPage(props) {
  let jobId = "";
  let jobTitle = "";
  let applicantsCount = 0;

  let searchParams = props?.searchParams;
  if (typeof searchParams === "function") {
    searchParams = await searchParams();
  }

  // Extract parameters from URL
  if (searchParams && typeof searchParams === "object") {
    jobId = searchParams.jobId || "";
    jobTitle = searchParams.title || "";
    applicantsCount = parseInt(searchParams.applicants || "0");
  }

  // Set default values based on job title if count is not provided
  if (!applicantsCount) {
    const defaultCounts = {
      "Frontend Developer": 24,
      "Backend Developer": 32,
      "UX Designer": 18,
      "Product Manager": 8,
      "Data Scientist": 15,
    };
    applicantsCount = defaultCounts[jobTitle] || 10;
  }

  // If no title provided, use default
  if (!jobTitle) {
    jobTitle = "Frontend Developer";
  }

  const candidates = await getApplicants(jobTitle, applicantsCount);
  const verified = candidates.filter((c) => c.isVerified);
  const unverified = candidates.filter((c) => !c.isVerified);

  return (
    <ApplicantsClient
      verified={verified}
      unverified={unverified}
      jobTitle={jobTitle}
      jobId={jobId}
    />
  );
}
