// Authentication guard middleware for login/register pages
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

/**
 * Authentication Guard Middleware
 * Prevents authenticated users from accessing login/register pages
 * and implements role-based cross-access prevention
 */

const LOGIN_ROUTES = [
  '/auth/login/employee',
  '/auth/login/employer', 
  '/auth/login/partner',
  '/auth/login/admin'
];

const REGISTER_ROUTES = [
  '/auth/register/employee',
  '/auth/register/employer',
  '/auth/register/partner'
];

const DASHBOARD_ROUTES = {
  employee: '/dashboard/employee',
  employer: '/dashboard/employer', 
  partner: '/dashboard/partner',
  admin: '/dashboard/admin'
};

export async function authGuardMiddleware(request) {
  const { pathname } = request.nextUrl;
  
  // Only apply to login/register routes
  if (!LOGIN_ROUTES.includes(pathname) && !REGISTER_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  try {
    // Check for authentication token
    const token = request.cookies.get('access_token')?.value ||
                  request.cookies.get('token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // Not authenticated - allow access to login/register pages
      return NextResponse.next();
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const verifyResult = await jwtVerify(token, secret);
    
    // Check if verification result is valid
    if (!verifyResult || !verifyResult.payload) {
      console.warn('Auth Guard: Invalid JWT verification result');
      return NextResponse.next();
    }
    
    const { payload } = verifyResult;
    
    // Check token expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      // Token expired - allow access to login/register pages
      return NextResponse.next();
    }

    const userType = payload.user_type || payload.role;
    const userEmail = payload.email;
    
    console.log(`🔒 Auth Guard: Authenticated ${userType} (${userEmail}) trying to access ${pathname}`);

    // User is authenticated - determine where to redirect them
    const redirectUrl = determineRedirectUrl(pathname, userType, request);
    
    if (redirectUrl) {
      console.log(`🔄 Auth Guard: Redirecting to ${redirectUrl}`);
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Allow access (shouldn't reach here in normal flow)
    return NextResponse.next();

  } catch (error) {
    console.error('Auth Guard JWT verification error:', error);
    // On token verification error, allow access to login/register
    return NextResponse.next();
  }
}

/**
 * Determine appropriate redirect URL for authenticated users
 * @param {string} pathname - Current path user is trying to access
 * @param {string} userType - Type of authenticated user (employee, employer, etc.)
 * @param {Request} request - Next.js request object
 * @returns {string|null} - Redirect URL or null if no redirect needed
 */
function determineRedirectUrl(pathname, userType, request) {
  // Extract user type from the route they're trying to access
  const routeUserType = extractUserTypeFromRoute(pathname);
  
  // If user is trying to access their own role's login/register page
  if (routeUserType === userType) {
    // Redirect to their dashboard
    return DASHBOARD_ROUTES[userType] || '/dashboard';
  }
  
  // If user is trying to access a different role's login/register page
  if (routeUserType && routeUserType !== userType) {
    // Prevent cross-role access - redirect to their own dashboard with error message
    const redirectUrl = new URL(DASHBOARD_ROUTES[userType] || '/dashboard', request.url);
    redirectUrl.searchParams.set('error', 'unauthorized_role_access');
    redirectUrl.searchParams.set('attempted_role', routeUserType);
    return redirectUrl.toString();
  }
  
  // Default: redirect to user's dashboard
  return DASHBOARD_ROUTES[userType] || '/dashboard';
}

/**
 * Extract user type from route path
 * @param {string} pathname - Route path
 * @returns {string|null} - User type or null if not determinable
 */
function extractUserTypeFromRoute(pathname) {
  if (pathname.includes('/employee')) return 'employee';
  if (pathname.includes('/employer')) return 'employer';
  if (pathname.includes('/partner')) return 'partner';
  if (pathname.includes('/admin')) return 'admin';
  return null;
}

/**
 * Check authentication status from multiple sources
 * @param {Request} request - Next.js request object
 * @returns {Object} - Authentication status and user info
 */
export async function checkAuthStatus(request) {
  try {
    // Check cookies
    const cookieToken = request.cookies.get('access_token')?.value ||
                       request.cookies.get('token')?.value;
    
    // Check localStorage (client-side only)
    // Note: This requires client-side implementation
    
    // Check session storage (client-side only)
    // Note: This requires client-side implementation
    
    // Check authorization header
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    
    const token = cookieToken || headerToken;
    
    if (!token) {
      return { isAuthenticated: false, user: null, source: null };
    }

    // Verify JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const verifyResult = await jwtVerify(token, secret);
    
    // Check if verification result is valid
    if (!verifyResult || !verifyResult.payload) {
      console.warn('Auth status check: Invalid JWT verification result');
      return { isAuthenticated: false, user: null, source: 'invalid_token' };
    }
    
    const { payload } = verifyResult;
    
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return { isAuthenticated: false, user: null, source: 'expired' };
    }

    return {
      isAuthenticated: true,
      user: {
        id: payload.user_id,
        email: payload.email,
        userType: payload.user_type || payload.role,
        username: payload.username
      },
      source: cookieToken ? 'cookie' : 'header'
    };

  } catch (error) {
    console.error('Auth status check error:', error);
    return { isAuthenticated: false, user: null, source: 'error' };
  }
}

export default authGuardMiddleware;