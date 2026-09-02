"use client";

import { Button } from "@/components/ui/button";
import { BASE_URL } from "@/lib/api/client";

/**
 * API_SPEC.md 2.5: GET /oauth2/authorization/google는 JSON API가 아니라 브라우저를
 * 이동시키는 리다이렉트 시작점이다. fetch로 호출하지 않고 window.location.href로
 * 직접 이동한다 — apiFetch를 거치는 순간 이 흐름이 깨진다.
 */
export function GoogleLoginButton() {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        // 이 경로는 Next.js 라우트가 아니라 백엔드(다른 오리진)의 OAuth2 시작점이다. router.push는
        // 클라이언트 라우팅만 처리하므로 여기서는 전체 페이지 이동(window.location)이 맞다(API_SPEC.md 2.5).
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = `${BASE_URL}/oauth2/authorization/google`;
      }}
    >
      구글로 계속하기
    </Button>
  );
}
