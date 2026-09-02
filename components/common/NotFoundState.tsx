import Link from "next/link";
import { FileQuestionIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/common/EmptyState";

/**
 * app/not-found.tsx가 렌더링하는 본문이자, /todos/[id]의 클라이언트 재조회에서
 * TODO_NOT_FOUND를 받았을 때도 동일하게 사용한다(TodoDetailContainer). "존재하지 않는
 * 라우트"와 "FR-T13 타인 소유 404"를 같은 화면으로 통일해 원인을 구분해 노출하지 않는다.
 */
export function NotFoundState() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <EmptyState
        icon={<FileQuestionIcon className="size-10" />}
        title="요청하신 페이지를 찾을 수 없습니다"
        description="주소가 정확한지 확인하거나, 목록으로 돌아가 다시 시도해 주세요"
        action={
          <Button asChild>
            <Link href="/todos">할 일 목록으로</Link>
          </Button>
        }
      />
    </div>
  );
}
