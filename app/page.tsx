import { Header } from "@/components/layout/Header";

// M4 시점의 최소 placeholder. 로그인 상태 판정(GET /api/auth/me)에 따른
// 리다이렉트 로직은 M5에서 이 파일을 전면 재작성하며 추가된다.
export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
    </div>
  );
}
