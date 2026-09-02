"use client";

import { useEffect, useState } from "react";

/** 값이 delay(ms) 동안 바뀌지 않을 때만 갱신되는 지연 값. 키워드 검색 입력에 사용한다. */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
