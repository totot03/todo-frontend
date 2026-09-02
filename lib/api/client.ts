import type { ApiResponse, FieldError } from "@/types/api";

// 미설정 시 API_SPEC.md가 명시한 로컬 기본값으로 폴백 — CI는 .env를 만들지 않고
// 바로 빌드하므로, 환경 변수가 없어도 빌드가 깨지면 안 된다.
// export하는 이유: 구글 로그인 버튼이 window.location.href로 직접 이동할 때도
// 동일한 백엔드 주소를 써야 하므로(BASE_URL 이중 정의 방지, M5).
export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

/**
 * 백엔드 에러 코드/메시지/상태코드를 그대로 실어 나르는 에러.
 * LOGIN_FAILED/TODO_NOT_FOUND 등은 code 값 자체를 그대로 던질 뿐,
 * 여기서 원인을 재해석하지 않는다 (열거 공격 방지 원칙을 프론트도 지킨다).
 */
export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly fieldErrors: FieldError[] | null = null,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  searchParams?: Record<string, string | number | boolean | undefined>;
  // Server Component 전용. Node 런타임의 fetch는 브라우저 쿠키 저장소가 없어
  // credentials:"include"가 아무 효과가 없으므로, 들어온 요청의 Cookie 헤더를
  // 수동으로 실어 보낼 때만 쓴다(lib/api/server.ts). 브라우저에서는 쓰지 않는다.
  headers?: Record<string, string>;
}

function buildUrl(path: string, searchParams?: ApiFetchOptions["searchParams"]): string {
  const url = new URL(path, BASE_URL);
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * ApiResponse<T> 봉투를 벗기는 유일한 지점. 실패 시 ApiClientError를 throw한다 —
 * React Query가 queryFn/mutationFn의 reject를 표준 실패 신호로 삼기 때문에,
 * { ok: false } 형태로 반환하면 모든 훅에서 수동 분기를 강제하게 된다.
 *
 * 401 응답을 보고 로그인 페이지로 리다이렉트하는 책임은 이 함수에 두지 않는다.
 * 이 함수는 서버(Server Component)와 브라우저 양쪽에서 호출될 수 있어
 * window.location을 쓸 수 없다. 전체 페이지 진입 차단은 proxy.ts가,
 * 세션 중간 만료 UX는 실제 화면이 생기는 M5에서 처리한다.
 */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = "GET", body, searchParams, headers } = options;

  let res: Response;
  try {
    res = await fetch(buildUrl(path, searchParams), {
      method,
      headers: { "Content-Type": "application/json", ...headers },
      credentials: "include", // 인증은 이 한 줄이 전부 — 토큰을 저장·조회·첨부하지 않는다
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // 네트워크 자체가 끊긴 경우(서버 다운, CORS 프리플라이트 실패 등) — JSON 응답이 없다.
    throw new ApiClientError(
      "NETWORK_ERROR",
      "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요",
      0,
    );
  }

  // res.json()은 DOM lib상 Promise<any>로 타입돼 있다 — 명시적으로 단언해 any 오염을 막는다.
  const json = (await res.json()) as ApiResponse<T>;

  if (!json.success) {
    throw new ApiClientError(
      json.error.code,
      json.error.message,
      res.status,
      json.error.fieldErrors,
    );
  }

  return json.data;
}
