"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/api/auth";
import { authKeys } from "@/lib/query-keys";

/**
 * 인증 상태 판정은 오직 이 훅(GET /api/auth/me)으로만 한다(FR-A11). 비로그인 방문자도
 * 마주치는 공개 화면(랜딩·로그인 등)에서도 이 훅이 401을 받는 것은 정상 동작이므로
 * retry:false로 불필요한 재시도를 막는다.
 */
export function useMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
    retry: false,
  });
}
