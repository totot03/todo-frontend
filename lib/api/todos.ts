import { apiFetch } from "./client";
import type { PageResponse, Priority, Todo } from "@/types/api";

export interface TodoListParams {
  page?: number; // 0-based
  size?: number;
  completed?: boolean;
  keyword?: string;
  // 쿼리 파라미터로 직렬화되는 타입이라 인덱스 시그니처를 명시한다 —
  // 없으면 apiFetch의 searchParams(Record<string, ...>)에 구조적으로 할당되지 않는다.
  [key: string]: string | number | boolean | undefined;
  // sort는 의도적으로 없음 — API_SPEC.md 3.1: 확장 대비용 파라미터이며
  // 프론트엔드는 사용하지 않는다(정렬은 createdAt,desc 고정).
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
