// src/app/api/employer/jobs/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DJANGO_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Forward query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${DJANGO_BASE_URL}/api/employer/jobs/${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || "Failed to fetch jobs" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Jobs API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    console.log("=== ROUTE.JS DEBUG - RECEIVED FROM FRONTEND ===");
    console.log("Body keys:", Object.keys(body));
    console.log("Full body:", JSON.stringify(body, null, 2));

    // Transform frontend field names to backend field names
    const transformedBody = {
      // Basic job information
      title: body.title || body.jobTitle,
      // Map employment_type and jobType to job_type (the actual Django field)
      job_type: body.job_type || body.jobType || body.employment_type,
      designation: body.designation,
      department: body.department,
      industry: body.industry || body.companyIndustry,
      location: body.location || body.jobLocation,
      employment_type: body.employment_type || body.employmentType,
      experience_min: parseInt(body.experience_min || body.experienceMin) || 0,
      experience_max: parseInt(body.experience_max || body.experienceMax) || 0,
      education: body.education,
      education_level: body.education_level || body.educationLevel,
      gender_preference: body.gender_preference || body.gender,

      // Salary information
      salary_min: parseFloat(body.salary_min || body.salaryMin) || null,
      salary_max: parseFloat(body.salary_max || body.salaryMax) || null,
      salary_currency: body.salary_currency || body.salaryCurrency || "INR",

      // Job description fields
      description:
        body.description || body.jobDescription || body.jobBrief || "",
      job_brief: body.job_brief || body.jobBrief || "",

      // Handle responsibilities - convert text to array or keep existing array
      responsibilities: (() => {
        if (Array.isArray(body.responsibilities)) {
          return body.responsibilities;
        } else if (
          typeof body.responsibilities === "string" &&
          body.responsibilities.trim()
        ) {
          // Convert text to array by splitting on newlines, semicolons, or bullets
          return body.responsibilities
            .trim()
            .split(/\n|;|\*|\u2022|\u2023/)
            .map((item) => item.trim().replace(/^[-•*]\s*/, ""))
            .filter((item) => item.length > 0);
        }
        return [];
      })(),

      // Handle requirements - convert text to array or keep existing array
      requirements: (() => {
        if (Array.isArray(body.requirements)) {
          return body.requirements;
        } else if (
          typeof body.requirements === "string" &&
          body.requirements.trim()
        ) {
          // Convert text to array by splitting on newlines, semicolons, or bullets
          return body.requirements
            .trim()
            .split(/\n|;|\*|\u2022|\u2023/)
            .map((item) => item.trim().replace(/^[-•*]\s*/, ""))
            .filter((item) => item.length > 0);
        }
        return [];
      })(),

      // Handle skills - convert text to array or keep existing array
      skills: (() => {
        if (Array.isArray(body.skills)) {
          return body.skills;
        } else if (typeof body.skills === "string" && body.skills.trim()) {
          // Convert text to array by splitting on commas, newlines, semicolons, or bullets
          return body.skills
            .trim()
            .split(/,|\n|;|\*|\u2022|\u2023/)
            .map((item) => item.trim().replace(/^[-•*]\s*/, ""))
            .filter((item) => item.length > 0);
        }
        return [];
      })(),

      // Handle benefits - convert text to array or keep existing array
      benefits: (() => {
        if (Array.isArray(body.benefits)) {
          return body.benefits;
        } else if (typeof body.benefits === "string" && body.benefits.trim()) {
          // Convert text to array by splitting on newlines, semicolons, or bullets
          return body.benefits
            .trim()
            .split(/\n|;|\*|\u2022|\u2023/)
            .map((item) => item.trim().replace(/^[-•*]\s*/, ""))
            .filter((item) => item.length > 0);
        }
        return [];
      })(),
      company_benefits: body.company_benefits || body.companyBenefits || "",

      // Convert perks array to JSON string if needed
      perks: Array.isArray(body.perks)
        ? body.perks.join("\n")
        : body.perks || "",

      // Advanced fields
      faqs: body.faqs || [],
      screening_questions:
        body.screening_questions || body.screeningQuestions || [],
      hiring_process_stages:
        body.hiring_process_stages || body.hiringProcessStages || [],
      language_proficiency:
        body.language_proficiency || body.languageProficiency || [],

      // Contact and preferences
      candidate_profile: body.candidate_profile || body.candidateProfile || "",
      contact_email: body.contact_email || body.contactEmail,
      urgency: (body.urgency || "normal").toLowerCase(),

      // Interview details
      interview_method:
        body.interview_method ||
        (body.interviewMethod === "Virtual Interview"
          ? "virtual"
          : body.interviewMethod === "virtual"
          ? "virtual"
          : "walkin"),
      virtual_platform: body.virtual_platform || body.virtualPlatform || "",
      walkin_address: body.walkin_address || body.walkinAddress || "",

      // Preferences (ensure they're arrays)
      contact_preferences: (() => {
        const prefs = body.contact_preferences || body.contactPreference || [];
        return Array.isArray(prefs) ? prefs : [];
      })(),
      notification_preferences: (() => {
        const prefs =
          body.notification_preferences || body.notificationPreference || [];
        return Array.isArray(prefs) ? prefs : [];
      })(),

      // Company information
      employer_bio: body.employer_bio || body.companyDescription || "",
      employer_website_url: (() => {
        const url = body.employer_website_url || body.companyWebsite || "";
        // Don't send localhost URLs or invalid URLs
        if (!url || url.includes("localhost") || url.includes("127.0.0.1")) {
          return "";
        }
        // Ensure URL has proper protocol
        if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
          return `https://${url}`;
        }
        return url;
      })(),
      company_size: body.company_size || body.companySize || "",

      // Additional fields
      additional_notes: body.additional_notes || body.additionalNotes || "",
      ats_keywords: body.ats_keywords || body.atsKeywords || "",

      // Deadline and status
      application_deadline:
        body.application_deadline || body.applicationDeadline || body.deadline,
      status: body.status || "active",
    };

    console.log("=== ROUTE.JS DEBUG - TRANSFORMED FOR DJANGO ===");
    console.log("Transformed body keys:", Object.keys(transformedBody));
    console.log("Field mapping examples:");
    console.log(
      "  - job_type:",
      transformedBody.job_type,
      "(from",
      body.job_type,
      body.jobType,
      body.employment_type,
      ")"
    );
    console.log("  - responsibilities:", transformedBody.responsibilities);
    console.log("  - requirements:", transformedBody.requirements);
    console.log("  - skills:", transformedBody.skills);
    console.log("  - benefits:", transformedBody.benefits);
    console.log("  - company_benefits:", transformedBody.company_benefits);
    console.log(
      "Full transformed body:",
      JSON.stringify(transformedBody, null, 2)
    );

    const response = await fetch(`${DJANGO_BASE_URL}/api/employer/jobs/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transformedBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("=== DJANGO BACKEND ERROR ===");
      console.error("Status:", response.status);
      console.error("Error data:", errorData);
      return NextResponse.json(
        {
          error: errorData.error || errorData.detail || "Failed to create job",
          details: errorData.details || errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("=== JOB CREATED SUCCESSFULLY ===");
    console.log("Created job data:", data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Job creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
