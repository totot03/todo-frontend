"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useServerInsertedHTML } from "next/navigation";

/**
 * next-themes(0.4.6) 대체 자체 구현.
 *
 * next-themes는 FOUC 방지용 <script>를 일반 React 엘리먼트(t.createElement("script", ...))로
 * 렌더링하는데, 이 노드가 컴포넌트 트리의 정상적인 자식(children과 나란히)으로 취급되다 보니
 * React 19가 "컴포넌트 안에서 렌더링된 script는 클라이언트에서 실행되지 않는다"고 매번 경고한다
 * (pacocoursey/next-themes#385·#387, next-themes는 2025-03 이후 업데이트가 없어 라이브러리 차원
 * 수정을 기대하기 어렵다). 아래는 같은 스크립트를 next/navigation의 useServerInsertedHTML로
 * 서버 렌더링 스트림에 직접 삽입한다 — 이 경로는 일반 클라이언트 렌더 트리를 타지 않으므로
 * 저 경고 자체가 발생하지 않는다.
 */

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "theme";

type ThemeContextValue = {
  /** 사용자가 선택한 값. "system"이면 OS 설정을 따른다. */
  theme: Theme;
  /** 실제로 화면에 적용된 값(system이면 그 시점의 OS 설정을 이미 반영한 light/dark). */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// localStorage에서 테마를 읽어 하이드레이션 전에 동기적으로 <html>에 dark 클래스를 적용한다.
// 브라우저가 이 <script>를 만나는 즉시(React 개입 없이) 실행하므로 첫 페인트에 깜빡임이 없다.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY,
)})||"system";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);document.documentElement.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyResolvedTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.style.colorScheme = resolved;
}

/** next-themes의 disableTransitionOnChange 재현 — 테마 전환 순간에만 transition을 잠깐 끈다. */
function withTransitionsDisabled(apply: () => void) {
  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(style);
  apply();
  // 강제 리플로우로 위 스타일이 실제로 반영된 상태를 한 번 만든 뒤에 제거해야,
  // 지금 일어난 클래스 변경만 transition 없이 적용되고 그 이후 변경은 다시 정상 동작한다.
  void window.getComputedStyle(document.body).colorScheme;
  window.setTimeout(() => {
    document.head.removeChild(style);
  }, 1);
}

/**
 * useState의 lazy initializer로 최초 렌더 시 한 번만 계산한다. SSR에서는 window가 없어
 * "system"/"light"로 시작하고, 클라이언트 하이드레이션(=최초 클라이언트 렌더) 시점에는
 * 이 함수가 다시 실행돼 실제 localStorage 값을 즉시 반영한다 — 마운트 useEffect에서
 * setState를 동기 호출하면 캐스케이딩 렌더가 생긴다는 react-hooks/set-state-in-effect
 * 경고(ThemeToggle.tsx 기존 주석 참고)를 피하면서도 별도 useEffect 없이 초기값을 맞춘다.
 */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") return saved;
  } catch {
    // localStorage 접근 불가(프라이빗 모드 등) — system 기본값 유지
  }
  return "system";
}

function getInitialResolvedTheme(theme: Theme): ResolvedTheme {
  if (theme !== "system") return theme;
  return typeof window === "undefined" ? "light" : getSystemTheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  useServerInsertedHTML(() => (
    <script
      key="theme-init"
      // eslint-disable-next-line react/no-danger -- FOUC 방지용 테마 초기화 스크립트(next-themes 대체)
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
    />
  ));

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    getInitialResolvedTheme(theme),
  );

  // theme이 "system"인 동안에는 OS 설정이 바뀌면 즉시 따라간다.
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = getSystemTheme();
      setResolvedTheme(next);
      applyResolvedTheme(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next: Theme) => {
    const resolved = next === "system" ? getSystemTheme() : next;
    withTransitionsDisabled(() => applyResolvedTheme(resolved));
    setThemeState(next);
    setResolvedTheme(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // 저장 실패해도 현재 세션의 테마 적용에는 지장 없음(다음 방문 시 system으로 복귀)
    }
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme은 ThemeProvider 내부에서만 사용할 수 있다");
  return ctx;
}
