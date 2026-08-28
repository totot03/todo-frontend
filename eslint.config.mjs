import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier/flat";

/**
 * ESLint 설정 (Flat Config)
 *
 * 구성 순서가 곧 우선순위다:
 *   1) next/core-web-vitals  — React Hooks 규칙 + Next.js 성능 규칙
 *   2) next/typescript       — @typescript-eslint 권장 규칙
 *   3) 프로젝트 커스텀 규칙   — 아래 project/rules 블록
 *   4) eslint-config-prettier — 포맷 관련 규칙을 "전부 끈다" (반드시 마지막)
 *
 * 4번이 마지막에 와야 하는 이유:
 *   포맷은 Prettier 단일 책임으로 두고, ESLint 는 "코드 품질"만 판단하게 한다.
 *   두 도구가 같은 줄을 서로 다르게 고치면 저장할 때마다 diff 가 요동친다.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  // 린트 대상에서 제외 — eslint-config-next 의 기본 ignores 를 명시적으로 재선언
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
    "coverage/**",
    "*.tsbuildinfo",
  ]),

  {
    name: "project/rules",
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
    rules: {
      // ── 디버깅 잔재 방지 ────────────────────────────────
      // console.log 는 경고(커밋은 가능), debugger 는 에러(절대 배포 불가)
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",

      // ── 자바스크립트 함정 방지 ──────────────────────────
      eqeqeq: ["error", "always", { null: "ignore" }],
      "prefer-const": "error",
      "no-var": "error",
      "object-shorthand": ["warn", "always"],

      // ── 타입스크립트 ────────────────────────────────────
      // _ 로 시작하는 인자/변수는 "의도적 미사용"으로 인정한다
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // any 는 타입 시스템을 무력화한다 — 경고로 계속 눈에 띄게 둔다
      "@typescript-eslint/no-explicit-any": "warn",
      // 타입 전용 import 를 분리하면 번들에 런타임 코드가 딸려오지 않는다
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },

  {
    name: "project/security",
    files: ["**/*.{jsx,tsx}"],
    rules: {
      // XSS 직결 — 꼭 필요하면 주석으로 사유를 남기고 eslint-disable 한다
      "react/no-danger": "warn",
      // target="_blank" + rel 누락은 탭내빙(tabnabbing) 취약점
      "react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always" }],
    },
  },

  // 설정 파일 자체는 Node 환경 스크립트이므로 일부 규칙을 완화한다
  {
    name: "project/config-files",
    files: ["*.config.{js,mjs,ts}", ".lintstagedrc.mjs"],
    rules: {
      "no-console": "off",
    },
  },

  // 포맷 관련 규칙 비활성화 — 항상 마지막
  prettierConfig,
]);

export default eslintConfig;
