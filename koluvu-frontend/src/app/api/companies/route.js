// src/app/api/companies/route.js

import { staticCompanies } from "@koluvu/data/staticJobs";

// Initialize with sample companies data
let companies = [...staticCompanies];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const industry = searchParams.get("industry");
    const location = searchParams.get("location");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page")) || 1;
    const pageSize = parseInt(searchParams.get("page_size")) || 10;

    let filteredCompanies = [...companies];

    // Apply filters
    if (search) {
      filteredCompanies = filteredCompanies.filter(
        (company) =>
          company.name.toLowerCase().includes(search.toLowerCase()) ||
          company.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (industry) {
      filteredCompanies = filteredCompanies.filter((company) =>
        company.industry.toLowerCase().includes(industry.toLowerCase())
      );
    }

    if (location) {
      filteredCompanies = filteredCompanies.filter((company) =>
        company.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (type) {
      filteredCompanies = filteredCompanies.filter(
        (company) => company.size === type
      );
    }

    // Pagination
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredCompanies.length / pageSize);

    return new Response(
      JSON.stringify({
        status: "success",
        data: paginatedCompanies,
        pagination: {
          current_page: page,
          total_pages: totalPages,
          total_items: filteredCompanies.length,
          page_size: pageSize,
          has_next: page < totalPages,
          has_previous: page > 1,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Failed to fetch companies",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request) {
  try {
    const company = await request.json();

    // Validate required fields
    if (!company.name || !company.industry || !company.location) {
      return new Response(
        JSON.stringify({
          status: "error",
          message: "Missing required fields: name, industry, location",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newCompany = {
      id: Date.now(),
      ...company,
      founded: company.founded || new Date().getFullYear().toString(),
    };

    companies.push(newCompany);

    return new Response(
      JSON.stringify({
        status: "success",
        data: newCompany,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Invalid company data",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
