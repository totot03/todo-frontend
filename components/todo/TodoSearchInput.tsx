"use client";

import { useEffect, useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface TodoSearchInputProps {
  value: string;
  onChange: (keyword: string) => void;
}

/**
 * 제목·설명 키워드 검색(FR-T08). 입력은 로컬 state로 즉시 반영해 타이핑이 끊기지 않게 하고,
 * 300ms 지연된 값만 부모(URL searchParams)로 올린다.
 */
export function TodoSearchInput({ value, onChange }: TodoSearchInputProps) {
  const [draft, setDraft] = useState(value);
  const [syncedValue, setSyncedValue] = useState(value);
  const debounced = useDebouncedValue(draft, 300);

  // 렌더링 중 상태 조정(React 공식 패턴, "You Might Not Need an Effect") — 브라우저 뒤로가기 등으로
  // 외부에서 URL이 바뀌면 다음 렌더에서 즉시 입력창을 동기화한다. useEffect에서 setState를 호출하면
  // 불필요한 추가 렌더가 한 번 더 생겨(react-hooks/set-state-in-effect) 이 방식을 쓴다.
  if (value !== syncedValue) {
    setSyncedValue(value);
    setDraft(value);
  }

  // value/onChange는 비교·호출용일 뿐이며, debounced가 실제로 바뀔 때만 부모에 알려야 한다 —
  // 의존성 배열에 넣으면 매 렌더마다(특히 onChange가 인라인 함수일 때) 불필요하게 재실행된다.
  useEffect(() => {
    if (debounced !== value) onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className="relative flex-1">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="제목이나 설명으로 검색"
        aria-label="할 일 검색"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}
