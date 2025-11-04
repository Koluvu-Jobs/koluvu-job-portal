// src/app/api/employer/proxy-scans/route.js

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

export async function GET(request) {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/api/employer/proxy-scans/${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Backend error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch proxy scans' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy scans API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('🔍 POST /api/employer/proxy-scans - Starting request');
    
    const cookieStore = cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    
    console.log('🔑 Access token found:', !!accessToken);
    
    if (!accessToken) {
      console.log('❌ No access token found');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📝 Request body:', body);
    
    const backendUrl = `${BACKEND_URL}/api/employer/proxy-scans/`;
    console.log('🌐 Backend URL:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('📡 Backend response status:', response.status);
    console.log('📡 Backend response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Backend error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to create proxy scan', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Backend response data:', data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('🚨 Proxy scan creation error:', error);
    console.error('🚨 Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}