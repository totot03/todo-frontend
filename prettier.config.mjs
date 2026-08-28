/**
 * Prettier 설정 — 코드 포맷 단일 출처
 *
 * 규칙 결정 근거:
 * - endOfLine "lf": Windows(core.autocrlf=true) 환경에서 줄바꿈이 CRLF/LF로
 *   요동치는 것을 막는다. .gitattributes(eol=lf)와 짝을 이룬다.
 * - printWidth 100: TSX + 한국어 주석 조합에서 기본값 80은 지나치게 좁다.
 * - tailwindStylesheet: Tailwind v4는 CSS-first 설정이므로 tailwind.config.js가
 *   아니라 globals.css를 지정해야 클래스 정렬 플러그인이 토큰을 인식한다.
 * - tailwindFunctions: cn()/cva() 안에 들어간 클래스 문자열도 정렬 대상에 포함.
 *
 * @type {import("prettier").Config}
 */
const config = {
  semi: true,
  singleQuote: false,
  jsxSingleQuote: false,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",

  // Tailwind 클래스 자동 정렬 (플러그인은 항상 마지막에 위치해야 한다)
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/globals.css",
  tailwindFunctions: ["cn", "cva"],
};

export default config;
