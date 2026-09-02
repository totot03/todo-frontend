import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js 16부터 최상위 옵션이다(experimental.typedRoutes 아님, guides/nextjs-16.md).
  // router.push({ pathname, query })에 잘못된 경로를 넘기면 타입 에러로 잡힌다.
  typedRoutes: true,
};

export default nextConfig;
