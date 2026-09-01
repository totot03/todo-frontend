/**
 * 백엔드 API 응답 계약(ApiResponse<T> 봉투)과 엔티티 DTO 타입.
 *
 * 요청(Request) 바디 타입은 이 파일에 두지 않는다. 그 요청을 실제로 보내는
 * lib/api/auth.ts, lib/api/todos.ts에 co-locate한다 — 응답 타입은 백엔드 계약이라
 * 안정적이지만, 요청 타입은 M5에서 Zod 스키마가 도입되면 z.infer로 대체될 가능성이
 * 높아 미리 여기 박아두면 중복·충돌 위험이 있다.
 */

/** 400 검증 실패 시 필드별 에러 메시지 */
export interface FieldError {
  field: string;
  message: string;
}

/** 실패 응답의 error 필드. code는 유니온으로 좁히지 않는다 —
 * 백엔드가 에러 코드를 늘려도 프론트 타입을 매번 갱신할 필요가 없게 하기 위함. */
export interface ApiErrorPayload {
  code: string;
  message: string;
  fieldErrors: FieldError[] | null;
}

/**
 * 모든 API 응답을 감싸는 공통 봉투. 판별 유니온으로 정의해
 * `success` 값으로 분기하면 `data`/`error`의 타입이 자동으로 좁혀진다.
 */
export type ApiResponse<T> =
  { success: true; data: T; error: null } | { success: false; data: null; error: ApiErrorPayload };

/**
 * 목록 조회 응답 봉투. `page`는 0-based (API_SPEC.md 1.4).
 * UI는 1-based이므로 사용하는 쪽(예: Pagination 컴포넌트 호출부)에서 변환한다.
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export type Provider = "LOCAL" | "GOOGLE";

/** GET /api/auth/me 등의 응답에 쓰이는 사용자 DTO */
export interface User {
  id: number;
  email: string;
  nickname: string;
  provider: Provider;
}

export type Priority = "HIGH" | "MEDIUM" | "LOW";

/** Todo API 응답에 쓰이는 할 일 DTO */
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  dueDate: string | null; // yyyy-MM-dd
  priority: Priority;
  completed: boolean;
  createdAt: string; // ISO-8601
  updatedAt: string;
}
