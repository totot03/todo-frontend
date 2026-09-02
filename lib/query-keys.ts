import type { TodoListParams } from "@/lib/api/todos";

/**
 * React Query 캐시 키 팩토리. list와 detail의 prefix를 분리하는 것이 중요하다 —
 * 합쳐두면 낙관적 업데이트에서 setQueriesData({queryKey: todoKeys.all})가 상세 화면의
 * 단일 Todo 캐시까지 걸려, 목록 형태(PageResponse<Todo>)를 가정한 업데이트 함수가
 * 상세 캐시(Todo 객체 자체)에 적용되며 런타임 에러가 난다.
 */
export const todoKeys = {
  all: ["todos"] as const,
  lists: () => [...todoKeys.all, "list"] as const,
  list: (params: TodoListParams) => [...todoKeys.lists(), params] as const,
  details: () => [...todoKeys.all, "detail"] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

export const authKeys = {
  me: ["auth", "me"] as const,
};
