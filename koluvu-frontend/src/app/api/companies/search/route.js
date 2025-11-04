// src/app/api/companies/search/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    // Mock company data with logos for search suggestions
    // In real implementation, this would query the backend database
    const mockCompanies = [
      {
        id: 1,
        name: "TechCorp Solutions",
        logo: "/images/company-logos/techcorp.jpg",
        industry: "Software Development",
        location: "San Francisco, CA",
        jobCount: 25,
      },
      {
        id: 2,
        name: "DataFlow Analytics",
        logo: "/images/company-logos/dataflow.jpg",
        industry: "Data Science",
        location: "New York, NY",
        jobCount: 18,
      },
      {
        id: 3,
        name: "CloudWave Technologies",
        logo: "/images/company-logos/cloudwave.jpg",
        industry: "Cloud Computing",
        location: "Seattle, WA",
        jobCount: 42,
      },
      {
        id: 4,
        name: "AI Innovations Inc",
        logo: "/images/company-logos/ai-innovations.jpg",
        industry: "Artificial Intelligence",
        location: "Austin, TX",
        jobCount: 33,
      },
      {
        id: 5,
        name: "SecureNet Systems",
        logo: "/images/company-logos/securenet.jpg",
        industry: "Cybersecurity",
        location: "Boston, MA",
        jobCount: 21,
      },
      {
        id: 6,
        name: "Green Energy Solutions",
        logo: "/images/company-logos/green-energy.jpg",
        industry: "Renewable Energy",
        location: "Denver, CO",
        jobCount: 15,
      },
      {
        id: 7,
        name: "FinTech Global",
        logo: "/images/company-logos/fintech-global.jpg",
        industry: "Financial Technology",
        location: "Chicago, IL",
        jobCount: 29,
      },
      {
        id: 8,
        name: "HealthTech Innovations",
        logo: "/images/company-logos/healthtech.jpg",
        industry: "Healthcare Technology",
        location: "San Diego, CA",
        jobCount: 19,
      },
      {
        id: 9,
        name: "EduTech Systems",
        logo: "/images/company-logos/edutech.jpg",
        industry: "Education Technology",
        location: "Philadelphia, PA",
        jobCount: 12,
      },
      {
        id: 10,
        name: "Quantum Computing Corp",
        logo: "/images/company-logos/quantum.jpg",
        industry: "Quantum Computing",
        location: "Mountain View, CA",
        jobCount: 8,
      },
    ];

    // Filter companies based on search query
    const filteredCompanies = mockCompanies.filter(
      (company) =>
        company.name.toLowerCase().includes(query.toLowerCase()) ||
        company.industry.toLowerCase().includes(query.toLowerCase()) ||
        company.location.toLowerCase().includes(query.toLowerCase())
    );

    // Limit results to 8 for performance
    const limitedResults = filteredCompanies.slice(0, 8);

    return NextResponse.json({
      companies: limitedResults,
      total: filteredCompanies.length,
    });
  } catch (error) {
    console.error("Company search error:", error);
    return NextResponse.json(
      { error: "Failed to search companies" },
      { status: 500 }
    );
  }
}
