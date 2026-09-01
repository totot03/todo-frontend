"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * next-themes 래퍼. attribute="class"로 <html>에 light/dark 클래스를 토글하고,
 * app/globals.css에 이미 준비된 :root/.dark CSS 변수 토큰이 이를 따라간다.
 * defaultTheme="system"으로 FR-U01("기본값은 시스템 설정")을 충족한다.
 */
export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
