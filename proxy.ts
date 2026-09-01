// Next.js 16의 middleware.ts 개명판(함수명도 proxy). app/ 밖 프로젝트 루트에 위치.
import { NextResponse, type NextRequest } from "next/server";

// API_SPEC.md 1.2 — Set-Cookie: access_token=...; HttpOnly
const AUTH_COOKIE_NAME = "access_token";

export const config = {
  matcher: ["/todos/:path*"],
};

/**
 * /todos 하위 경로의 1차 방어선. 쿠키 "존재 여부"만 확인하고 값은 파싱·검증하지
 * 않는다 — 만료·위조 등 실제 유효성 검증은 백엔드가 401로 응답할 때 이뤄지며,
 * 최종 인증 상태 판정은 항상 GET /api/auth/me로 한다(FR-A11).
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(AUTH_COOKIE_NAME);

  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
