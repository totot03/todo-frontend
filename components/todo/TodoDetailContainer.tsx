"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotFoundState } from "@/components/common/NotFoundState";
import { ApiClientError } from "@/lib/api/client";
import { getTodo, updateTodo } from "@/lib/api/todos";
import { todoKeys } from "@/lib/query-keys";
import { toFormValues, toRequestBody } from "@/lib/schemas/todo";
import { useDeleteTodo } from "@/hooks/useDeleteTodo";
import { useToggleTodo } from "@/hooks/useToggleTodo";
import type { Todo } from "@/types/api";
import { TodoDetailView } from "./TodoDetailView";
import { TodoForm } from "./TodoForm";

interface TodoDetailContainerProps {
  id: number;
  /** app/todos/[id]/page.tsx(Server)가 getTodoServer로 미리 가져온 값 — 첫 페인트 깜빡임 방지. */
  initialTodo: Todo;
}

/** /todos/[id] 오케스트레이션: 조회·토글·편집·삭제를 한곳에 모은다. */
export function TodoDetailContainer({ id, initialTodo }: TodoDetailContainerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: todo, error } = useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => getTodo(id),
    initialData: initialTodo,
  });

  const toggleMutation = useToggleTodo();
  const deleteMutation = useDeleteTodo();
  const updateMutation = useMutation({
    mutationFn: (body: ReturnType<typeof toRequestBody>) => updateTodo(id, body),
    onSuccess: (updated) => {
      queryClient.setQueryData(todoKeys.detail(id), updated);
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      setIsEditing(false);
    },
  });

  // 클라이언트 재조회 중(다른 탭에서 삭제된 경우 등) TODO_NOT_FOUND를 받을 수 있다 —
  // 서버 notFound()를 쓸 수 없는 이 경로에서도 app/not-found.tsx와 동일한 UI로 통일한다.
  if (error instanceof ApiClientError && error.code === "TODO_NOT_FOUND") {
    return <NotFoundState />;
  }
  if (!todo) return null;

  if (isEditing) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 sm:p-6">
        <h1 className="text-lg font-semibold">할 일 수정</h1>
        <TodoForm
          defaultValues={toFormValues(todo)}
          onSubmit={(values) => updateMutation.mutateAsync(toRequestBody(values))}
          isPending={updateMutation.isPending}
          submitLabel="저장"
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <TodoDetailView
      todo={todo}
      onToggle={() => toggleMutation.mutate(id)}
      onEdit={() => setIsEditing(true)}
      onDelete={() => deleteMutation.mutate(id, { onSuccess: () => router.push("/todos") })}
      isDeleting={deleteMutation.isPending}
    />
  );
}
