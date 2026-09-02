import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { getMeServer } from "@/lib/api/server";

interface LoginPageProps {
  // Next.js 16: searchParams는 항상 Promise다(guides/nextjs-16.md). 동기 접근은 빌드/런타임 에러.
  searchParams: Promise<{ error?: string }>;
}

/**
 * 구글 로그인 실패 시 백엔드 OAuth2FailureHandler가 이 경로로 ?error=oauth를 붙여
 * 리다이렉트한다(API_SPEC.md 2.5). 이 값만 뽑아 Client 폼에 넘기는 얇은 Server 래퍼.
 *
 * US-2: "로그인 상태로 /login 접근 시 할 일 목록으로 보낸다" — 랜딩(app/page.tsx)과
 * 동일하게 서버에서 GET /api/auth/me로 판정한다(쿠키를 클라이언트에서 읽지 않는다).
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getMeServer();
  if (user) redirect("/todos");

  const { error } = await searchParams;
  return <LoginForm oauthError={error === "oauth"} />;
}
