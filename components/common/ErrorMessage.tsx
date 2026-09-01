"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  /** API_SPEC.md의 error.message — 사용자에게 그대로 보여줄 한국어 문장 */
  message: string;
  /** 있으면 "다시 시도" 버튼을 노출한다 (FR-U05) */
  onRetry?: () => void;
  className?: string;
}

/** 요청 실패 시 표시하는 공통 에러 화면. 재시도 수단을 제공한다 (FR-U05, NFR-U01). */
export function ErrorMessage({
  title = "문제가 발생했습니다",
  message,
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-border px-6 py-12 text-center",
        className,
      )}
    >
      <AlertCircle className="size-8 text-destructive" />
      <p className="text-base font-medium text-foreground">{title}</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          다시 시도
        </Button>
      )}
    </div>
  );
}
