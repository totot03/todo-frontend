import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Header } from "@/components/layout/Header";
import { AuthMenu } from "@/components/layout/AuthMenu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todo",
  description: "할 일 관리 앱",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes가 하이드레이션 전 스크립트로 <html class="dark">를 즉시 주입해
    // 서버 렌더링 초기 HTML과 클라이언트 첫 페인트가 항상 달라진다.
    // 이 엘리먼트 하나에 한해 경고를 끈다(React 전역이 아님).
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          <QueryProvider>
            <Header>
              <AuthMenu />
            </Header>
            <main className="flex flex-1 flex-col">{children}</main>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
