// src/app/api/employer/boolean-search/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(request) {
  try {
    // Get token from authorization header like other working APIs
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      );
    }

    const searchData = await request.json();
    console.log('Boolean Search Request:', {
      url: `${BACKEND_URL}/api/employer/candidates/boolean-search/`,
      searchData,
      hasAuth: !!authHeader
    });

    const response = await fetch(`${BACKEND_URL}/api/employer/candidates/boolean-search/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(searchData),
    });

    const responseText = await response.text();
    console.log('Backend Response Status:', response.status);
    console.log('Backend Response Text:', responseText.substring(0, 500));

    if (!response.ok) {
      let errorMessage = 'Failed to search candidates';
      let errorDetails = {};

      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorMessage;
        errorDetails = errorData.details || {};
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
        errorDetails = { raw_response: responseText };
      }

      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    console.log('Successfully fetched candidates:', {
      count: data.candidates?.length || 0,
      totalCount: data.total_count
    });

    return NextResponse.json({
      success: true,
      candidates: data.candidates || [],
      total_count: data.total_count || 0,
      search_criteria: data.search_criteria || {}
    });

  } catch (error) {
    console.error('Boolean search API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}