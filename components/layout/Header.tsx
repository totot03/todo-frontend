import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface HeaderProps {
  /** 로그인 상태별 메뉴(로그아웃/로그인·회원가입) 슬롯.
   * 인증 상태를 판정할 훅(GET /api/auth/me)이 M5에서 만들어지므로,
   * 이 시점엔 Header 내부를 고치지 않고도 M5가 여기에 주입할 수 있게 열어둔다. */
  children?: ReactNode;
}

/** 모든 페이지가 공유하는 공통 헤더: 로고 / 확장 슬롯 / 테마 토글. */
export function Header({ children }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border px-4">
      <Link href="/" className="text-sm font-semibold text-foreground">
        Todo
      </Link>
      <div className="flex items-center gap-2">
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}
