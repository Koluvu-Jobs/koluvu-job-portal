// src/app/api/employer/jobs/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const DJANGO_BASE_URL = process.env.DJANGO_BASE_URL || "http://localhost:8000";

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

    // Transform frontend field names to backend field names
    const transformedBody = {
      // Basic job information
      title: body.title || body.jobTitle,
      job_type: body.job_type || body.jobType,
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
      responsibilities: body.responsibilities || [],
      requirements: body.requirements || [],
      benefits: body.benefits || [],
      perks: Array.isArray(body.perks) ? body.perks.join('\n') : (body.perks || ''),
      skills: body.skills || [],

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
        const prefs = body.notification_preferences || body.notificationPreference || [];
        return Array.isArray(prefs) ? prefs : [];
      })(),

      // Company information
      employer_bio: body.employer_bio || body.companyDescription || "",
      employer_website_url: (() => {
        const url = body.employer_website_url || body.companyWebsite || "";
        // Don't send localhost URLs or invalid URLs
        if (!url || url.includes('localhost') || url.includes('127.0.0.1')) {
          return "";
        }
        // Ensure URL has proper protocol
        if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
          return `https://${url}`;
        }
        return url;
      })(),
      company_size: body.company_size || body.companySize || "",
      company_benefits: body.company_benefits || body.companyBenefits || "",

      // Additional fields
      additional_notes: body.additional_notes || body.additionalNotes || "",
      ats_keywords: body.ats_keywords || body.atsKeywords || "",

      // Deadline and status
      application_deadline:
        body.application_deadline || body.applicationDeadline || body.deadline,
      status: body.status || "active",
    };

    console.log("Job POST - Original body keys:", Object.keys(body));
    console.log(
      "Job POST - Transformed body keys:",
      Object.keys(transformedBody)
    );
    console.log("Job POST - Sample fields:", {
      job_brief: transformedBody.job_brief,
      responsibilities: transformedBody.responsibilities,
      requirements: transformedBody.requirements,
      faqs: transformedBody.faqs,
    });

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
      console.error("Django backend error:", errorData);
      return NextResponse.json(
        { 
          error: errorData.error || errorData.detail || "Failed to create job",
          details: errorData.details || errorData
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Job creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
