"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageToken = number | "ellipsis-left" | "ellipsis-right";

/**
 * 번호 축약 페이지 토큰을 계산한다 (예: 1 … 4 5 6 … 20).
 * 좌우 생략 부호를 구분하는 이유: 한 배열에 둘 다 나올 수 있어(1 … 4 5 6 … 20)
 * 단일 "ellipsis" 문자열로는 React key가 충돌한다.
 */
function getPageTokens(currentPage: number, totalPages: number, siblingCount: number): PageToken[] {
  const totalVisible = siblingCount * 2 + 5;
  if (totalPages <= totalVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from({ length: 3 + siblingCount * 2 }, (_, i) => i + 1);
    return [...leftRange, "ellipsis-right", totalPages];
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + siblingCount * 2;
    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => totalPages - rightCount + 1 + i,
    );
    return [1, "ellipsis-left", ...rightRange];
  }
  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i,
  );
  return [1, "ellipsis-left", ...middleRange, "ellipsis-right", totalPages];
}

interface PaginationProps {
  /** 1-based. PageResponse.page(0-based)는 호출부에서 +1해 전달한다. */
  currentPage: number;
  totalPages: number;
  /** 1-based 페이지 번호를 전달한다. 호출부가 -1해 API 파라미터로 변환한다. */
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

/**
 * 번호 축약 페이지네이션 (FR-U06). 완전히 통제된(controlled) 순수 프레젠테이션
 * 컴포넌트로, PageResponse<T>를 통째로 받지 않고 currentPage/totalPages만 받는다 —
 * 도메인 무관(common/)이라는 분류를 지키고, URL 쿼리·로컬 state 등
 * 목록 페이지가 어떤 상태 관리 전략을 쓰든 재사용할 수 있게 한다.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const tokens = getPageTokens(currentPage, totalPages, siblingCount);

  return (
    <nav
      aria-label="페이지 이동"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        variant="outline"
        size="icon"
        aria-label="이전 페이지"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft />
      </Button>

      {tokens.map((token) =>
        typeof token === "number" ? (
          <Button
            key={token}
            variant={token === currentPage ? "default" : "outline"}
            size="icon"
            aria-current={token === currentPage ? "page" : undefined}
            onClick={() => onPageChange(token)}
          >
            {token}
          </Button>
        ) : (
          <span
            key={token}
            aria-hidden="true"
            className="flex size-8 items-center justify-center text-muted-foreground"
          >
            <MoreHorizontal className="size-4" />
          </span>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        aria-label="다음 페이지"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}
