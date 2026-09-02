"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { cn } from "@/lib/utils";
import { getTiptapExtensions } from "./extensions";

interface TiptapViewerProps {
  html: string;
  className?: string;
}

/**
 * 저장된 서식 있는 설명을 읽기 전용으로 렌더링한다(/todos/[id] 상세 화면).
 * dangerouslySetInnerHTML을 쓰지 않는다 — TiptapEditor와 동일한 확장 목록으로
 * useEditor(editable:false)를 사용해 편집기·상세 뷰가 완전히 같은 DOM/스타일을
 * 공유하고, ProseMirror가 HTML을 StarterKit이 허용한 스키마로만 파싱하므로
 * 서버의 jsoup sanitize(1차 방어) 위에 한 겹(2차)이 더 생긴다.
 */
export function TiptapViewer({ html, className }: TiptapViewerProps) {
  const editor = useEditor({
    extensions: getTiptapExtensions(),
    content: html,
    editable: false,
    immediatelyRender: false,
    // ProseMirror는 editable:false여도 contenteditable 영역에 암묵적으로 role="textbox"를
    // 남긴다 — 스크린리더에 "수정 가능한 입력창"으로 잘못 안내되지 않도록 명시적으로 덮어쓴다(NFR-U03).
    editorProps: {
      attributes: { role: "article", "aria-label": "할 일 설명" },
    },
  });

  if (!editor) {
    return <LoadingSpinner size="sm" label="내용을 불러오는 중" />;
  }

  return <EditorContent editor={editor} className={cn("tiptap-content text-sm", className)} />;
}
