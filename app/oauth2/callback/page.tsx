"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/lib/api/auth";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

/**
 * 백엔드 OAuth2SuccessHandler가 쿠키를 이미 심은 뒤 쿼리 없이 이 경로로 리다이렉트한다
 * (application.properties: app.oauth2.success-redirect-uri). 실패는 이 화면을 거치지 않고
 * 바로 /login?error=oauth로 간다 — 그래서 이 화면은 쿼리 파라미터를 읽지 않는다.
 * 도달 자체가 백엔드 기준 성공이지만, GET /api/auth/me로 최종 확인해 인증 판정 원칙(FR-A11)을
 * 지킨다 — 방어적으로 쿠키가 실제로 안 심긴 경우에만 /login?error=oauth로 되돌아간다.
 */
export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    getMe()
      .then(() => router.replace("/todos"))
      .catch(() => router.replace("/login?error=oauth"));
  }, [router]);

  return (
    <div className="flex flex-1 items-center justify-center">
      <LoadingSpinner label="로그인 처리 중" />
    </div>
  );
}
