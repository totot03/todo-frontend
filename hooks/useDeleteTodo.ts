"use client";

import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { deleteTodo } from "@/lib/api/todos";
import { todoKeys } from "@/lib/query-keys";
import type { PageResponse, Todo } from "@/types/api";

interface DeleteContext {
  previousLists: [QueryKey, PageResponse<Todo> | undefined][];
  previousDetail: Todo | undefined;
  id: number;
}

/**
 * 삭제 낙관적 업데이트(FR-T12). useToggleTodo와 동일한 골격이되, 목록 캐시에서
 * 항목을 제거하고 totalElements를 맞춰 페이지네이션 숫자가 어긋나지 않게 한다.
 *
 * 성공 후 라우팅이 필요한 호출부(상세 화면: /todos로 이동)는
 * mutate(id, { onSuccess }) 두 번째 인자로 직접 넘긴다 — 목록 행 삭제는 이동이 없어야 한다.
 */
export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTodo(id),
    onMutate: async (id): Promise<DeleteContext> => {
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
              content: page.content.filter((todo) => todo.id !== id),
              totalElements: Math.max(0, page.totalElements - 1),
            }
          : page,
      );

      return { previousLists, previousDetail, id };
    },
    onError: (_err, _id, ctx) => {
      ctx?.previousLists.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: (_data, _err, id) => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      queryClient.removeQueries({ queryKey: todoKeys.detail(id) });
    },
  });
}
