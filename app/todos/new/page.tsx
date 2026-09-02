"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTodo } from "@/lib/api/todos";
import { todoKeys } from "@/lib/query-keys";
import { toRequestBody } from "@/lib/schemas/todo";
import { TodoForm } from "@/components/todo/TodoForm";

export default function NewTodoPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      router.push("/todos");
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <h1 className="text-lg font-semibold">새 할 일</h1>
      <TodoForm
        onSubmit={(values) => mutation.mutateAsync(toRequestBody(values))}
        isPending={mutation.isPending}
        submitLabel="저장"
        onCancel={() => router.push("/todos")}
      />
    </div>
  );
}
