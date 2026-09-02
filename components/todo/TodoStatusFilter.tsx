"use client";

import { Button } from "@/components/ui/button";

export type StatusFilterValue = "all" | "active" | "completed";

const OPTIONS: { value: StatusFilterValue; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "미완료" },
  { value: "completed", label: "완료" },
];

interface TodoStatusFilterProps {
  value: StatusFilterValue;
  onChange: (value: StatusFilterValue) => void;
}

/** 완료 상태 필터(FR-T07). URL의 completed 파라미터(true/false/없음)와 컨테이너가 서로 변환한다. */
export function TodoStatusFilter({ value, onChange }: TodoStatusFilterProps) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="완료 상태 필터">
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
