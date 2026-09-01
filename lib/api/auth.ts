import { apiFetch } from "./client";
import type { User } from "@/types/api";

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export function signup(body: SignupRequest) {
  return apiFetch<User>("/api/auth/signup", { method: "POST", body });
}

export function login(body: LoginRequest) {
  return apiFetch<User>("/api/auth/login", { method: "POST", body });
}

export function logout() {
  return apiFetch<null>("/api/auth/logout", { method: "POST" });
}

/**
 * 프론트엔드의 인증 상태 판정은 이 함수(GET /api/auth/me)로만 한다.
 * httpOnly 쿠키는 자바스크립트로 읽을 수 없고, 읽어서도 안 된다.
 */
export function getMe() {
  return apiFetch<User>("/api/auth/me");
}

// 구글 로그인(GET /oauth2/authorization/google)은 여기 두지 않는다.
// API_SPEC.md 2.5: JSON API가 아니므로 fetch로 호출하지 않고
// window.location.href로 직접 이동시킨다 (M5에서 소셜 로그인 버튼 구현 시 처리).
