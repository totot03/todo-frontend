import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMeServer } from "@/lib/api/server";

/**
 * 랜딩(FR-A10). 로그인 상태 판정은 httpOnly 쿠키를 자바스크립트로 읽는 것이 아니라
 * Server Component에서 GET /api/auth/me를 직접 호출해 판정한다(PRD.md 7장).
 * 인증 실패는 이 화면 입장에서 정상 케이스이므로 getMeServer가 null로 흡수해 준다.
 */
export default async function LandingPage() {
  const user = await getMeServer();
  if (user) redirect("/todos");

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <CheckCircle2Icon className="size-12 text-primary" />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-balance">할 일을, 맥락과 함께</h1>
        <p className="text-sm text-balance text-muted-foreground">
          마감일과 우선순위를 붙이고, 서식 있는 설명으로 기록하세요. 이메일 또는 구글 계정으로 바로
          시작할 수 있습니다.
        </p>
      </div>
      <Button asChild size="lg" className="w-full">
        <Link href="/login">시작하기</Link>
      </Button>
    </div>
  );
}
