"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // 모듈 최상단에 new QueryClient()를 두면 서버 프로세스가 인스턴스를 공유해
  // 여러 요청·여러 사용자의 캐시가 섞인다. useState의 지연 초기화로
  // 컴포넌트 인스턴스(요청/탭)마다 새 QueryClient를 만드는
  // TanStack Query 공식 App Router 패턴을 따른다.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분 — 본인 데이터만 다루므로 짧은 staleTime으로 충분
            retry: 1, // 기본 3회는 401/404 같은 확정적 실패에도 낭비 재시도를 유발
            refetchOnWindowFocus: false, // MVP 범위 밖 — 필요해지면 M5에서 화면별로 재검토
          },
          mutations: {
            retry: 0, // 생성/수정/삭제 자동 재시도는 중복 요청(특히 POST) 위험이 있다
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
