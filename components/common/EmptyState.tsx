import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  /** 생성 유도 CTA 등. 클릭 핸들러가 없어 이 컴포넌트는 상태·상호작용을 갖지 않는다 —
   * 호출부가 <Button asChild><Link href="...">...</Link></Button> 형태로 그대로 넘긴다. */
  action?: ReactNode;
  className?: string;
}

/** 목록이 비어 있을 때 표시하는 공통 화면 (FR-U04, NFR-U01). */
export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-12 text-center",
        className,
      )}
    >
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
