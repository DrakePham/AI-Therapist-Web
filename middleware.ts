import { NextResponse, NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';
import { fetchQuery } from 'convex/nextjs';
import { api } from './convex/_generated/api';

const isProtectedRoute = (req: NextRequest) => {
  return req.nextUrl.pathname.startsWith('/dashboard');
};

export async function middleware(req: NextRequest) {
  try {
    // Tạo một NextResponse để sử dụng trong getSession
    const res = NextResponse.next();

    // Kiểm tra các biến môi trường cần thiết
    const baseURL = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
    const clientID = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;
    const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL;
    const auth0Secret = process.env.AUTH0_SECRET;

    if (!clientID || !clientSecret || !issuerBaseURL || !auth0Secret) {
      throw new Error('Missing required Auth0 environment variables: AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_ISSUER_BASE_URL, or AUTH0_SECRET');
    }

    // Lấy thông tin đăng nhập từ Auth0 (chỉ truyền req và res)
    const session = await getSession(req, res);
    const token = session?.accessToken;

    // Chuyển hướng nếu chưa đăng nhập
    if (!session && isProtectedRoute(req)) {
      const loginUrl = new URL('/api/auth/login', baseURL);
      loginUrl.searchParams.set('returnTo', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Kiểm tra gói đăng ký qua Convex
    let hasActiveSubscription = false;
    if (token) {
      const subscriptionResult = await fetchQuery(
        api.subscriptions.getUserSubscriptionStatus,
        {},
        { token }
      );
      hasActiveSubscription = subscriptionResult?.hasActiveSubscription ?? false;
    }

    // Chuyển hướng đến /pricing nếu không có gói đăng ký
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');
    if (isDashboard && !hasActiveSubscription) {
      const pricingUrl = new URL('/pricing', baseURL);
      return NextResponse.redirect(pricingUrl);
    }

    // Cho phép tiếp tục yêu cầu
    return NextResponse.next();
  } catch (error) {
    console.error('Lỗi middleware:', error);
    const baseURL = process.env.AUTH0_BASE_URL || 'http://localhost:3000';
    return NextResponse.redirect(new URL('/error', baseURL));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"], // Thu hẹp phạm vi để giảm lỗi lặp lại
};