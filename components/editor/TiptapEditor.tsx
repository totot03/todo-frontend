"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import {
  BoldIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  UnderlineIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { getTiptapExtensions } from "./extensions";

interface ToolbarButtonConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
}

const TOOLBAR_GROUPS: ToolbarButtonConfig[][] = [
  [
    {
      label: "굵게",
      icon: BoldIcon,
      isActive: (e) => e.isActive("bold"),
      run: (e) => e.chain().focus().toggleBold().run(),
    },
    {
      label: "기울임",
      icon: ItalicIcon,
      isActive: (e) => e.isActive("italic"),
      run: (e) => e.chain().focus().toggleItalic().run(),
    },
    {
      label: "밑줄",
      icon: UnderlineIcon,
      isActive: (e) => e.isActive("underline"),
      run: (e) => e.chain().focus().toggleUnderline().run(),
    },
  ],
  [
    {
      label: "제목 1",
      icon: Heading1Icon,
      isActive: (e) => e.isActive("heading", { level: 1 }),
      run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      label: "제목 2",
      icon: Heading2Icon,
      isActive: (e) => e.isActive("heading", { level: 2 }),
      run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "제목 3",
      icon: Heading3Icon,
      isActive: (e) => e.isActive("heading", { level: 3 }),
      run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
    },
  ],
  [
    {
      label: "글머리 목록",
      icon: ListIcon,
      isActive: (e) => e.isActive("bulletList"),
      run: (e) => e.chain().focus().toggleBulletList().run(),
    },
    {
      label: "번호 목록",
      icon: ListOrderedIcon,
      isActive: (e) => e.isActive("orderedList"),
      run: (e) => e.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "인용",
      icon: QuoteIcon,
      isActive: (e) => e.isActive("blockquote"),
      run: (e) => e.chain().focus().toggleBlockquote().run(),
    },
  ],
];

function TiptapToolbar({ editor }: { editor: Editor }) {
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-input p-1">
      {TOOLBAR_GROUPS.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center gap-0.5">
          {groupIndex > 0 && <Separator orientation="vertical" className="mx-1 h-5" />}
          {group.map(({ label, icon: Icon, isActive, run }) => (
            <Button
              key={label}
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={label}
              aria-pressed={isActive(editor)}
              data-state={isActive(editor) ? "on" : "off"}
              className="data-[state=on]:bg-muted data-[state=on]:text-foreground"
              onClick={() => run(editor)}
            >
              <Icon className="size-3.5" />
            </Button>
          ))}
        </div>
      ))}
    </div>
  );
}

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  className?: string;
}

/**
 * 편집 가능한 리치 텍스트 에디터(FR-T04). immediatelyRender:false는 ROADMAP이 명시한
 * SSR 하이드레이션 불일치 방지책이다 — 서버에서는 아무것도 렌더링하지 않고, 클라이언트
 * 마운트 후에만 ProseMirror DOM을 만든다(RISK-2). editor가 아직 null인 첫 렌더에는
 * 최종 레이아웃과 높이가 같은 placeholder를 반환해 레이아웃 시프트를 막는다.
 */
export function TiptapEditor({ content, onChange, className }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: getTiptapExtensions(),
    content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-content min-h-[160px] px-3 py-2 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return <div className={cn("min-h-[196px] rounded-md border border-input", className)} />;
  }

  return (
    <div
      className={cn(
        "rounded-md border border-input focus-within:ring-3 focus-within:ring-ring/50",
        className,
      )}
    >
      <TiptapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
