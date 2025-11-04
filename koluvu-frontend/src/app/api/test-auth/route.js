// src/app/api/test-auth/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionid = cookieStore.get('sessionid')?.value;
    const csrfToken = cookieStore.get('csrftoken')?.value;

    console.log('Auth Test:', {
      sessionid: sessionid ? 'present' : 'missing',
      csrfToken: csrfToken ? 'present' : 'missing'
    });

    if (!sessionid) {
      return NextResponse.json({
        authenticated: false,
        message: 'No session ID found',
        cookies: {
          sessionid: false,
          csrftoken: !!csrfToken
        }
      });
    }

    // Test authentication with a simple endpoint
    const headers = {
      'Content-Type': 'application/json',
    };

    if (sessionid) {
      headers['Cookie'] = `sessionid=${sessionid}${csrfToken ? `; csrftoken=${csrfToken}` : ''}`;
    }
    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken;
    }

    const response = await fetch(`${BACKEND_URL}/api/employer/jobs/`, {
      method: 'GET',
      headers,
      credentials: 'include',
    });

    const responseText = await response.text();
    
    return NextResponse.json({
      authenticated: response.ok,
      status: response.status,
      message: response.ok ? 'Authentication successful' : 'Authentication failed',
      cookies: {
        sessionid: !!sessionid,
        csrftoken: !!csrfToken
      },
      response: response.ok ? 'Jobs endpoint accessible' : responseText.substring(0, 200)
    });

  } catch (error) {
    console.error('Auth test error:', error);
    return NextResponse.json({
      authenticated: false,
      message: 'Auth test failed',
      error: error.message
    });
  }
}