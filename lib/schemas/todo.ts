import { z } from "zod";
import type { CreateTodoRequest, UpdateTodoRequest } from "@/lib/api/todos";
import type { Todo } from "@/types/api";

export const todoFormSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요").max(200, "제목은 200자 이내로 입력해주세요"),
  // 네이티브 <input type="date">가 이미 yyyy-MM-dd 문자열을 반환하므로 그대로 받는다.
  // 마감일은 과거 날짜도 허용한다(PRD.md 8.1 — 이미 지난 일을 기록할 수 있어야 함).
  dueDate: z.string().optional(),
  priority: z.enum(["HIGH", "MEDIUM", "LOW"]),
  // Tiptap이 채우는 HTML 문자열. 서버가 저장 전 sanitize하므로 여기서 태그를 검증하지 않는다.
  description: z.string().optional(),
});

export type TodoFormValues = z.infer<typeof todoFormSchema>;

export const todoFormDefaultValues: TodoFormValues = {
  title: "",
  dueDate: "",
  priority: "MEDIUM",
  description: "",
};

/** 폼 값 → API 요청 바디. 빈 문자열은 "값 없음"으로 취급해 undefined로 보낸다. */
export function toRequestBody(values: TodoFormValues): CreateTodoRequest & UpdateTodoRequest {
  return {
    title: values.title,
    dueDate: values.dueDate || undefined,
    priority: values.priority,
    description: values.description || undefined,
  };
}

/** API 응답(Todo) → 편집 폼 초기값. null 필드를 폼이 다루는 빈 문자열로 변환한다. */
export function toFormValues(todo: Todo): TodoFormValues {
  return {
    title: todo.title,
    dueDate: todo.dueDate ?? "",
    priority: todo.priority,
    description: todo.description ?? "",
  };
}
