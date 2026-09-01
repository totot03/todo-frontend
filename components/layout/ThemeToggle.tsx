"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * 라이트/다크 테마 전환 버튼 (FR-U01). next-themes의 useTheme으로
 * <html> 클래스를 토글하면 globals.css의 CSS 변수 토큰이 즉시 반영된다.
 *
 * 두 아이콘을 항상 렌더링해두고 Tailwind의 dark: variant로만 노출을 전환한다.
 * resolvedTheme으로 조건부 렌더링을 하면 서버는 시스템 설정을 몰라 하이드레이션
 * 전/후 마크업이 달라지는데, 이를 useState+useEffect의 "mounted" 패턴으로 피하면
 * 렌더링 직후 setState가 캐스케이딩 렌더를 유발해 react-hooks 규칙에 걸린다.
 * CSS만으로 전환하면 이 문제 자체가 생기지 않는다.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="테마 전환"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
      <span className="sr-only">테마 전환</span>
    </Button>
  );
}
