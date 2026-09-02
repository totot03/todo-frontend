"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { getTodos } from "@/lib/api/todos";
import { extractErrorMessage } from "@/lib/api/errors";
import { todoKeys } from "@/lib/query-keys";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Pagination } from "@/components/common/Pagination";
import { TodoList } from "./TodoList";
import { TodoSearchInput } from "./TodoSearchInput";
import { TodoSortToggle, type SortFilterValue } from "./TodoSortToggle";
import { TodoStatusFilter, type StatusFilterValue } from "./TodoStatusFilter";

const PAGE_SIZE = 10;

function toStatusFilterValue(completedRaw: string | null): StatusFilterValue {
  if (completedRaw === "true") return "completed";
  if (completedRaw === "false") return "active";
  return "all";
}

function fromStatusFilterValue(value: StatusFilterValue): string | undefined {
  if (value === "completed") return "true";
  if (value === "active") return "false";
  return undefined;
}

function toSortFilterValue(sortRaw: string | null): SortFilterValue {
  return sortRaw === "oldest" ? "oldest" : "latest";
}

/**
 * /todos 오케스트레이션. URL searchParams(page/completed/keyword/sort)를 단일 진실 소스로 삼아
 * 새로고침·뒤로가기·공유 링크가 자연스럽게 동작하고, React Query의 queryKey가 URL과
 * 1:1 대응해 캐시 일관성을 얻는다.
 */
export function TodoListContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1"); // URL은 1-based
  const completedRaw = searchParams.get("completed");
  const keyword = searchParams.get("keyword") ?? "";
  const sortValue = toSortFilterValue(searchParams.get("sort"));

  const queryParams = {
    page: page - 1, // API는 0-based — Pagination 컴포넌트 호출부와 동일한 변환 경계
    size: PAGE_SIZE,
    completed: completedRaw === null ? undefined : completedRaw === "true",
    keyword: keyword || undefined,
    // 기본값(최신순)은 생략해 이 기능 도입 전과 동일한 요청/캐시 키를 유지한다.
    sort: sortValue === "oldest" ? ("createdAt,asc" as const) : undefined,
  };

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: todoKeys.list(queryParams),
    queryFn: () => getTodos(queryParams),
    placeholderData: keepPreviousData, // 페이지 전환 시 깜빡임 방지
  });

  function patchParams(patch: Record<string, string | undefined>, resetPage = true) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, val]) => {
      if (val === undefined) next.delete(key);
      else next.set(key, val);
    });
    if (resetPage) next.delete("page"); // 필터/검색이 바뀌면 1페이지로 리셋
    const qs = next.toString();
    router.push(qs ? `/todos?${qs}` : "/todos");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-lg font-semibold">할 일 목록</h1>
        <Button asChild size="sm">
          <Link href="/todos/new">
            <PlusIcon className="size-4" />새 할 일
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <TodoStatusFilter
          value={toStatusFilterValue(completedRaw)}
          onChange={(value) => patchParams({ completed: fromStatusFilterValue(value) })}
        />
        <TodoSortToggle
          value={sortValue}
          onChange={(value) => patchParams({ sort: value === "oldest" ? "oldest" : undefined })}
        />
        <TodoSearchInput
          value={keyword}
          onChange={(next) => patchParams({ keyword: next || undefined })}
        />
      </div>

      {isPending ? (
        <LoadingSpinner label="할 일을 불러오는 중" className="mt-16" />
      ) : isError ? (
        <ErrorMessage message={extractErrorMessage(error)} onRetry={() => void refetch()} />
      ) : data.content.length === 0 ? (
        <EmptyState
          title="할 일이 없습니다"
          description="새 할 일을 추가해 시작해 보세요"
          action={
            <Button asChild>
              <Link href="/todos/new">새 할 일 만들기</Link>
            </Button>
          }
        />
      ) : (
        <>
          <TodoList todos={data.content} />
          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={(nextPage) => patchParams({ page: String(nextPage) }, false)}
          />
        </>
      )}
    </div>
  );
}
