// dashboard/employer/applicants/page.js

import Header from "@koluvu/components/Header/Header";
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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">
          Applicants for {jobTitle} Position
          {jobId && (
            <span className="text-blue-600 ml-2">(Job ID: {jobId})</span>
          )}
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            Total Applicants: {candidates.length}
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Verified: {verified.length}
          </span>
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
            Unverified: {unverified.length}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow text-sm transition-all">
            Bulk Download
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow text-sm transition-all">
            Bulk Walk-in
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow text-sm transition-all">
            Interview Schedule
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow text-sm transition-all">
            Bulk Email
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow text-sm transition-all">
            Bulk SMS Message
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow text-sm transition-all">
            WhatsApp Alert
          </button>
        </div>

        {/* Verified Profile Section */}
        <div className="mb-6 bg-white rounded-lg shadow border border-blue-200 relative group transition-all duration-300">
          <div className="flex justify-between items-center px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-blue-600" size={24} />
              <h2 className="text-lg font-bold text-blue-900 tracking-wide">
                Verified Profile
              </h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-semibold">
                {verified.length} applicants
              </span>
            </div>
            <button className="text-white bg-blue-600 px-4 py-1.5 rounded font-semibold text-sm shadow hover:bg-blue-700 transition-all">
              View All
            </button>
          </div>
          <div className="overflow-x-auto rounded-b-lg border-t border-blue-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50 border-b-2 border-blue-500">
                  <TableHead className="font-bold text-blue-800">
                    S No
                  </TableHead>
                  <TableHead className="font-bold text-blue-800">
                    Candidate Name
                  </TableHead>
                  <TableHead>Highest Qualification</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>ATS Score</TableHead>
                  <TableHead>Years of Experience</TableHead>
                  <TableHead>Key Skills</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Profile Completion (%)</TableHead>
                  <TableHead>Notice Period</TableHead>
                  <TableHead>Present CTC</TableHead>
                  <TableHead>Expected CTC</TableHead>
                  <TableHead>Preferred Location</TableHead>
                  <TableHead>Apply Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Selection</TableHead>
                  <TableHead>Employee View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {verified.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={18}
                      className="text-center text-gray-400 py-8 text-base"
                    >
                      No verified applicants
                    </TableCell>
                  </TableRow>
                ) : (
                  verified.map((candidate, index) => (
                    <TableRow
                      key={candidate.id}
                      className="hover:bg-blue-50 transition-colors group"
                    >
                      <TableCell className="font-bold text-blue-700">
                        {index + 1}
                      </TableCell>
                      <TableCell className="flex items-center gap-2 font-semibold text-blue-900">
                        {candidate.name}
                        <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold">
                          Verified
                        </span>
                      </TableCell>
                      <TableCell>{candidate.education}</TableCell>
                      <TableCell>{candidate.department}</TableCell>
                      <TableCell>{candidate.designation}</TableCell>
                      <TableCell>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold shadow">
                          {candidate.atsScore}
                        </span>
                      </TableCell>
                      <TableCell>{candidate.experience}</TableCell>
                      <TableCell>{candidate.skills}</TableCell>
                      <TableCell>{candidate.gender}</TableCell>
                      <TableCell>
                        <span className="font-bold text-blue-700">
                          {candidate.profileCompletion}%
                        </span>
                      </TableCell>
                      <TableCell>{candidate.noticePeriod}</TableCell>
                      <TableCell>{candidate.presentCTC}</TableCell>
                      <TableCell>{candidate.expectedCTC}</TableCell>
                      <TableCell>{candidate.preferredLocation}</TableCell>
                      <TableCell>{candidate.applyDate}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyling(
                            candidate.status
                          )}`}
                        >
                          {candidate.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Select
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="h-1 bg-blue-500 rounded-b-lg w-full"></div>
        </div>

        {/* Unverified Profile Section */}
        <div className="mb-6 bg-white rounded-lg shadow border border-blue-200 relative group transition-all duration-300">
          <div className="flex justify-between items-center px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                  />
                </svg>
              </span>
              <h2 className="text-lg font-bold text-blue-900 tracking-wide">
                Unverified Profile
              </h2>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-semibold">
                {unverified.length} applicants
              </span>
            </div>
            <button className="text-white bg-blue-600 px-4 py-1.5 rounded font-semibold text-sm shadow hover:bg-blue-700 transition-all">
              View All
            </button>
          </div>
          <div className="overflow-x-auto rounded-b-lg border-t border-blue-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50 border-b-2 border-blue-500">
                  <TableHead className="font-bold text-blue-800">
                    S No
                  </TableHead>
                  <TableHead className="font-bold text-blue-800">
                    Candidate Name
                  </TableHead>
                  <TableHead>Highest Qualification</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>ATS Score</TableHead>
                  <TableHead>Years of Experience</TableHead>
                  <TableHead>Key Skills</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Profile Completion (%)</TableHead>
                  <TableHead>Notice Period</TableHead>
                  <TableHead>Present CTC</TableHead>
                  <TableHead>Expected CTC</TableHead>
                  <TableHead>Preferred Location</TableHead>
                  <TableHead>Apply Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Selection</TableHead>
                  <TableHead>Employee View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unverified.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={18}
                      className="text-center text-gray-400 py-8 text-base"
                    >
                      No unverified applicants
                    </TableCell>
                  </TableRow>
                ) : (
                  unverified.map((candidate, index) => (
                    <TableRow
                      key={candidate.id}
                      className="hover:bg-blue-50 transition-colors group"
                    >
                      <TableCell className="font-bold text-blue-700">
                        {index + 1}
                      </TableCell>
                      <TableCell className="font-semibold text-blue-900">
                        {candidate.name}
                        <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-bold">
                          Unverified
                        </span>
                      </TableCell>
                      <TableCell>{candidate.education}</TableCell>
                      <TableCell>{candidate.department}</TableCell>
                      <TableCell>{candidate.designation}</TableCell>
                      <TableCell>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold shadow">
                          {candidate.atsScore}
                        </span>
                      </TableCell>
                      <TableCell>{candidate.experience}</TableCell>
                      <TableCell>{candidate.skills}</TableCell>
                      <TableCell>{candidate.gender}</TableCell>
                      <TableCell>
                        <span className="font-bold text-blue-700">
                          {candidate.profileCompletion}%
                        </span>
                      </TableCell>
                      <TableCell>{candidate.noticePeriod}</TableCell>
                      <TableCell>{candidate.presentCTC}</TableCell>
                      <TableCell>{candidate.expectedCTC}</TableCell>
                      <TableCell>{candidate.preferredLocation}</TableCell>
                      <TableCell>{candidate.applyDate}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusStyling(
                            candidate.status
                          )}`}
                        >
                          {candidate.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Select
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-600 text-blue-600 hover:bg-blue-50"
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="h-1 bg-blue-500 rounded-b-lg w-full"></div>
        </div>
      </main>
    </div>
  );
}
