import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "size-4",
  md: "size-6",
  lg: "size-8",
} as const;

interface LoadingSpinnerProps {
  /** 스크린리더용 라벨. 화면에는 표시되지 않는다. */
  label?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
}

/** 데이터 로딩 중 표시하는 공통 스피너 (FR-U03, NFR-U01). */
export function LoadingSpinner({ label = "로딩 중", size = "md", className }: LoadingSpinnerProps) {
  return (
    <div role="status" className={cn("flex items-center justify-center", className)}>
      <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size])} />
      <span className="sr-only">{label}</span>
    </div>
  );
}
