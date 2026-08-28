/**
 * lint-staged 설정 (프론트엔드 전용)
 *
 * 루트 .husky/pre-commit 에서 실행되지만, lint-staged 는 스테이징된 파일에서
 * "가장 가까운 설정 파일"을 찾아 그 디렉터리를 cwd 로 명령을 돌린다.
 * → 이 파일 덕분에 todo-frontend 안의 eslint/prettier/tsconfig 가 그대로 적용된다.
 *
 * 여기에 타입 체크를 넣지 않는 이유:
 *   tsc 는 파일 단위 검사가 불가능해(프로젝트 전체 그래프가 필요) 스테이징된
 *   일부 파일만 넘기면 오탐이 발생한다. 타입 체크는 .husky/pre-push 로 분리했다.
 */
const config = {
  // 1) eslint --fix 로 자동 수정 → 2) prettier 로 포맷 (순서 중요: 포맷이 마지막)
  //    --no-warn-ignored: eslint 무시 대상 파일이 스테이징되어도 에러로 끝내지 않는다
  "*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}": ["eslint --fix --no-warn-ignored", "prettier --write"],

  // 코드가 아닌 파일은 포맷만
  "*.{json,jsonc,css,scss,md,mdx,yml,yaml,html}": ["prettier --write"],
};

export default config;
