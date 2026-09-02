"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/lib/api/auth";
import { authKeys, todoKeys } from "@/lib/query-keys";
import { useMe } from "@/hooks/useMe";
import { Button } from "@/components/ui/button";

/**
 * Header의 children 슬롯에 주입되는 로그인 상태별 메뉴(app/layout.tsx). 공개 화면에서도
 * 마운트되어 GET /api/auth/me가 401을 받는 것이 정상 동작이다 — 인증 판정은 이 API로만 한다.
 */
export function AuthMenu() {
  const { data: user, isPending } = useMe();
  const queryClient = useQueryClient();
  const router = useRouter();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(authKeys.me, null);
      queryClient.removeQueries({ queryKey: todoKeys.all });
      router.push("/");
    },
  });

  // 첫 조회가 끝나기 전엔 아무것도 렌더링하지 않아 로그인/로그아웃 버튼이
  // 잠깐 나타났다 바뀌는 레이아웃 시프트를 막는다.
  if (isPending) return null;

  if (!user) {
    return (
      <>
        <Button asChild variant="ghost" size="sm">
          <Link href="/login">로그인</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/signup">회원가입</Link>
        </Button>
      </>
    );
  }

  return (
    <>
      <span className="hidden text-sm text-muted-foreground md:inline">{user.nickname}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
      >
        로그아웃
      </Button>
    </>
  );
}
