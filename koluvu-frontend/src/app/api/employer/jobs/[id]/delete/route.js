import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export async function POST(request, { params }) {
  try {
    console.log('Delete API route called with params:', params);
    
    const { id } = params;
    
    // Get access token from cookies
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Call Django backend to delete the job
    const deleteUrl = `${BACKEND_URL}/api/employer/jobs/${id}/`;
    console.log('BACKEND_URL:', BACKEND_URL);
    console.log('Calling Django:', deleteUrl);
    
    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('Django response status:', response.status);

    if (!response.ok) {
      // Try to get JSON error message, fallback to text
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const errorText = await response.text();
        errorData = { error: errorText || 'Failed to delete job' };
      }
      return NextResponse.json(errorData, { status: response.status });
    }

    // Handle both JSON response and 204 No Content
    let responseData = { message: 'Job deleted successfully' };
    if (response.status !== 204) {
      try {
        responseData = await response.json();
      } catch {
        // If no JSON, use default message
      }
    }

    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Error in delete API route:', error);
    return NextResponse.json(
      { error: 'API route error', details: error.message },
      { status: 500 }
    );
  }
}