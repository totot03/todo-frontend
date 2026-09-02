"use client";

import { Button } from "@/components/ui/button";

export type SortFilterValue = "latest" | "oldest";

const OPTIONS: { value: SortFilterValue; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "oldest", label: "오래된순" },
];

interface TodoSortToggleProps {
  value: SortFilterValue;
  onChange: (value: SortFilterValue) => void;
}

/** 목록 정렬 방향 토글. 정렬 필드는 createdAt으로 고정이며 방향만 선택할 수 있다(FR-T06). */
export function TodoSortToggle({ value, onChange }: TodoSortToggleProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="정렬 순서">
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          type="button"
          size="sm"
          variant={value === option.value ? "default" : "ghost"}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
}
