"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toggleTodo } from "@/lib/api/todos";
import { todoKeys } from "@/lib/query-keys";
import type { PageResponse, Todo } from "@/types/api";

interface ToggleContext {
  previousLists: [QueryKey, PageResponse<Todo> | undefined][];
  previousDetail: Todo | undefined;
  id: number;
}

/**
 * 완료 토글 낙관적 업데이트(FR-T12). 목록 캐시(전체 페이지·필터 조합)와 상세 캐시를
 * 동시에 즉시 반전시키고, 실패하면 스냅샷으로 되돌린다. TodoListItem·TodoDetailContainer
 * 양쪽에서 이 훅의 별도 인스턴스를 그대로 재사용해 낙관적 업데이트 로직을 중복시키지 않는다.
 *
 * 라우팅은 이 훅 안에서 하지 않는다 — 목록에서 토글할 땐 페이지 이동이 없어야 하므로,
 * 필요한 호출부(TodoDetailContainer)가 직접 처리한다.
 */
export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleTodo(id),
    onMutate: async (id): Promise<ToggleContext> => {
      await queryClient.cancelQueries({ queryKey: todoKeys.lists() });
      await queryClient.cancelQueries({ queryKey: todoKeys.detail(id) });

      const previousLists = queryClient.getQueriesData<PageResponse<Todo>>({
        queryKey: todoKeys.lists(),
      });
      const previousDetail = queryClient.getQueryData<Todo>(todoKeys.detail(id));

      queryClient.setQueriesData<PageResponse<Todo>>({ queryKey: todoKeys.lists() }, (page) =>
        page
          ? {
              ...page,
              content: page.content.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo,
              ),
            }
          : page,
      );
      if (previousDetail) {
        queryClient.setQueryData<Todo>(todoKeys.detail(id), {
          ...previousDetail,
          completed: !previousDetail.completed,
        });
      }

      return { previousLists, previousDetail, id };
    },
    onError: (_err, _id, ctx) => {
      ctx?.previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data));
      if (ctx?.previousDetail)
        queryClient.setQueryData(todoKeys.detail(ctx.id), ctx.previousDetail);
    },
    onSettled: (_data, _err, id) => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.invalidateQueries({ queryKey: todoKeys.detail(id) });
    },
  });
}
