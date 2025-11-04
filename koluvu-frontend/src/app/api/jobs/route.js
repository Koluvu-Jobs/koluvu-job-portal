// src/app/api/jobs/route.js
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Transform frontend field names to backend field names
    const transformedBody = {
      title: body.jobTitle,
      job_type: body.jobType,
      designation: body.designation,
      department: body.department,
      industry: body.industry,
      location: body.jobLocation,
      employment_type: body.employmentType,
      experience_min: parseInt(body.experienceMin) || 0,
      experience_max: parseInt(body.experienceMax) || 0,
      education: body.education,
      gender_preference: body.gender,
      salary_min: parseFloat(body.salaryMin) || null,
      salary_max: parseFloat(body.salaryMax) || null,
      description: body.jobDescription,
      candidate_profile: body.candidateProfile,
      perks: body.perks,
      skills: body.skills,
      urgency: body.urgency?.toLowerCase() || 'normal',
      contact_email: body.contactEmail,
      interview_method: body.interviewMethod === 'Virtual Interview' ? 'virtual' : 'walkin',
      virtual_platform: body.virtualPlatform || '',
      walkin_address: body.walkinAddress || '',
      contact_preferences: body.contactPreference,
      notification_preferences: body.notificationPreference,
      application_deadline: body.deadline,
      status: 'active'
    };
    
    // Get access token from cookies (JWT-based auth)
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    console.log('Posting job to backend with JWT auth:', {
      hasToken: !!accessToken,
      bodyKeys: Object.keys(transformedBody)
    });

    // Forward request to Django backend with JWT token
    const response = await fetch(`${BACKEND_URL}/api/employer/jobs/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(transformedBody),
      credentials: 'include'
    });

    const data = await response.json();
    console.log('Backend response:', data);

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error posting job:', error);
    return NextResponse.json(
      { error: 'Failed to post job', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Check if this is a public request (for employees) or employer request
    const isPublic = searchParams.get('public') === 'true';
    
    if (isPublic) {
      // Public job listings for employees
      const queryString = searchParams.toString().replace('public=true&', '').replace('public=true', '');
      const url = `${BACKEND_URL}/api/employer/jobs/public/${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(data);
    } else {
      // Employer's own jobs - requires authentication
      const authHeader = request.headers.get('authorization');
      const tokenFromHeader = authHeader?.startsWith('Bearer ') 
        ? authHeader.substring(7) 
        : null;
      
      const tokenFromCookie = request.cookies.get('access_token')?.value;
      const accessToken = tokenFromHeader || tokenFromCookie;

      if (!accessToken) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      // Build query string
      const queryString = searchParams.toString();
      const url = `${BACKEND_URL}/api/employer/jobs/${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error.message },
      { status: 500 }
    );
  }
}
