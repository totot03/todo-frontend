import StarterKit from "@tiptap/starter-kit";

/**
 * TiptapEditor(편집 가능)와 TiptapViewer(읽기 전용)가 반드시 동일한 확장 목록을
 * 공유해야 한다 — 그래야 편집 화면에서 만든 서식이 상세 화면에서 다르게 렌더링되는
 * 일이 없다. Tiptap v3의 StarterKit은 Bold·Italic·Underline·BulletList·OrderedList·
 * Blockquote를 전부 기본 포함하므로(v3부터 Underline이 흡수됨) 별도 확장 패키지가
 * 필요 없다 — PRD FR-T04(굵게·기울임·밑줄·목록·제목·인용)를 이 하나로 충족한다.
 */
export function getTiptapExtensions() {
  return [StarterKit.configure({ heading: { levels: [1, 2, 3] } })];
}
