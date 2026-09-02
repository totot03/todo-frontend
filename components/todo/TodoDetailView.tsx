"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TiptapViewer } from "@/components/editor/TiptapViewer";
import { cn } from "@/lib/utils";
import type { Todo } from "@/types/api";
import { PriorityBadge } from "./PriorityBadge";

interface TodoDetailViewProps {
  todo: Todo;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

/** /todos/[id]의 읽기 전용 뷰(FR-T05). 편집 진입·삭제 확인은 TodoDetailContainer가 오케스트레이션한다. */
export function TodoDetailView({
  todo,
  onToggle,
  onEdit,
  onDelete,
  isDeleting = false,
}: TodoDetailViewProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={onToggle}
          className="mt-1.5"
          aria-label={todo.completed ? `${todo.title} 완료 취소` : `${todo.title} 완료 처리`}
        />
        <h1
          className={cn(
            "flex-1 text-xl font-semibold break-words transition-opacity duration-200",
            todo.completed && "text-muted-foreground line-through opacity-70",
          )}
        >
          {todo.title}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <PriorityBadge priority={todo.priority} />
        {todo.dueDate && (
          <span className="text-sm text-muted-foreground">마감일 {todo.dueDate}</span>
        )}
      </div>

      <div className="rounded-lg border border-border p-4">
        {todo.description ? (
          <TiptapViewer html={todo.description} />
        ) : (
          <p className="text-sm text-muted-foreground">설명이 없습니다</p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onEdit}>
          <PencilIcon className="size-4" />
          수정
        </Button>
        <Button type="button" variant="destructive" onClick={() => setConfirmOpen(true)}>
          <TrashIcon className="size-4" />
          삭제
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={onDelete}
        title="할 일을 삭제할까요?"
        description={`"${todo.title}"을(를) 삭제하면 목록으로 돌아갑니다.`}
        isPending={isDeleting}
      />
    </div>
  );
}
