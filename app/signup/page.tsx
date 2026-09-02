import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/SignupForm";
import { getMeServer } from "@/lib/api/server";

/** /login과 동일한 이유로 이미 로그인 상태면 /todos로 보낸다(PRD.md 7장 접근 권한: "비로그인"). */
export default async function SignupPage() {
  const user = await getMeServer();
  if (user) redirect("/todos");

  return <SignupForm />;
}
