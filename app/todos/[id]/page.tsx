import { notFound } from "next/navigation";
import { getTodoServer } from "@/lib/api/server";
import { TodoDetailContainer } from "@/components/todo/TodoDetailContainer";

interface TodoDetailPageProps {
  // Next.js 16: params는 항상 Promise다(guides/nextjs-16.md).
  params: Promise<{ id: string }>;
}

/**
 * TODO_NOT_FOUND(없거나 타인 소유)와 잘못된 id 형식을 모두 notFound()로 보낸다 —
 * 원인을 구분해 노출하지 않는 것 자체가 FR-T13의 열거 공격 방지 원칙이다.
 */
export default async function TodoDetailPage({ params }: TodoDetailPageProps) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) notFound();

  const todo = await getTodoServer(numericId);
  if (!todo) notFound();

  return <TodoDetailContainer id={numericId} initialTodo={todo} />;
}
