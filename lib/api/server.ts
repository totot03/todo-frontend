import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiFetch, ApiClientError } from "./client";
import type { Todo, User } from "@/types/api";

/**
 * Server Component 전용 헬퍼. Node 런타임의 fetch(undici)는 브라우저 쿠키 저장소가
 * 없어 apiFetch의 credentials:"include"가 아무 효과가 없다 — 이 파일이 유일하게
 * 들어온 요청의 Cookie 헤더를 직접 백엔드로 전달한다. 그 외 화면은 전부 브라우저에서
 * lib/api/auth.ts, lib/api/todos.ts를 그대로 쓴다.
 */
async function forwardedCookieHeader(): Promise<Record<string, string>> {
  const raw = (await cookies()).toString();
  return raw ? { Cookie: raw } : {};
}

/**
 * 랜딩(`/`)의 로그인 상태 판정 전용. 인증 실패는 "비로그인 상태"라는 정상 신호이므로
 * 여기서는 throw하지 않고 null로 흡수한다 — 랜딩은 비로그인 방문자도 접근 가능한 공개 화면이다.
 */
export async function getMeServer(): Promise<User | null> {
  try {
    return await apiFetch<User>("/api/auth/me", { headers: await forwardedCookieHeader() });
  } catch {
    return null;
  }
}

/**
 * `/todos/[id]` 최초 진입 조회 전용. TODO_NOT_FOUND(없거나 타인 소유)는 null을 반환해
 * 호출부가 Next.js notFound()로 처리하게 한다 — 원인을 구분해 노출하지 않는 것 자체가
 * FR-T13의 열거 공격 방지 원칙이다. UNAUTHORIZED(만료된 쿠키로 직접 진입한 방어적 케이스)는
 * 이 함수가 곧바로 /login으로 리다이렉트한다.
 */
export async function getTodoServer(id: number): Promise<Todo | null> {
  try {
    return await apiFetch<Todo>(`/api/todos/${id}`, { headers: await forwardedCookieHeader() });
  } catch (err) {
    if (err instanceof ApiClientError) {
      if (err.code === "TODO_NOT_FOUND") return null;
      if (err.code === "UNAUTHORIZED") redirect("/login");
    }
    throw err; // 네트워크 오류 등 그 외는 app/error.tsx가 처리
  }
}
