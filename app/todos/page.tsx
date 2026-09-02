import { Suspense } from "react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { TodoListContainer } from "@/components/todo/TodoListContainer";

// TodoListContainer가 useSearchParams를 쓰므로 Suspense 경계가 필요하다(Next.js 요구사항).
export default function TodosPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="할 일을 불러오는 중" className="mt-16" />}>
      <TodoListContainer />
    </Suspense>
  );
}
