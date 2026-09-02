"use client";

import Link from "next/link";
import { useState } from "react";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useDeleteTodo } from "@/hooks/useDeleteTodo";
import { useToggleTodo } from "@/hooks/useToggleTodo";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types/api";
import { PriorityBadge } from "./PriorityBadge";

/**
 * 목록의 한 행. 완료 토글·삭제는 useToggleTodo/useDeleteTodo의 낙관적 업데이트를 그대로
 * 쓴다 — 이 컴포넌트는 어떤 캐시 조작도 직접 하지 않는다(중복 방지, hooks/에 위임).
 */
export function TodoListItem({ todo }: { todo: Todo }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toggleMutation = useToggleTodo();
  const deleteMutation = useDeleteTodo();

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => toggleMutation.mutate(todo.id)}
        aria-label={todo.completed ? `${todo.title} 완료 취소` : `${todo.title} 완료 처리`}
      />
      <Link
        href={`/todos/${todo.id}`}
        className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-3"
      >
        <span
          className={cn(
            "truncate text-sm transition-opacity duration-200",
            todo.completed && "text-muted-foreground line-through opacity-70",
          )}
        >
          {todo.title}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <PriorityBadge priority={todo.priority} />
          {todo.dueDate && <span className="text-xs text-muted-foreground">{todo.dueDate}</span>}
        </div>
      </Link>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="할 일 삭제"
        onClick={() => setConfirmOpen(true)}
      >
        <TrashIcon className="size-4" />
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={() => {
          // 낙관적 업데이트가 목록에서 즉시 제거하므로 다이얼로그도 바로 닫는다(FR-T12).
          deleteMutation.mutate(todo.id);
          setConfirmOpen(false);
        }}
        title="할 일을 삭제할까요?"
        description={`"${todo.title}"을(를) 삭제하면 목록에서 즉시 사라집니다.`}
      />
    </div>
  );
}
