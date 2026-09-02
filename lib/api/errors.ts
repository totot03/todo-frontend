import { ApiClientError } from "./client";
import type { FieldError } from "@/types/api";

/**
 * ApiClientError의 fieldErrors를 꺼낸다. VALIDATION_FAILED(400)가 아니면 null —
 * 호출부가 이 값의 유무로 "필드별로 표시할지 / 폼 전체 에러로 표시할지"를 분기한다.
 */
export function extractFieldErrors(err: unknown): FieldError[] | null {
  if (err instanceof ApiClientError && err.fieldErrors && err.fieldErrors.length > 0) {
    return err.fieldErrors;
  }
  return null;
}

/**
 * 사용자에게 그대로 보여줄 한국어 메시지를 뽑는다. ApiClientError가 아니면(네트워크
 * 예외 등 apiFetch가 감싸지 못한 예외) fallback을 쓴다 — 스택 트레이스를 노출하지 않는다.
 */
export function extractErrorMessage(
  err: unknown,
  fallback = "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요",
): string {
  if (err instanceof ApiClientError) return err.message;
  return fallback;
}
