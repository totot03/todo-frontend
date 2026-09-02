import { NotFoundState } from "@/components/common/NotFoundState";

/**
 * notFound()가 렌더링하는 전역 404. "존재하지 않는 라우트"와 "FR-T13 타인 소유 할 일
 * 접근"을 같은 화면으로 통일한다 — 원인을 구분해 노출하지 않는 것 자체가 열거 공격
 * 방지 원칙이다(app/todos/[id]/page.tsx가 이 화면으로 연결한다).
 */
export default function NotFound() {
  return <NotFoundState />;
}
