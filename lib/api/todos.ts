import { apiFetch } from "./client";
import type { PageResponse, Priority, Todo } from "@/types/api";

export interface TodoListParams {
  page?: number; // 0-based
  size?: number;
  completed?: boolean;
  keyword?: string;
  // 정렬 필드는 createdAt으로 고정, 방향만 선택 가능 (API_SPEC.md 3.1, FR-T06).
  // 기본값(createdAt,desc)일 땐 생략해 캐시 키/URL을 기존과 동일하게 유지한다.
  sort?: "createdAt,desc" | "createdAt,asc";
  // 쿼리 파라미터로 직렬화되는 타입이라 인덱스 시그니처를 명시한다 —
  // 없으면 apiFetch의 searchParams(Record<string, ...>)에 구조적으로 할당되지 않는다.
  [key: string]: string | number | boolean | undefined;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  dueDate?: string; // yyyy-MM-dd
  priority?: Priority;
}

export type UpdateTodoRequest = Partial<CreateTodoRequest>;

export function getTodos(params: TodoListParams = {}) {
  return apiFetch<PageResponse<Todo>>("/api/todos", { searchParams: params });
}

export function getTodo(id: number) {
  return apiFetch<Todo>(`/api/todos/${id}`);
}

export function createTodo(body: CreateTodoRequest) {
  return apiFetch<Todo>("/api/todos", { method: "POST", body });
}

export function updateTodo(id: number, body: UpdateTodoRequest) {
  return apiFetch<Todo>(`/api/todos/${id}`, { method: "PATCH", body });
}

export function toggleTodo(id: number) {
  return apiFetch<Todo>(`/api/todos/${id}/toggle`, { method: "PATCH" });
}

export function deleteTodo(id: number) {
  return apiFetch<null>(`/api/todos/${id}`, { method: "DELETE" });
}
