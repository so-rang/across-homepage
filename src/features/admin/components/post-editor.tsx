"use client";

import { useRef, useState } from "react";
import { useEditor, EditorContent, type Editor, type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextSelection } from "@tiptap/pm/state";
import type { EditorView } from "@tiptap/pm/view";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Code, Link as LinkIcon, Image as ImageIcon, Undo2, Redo2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPostImage } from "@/features/admin/utils/upload";

type Props = {
  initialContent?: JSONContent;
  onChange?: (json: JSONContent) => void;
};

type DialogKind = "link" | "image" | null;

export function PostEditor({ initialContent, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({
        placeholder: "본문을 작성하세요…",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener", target: "_blank" },
      }),
      Image,
    ],
    content: initialContent ?? { type: "doc", content: [{ type: "paragraph" }] },
    editorProps: {
      attributes: {
        class:
          "prose-across min-h-[420px] max-w-none px-5 py-6 focus:outline-none",
      },
      handleDrop(view, event) {
        const dt = (event as DragEvent).dataTransfer;
        if (!dt) return false;
        const files = Array.from(dt.files).filter((f) =>
          f.type.startsWith("image/"),
        );
        if (files.length === 0) return false;
        event.preventDefault();
        const coords = view.posAtCoords({
          left: (event as DragEvent).clientX,
          top: (event as DragEvent).clientY,
        });
        if (coords) {
          view.dispatch(
            view.state.tr.setSelection(
              TextSelection.create(view.state.doc, coords.pos),
            ),
          );
        }
        void insertImageFiles(view, files);
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON());
    },
    immediatelyRender: false,
  });

  const [dialog, setDialog] = useState<DialogKind>(null);
  const [linkInitial, setLinkInitial] = useState("");

  if (!editor) return null;

  const openLinkDialog = () => {
    const prev = (editor.getAttributes("link").href as string | undefined) ?? "";
    setLinkInitial(prev);
    setDialog("link");
  };

  const openImageDialog = () => {
    setDialog("image");
  };

  const applyLink = (url: string) => {
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setDialog(null);
  };

  const applyImage = (url: string) => {
    if (!url) {
      setDialog(null);
      return;
    }
    editor.chain().focus().setImage({ src: url }).run();
    setDialog(null);
  };

  return (
    <div className="rounded-xl border border-border bg-card">
      <Toolbar
        editor={editor}
        onLink={openLinkDialog}
        onImage={openImageDialog}
      />
      <EditorContent editor={editor} />

      <UrlDialog
        open={dialog === "link"}
        title="링크"
        label="URL"
        placeholder="https://example.com"
        initialValue={linkInitial}
        submitLabel="적용"
        allowEmpty
        emptyHint="비우고 적용하면 링크가 제거돼요"
        onSubmit={applyLink}
        onCancel={() => setDialog(null)}
      />
      <ImageDialog
        open={dialog === "image"}
        onSubmit={applyImage}
        onCancel={() => setDialog(null)}
      />
    </div>
  );
}

function Toolbar({
  editor,
  onLink,
  onImage,
}: {
  editor: Editor;
  onLink: () => void;
  onImage: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border px-2 py-2">
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="굵게">
        <Bold className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="기울임">
        <Italic className="h-4 w-4" />
      </ToolbarBtn>
      <Divider />
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} label="H2">
        <Heading2 className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} label="H3">
        <Heading3 className="h-4 w-4" />
      </ToolbarBtn>
      <Divider />
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} label="불릿">
        <List className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} label="번호">
        <ListOrdered className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} label="인용">
        <Quote className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} label="코드">
        <Code className="h-4 w-4" />
      </ToolbarBtn>
      <Divider />
      <ToolbarBtn onClick={onLink} active={editor.isActive("link")} label="링크">
        <LinkIcon className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={onImage} label="이미지">
        <ImageIcon className="h-4 w-4" />
      </ToolbarBtn>
      <Divider />
      <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} label="실행 취소">
        <Undo2 className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} label="다시 실행">
        <Redo2 className="h-4 w-4" />
      </ToolbarBtn>
    </div>
  );
}

function ImageDialog({
  open,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  onSubmit: (url: string) => void;
  onCancel: () => void;
}) {
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setTab("upload");
    setUrl("");
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const result = await uploadPostImage(file);
      onSubmit(result.url);
      reset();
    } catch (e) {
      toast.error((e as Error).message);
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          reset();
        } else {
          onCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이미지 삽입</DialogTitle>
        </DialogHeader>

        <div className="flex gap-1 rounded-md bg-muted p-1 text-sm">
          <button
            type="button"
            className={
              tab === "upload"
                ? "flex-1 rounded bg-background px-3 py-1.5 font-medium shadow-sm"
                : "flex-1 rounded px-3 py-1.5 text-muted-foreground"
            }
            onClick={() => setTab("upload")}
          >
            파일 업로드
          </button>
          <button
            type="button"
            className={
              tab === "url"
                ? "flex-1 rounded bg-background px-3 py-1.5 font-medium shadow-sm"
                : "flex-1 rounded px-3 py-1.5 text-muted-foreground"
            }
            onClick={() => setTab("url")}
          >
            URL
          </button>
        </div>

        {tab === "upload" ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-8 text-sm text-muted-foreground transition hover:bg-muted disabled:opacity-50"
            >
              <Upload className="h-5 w-5" aria-hidden />
              <span>{uploading ? "업로드 중…" : "이미지 선택"}</span>
              <span className="text-xs">PNG·JPG·WEBP·GIF·SVG · 최대 5MB</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onCancel}>
                취소
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const trimmed = url.trim();
              if (!trimmed) return;
              onSubmit(trimmed);
              reset();
            }}
            className="space-y-3"
          >
            <div>
              <Label htmlFor="image-url-input" className="mb-1.5 block text-sm">
                이미지 URL
              </Label>
              <Input
                id="image-url-input"
                autoFocus
                type="url"
                inputMode="url"
                placeholder="https://… 또는 /content/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onCancel}>
                취소
              </Button>
              <Button type="submit">삽입</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function UrlDialog({
  open,
  title,
  label,
  placeholder,
  initialValue,
  submitLabel,
  allowEmpty = false,
  emptyHint,
  onSubmit,
  onCancel,
}: {
  open: boolean;
  title: string;
  label: string;
  placeholder?: string;
  initialValue: string;
  submitLabel: string;
  allowEmpty?: boolean;
  emptyHint?: string;
  onSubmit: (url: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setValue(initialValue);
        } else {
          onCancel();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = value.trim();
            if (!allowEmpty && !trimmed) return;
            onSubmit(trimmed);
          }}
          className="space-y-3"
        >
          <div>
            <Label htmlFor="url-dialog-input" className="mb-1.5 block text-sm">
              {label}
            </Label>
            <Input
              id="url-dialog-input"
              autoFocus
              type="url"
              inputMode="url"
              placeholder={placeholder}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {emptyHint ? (
              <p className="mt-1 text-xs text-muted-foreground">{emptyHint}</p>
            ) : null}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ToolbarBtn({
  onClick,
  active,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="h-8 w-8"
    >
      {children}
    </Button>
  );
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-border" aria-hidden />;
}

async function insertImageFiles(view: EditorView, files: File[]): Promise<void> {
  const toastId = toast.loading(
    files.length === 1
      ? "이미지 업로드 중…"
      : `이미지 ${files.length}장 업로드 중…`,
  );
  let okCount = 0;
  for (const file of files) {
    try {
      const result = await uploadPostImage(file);
      const imageType = view.state.schema.nodes.image;
      if (!imageType) {
        toast.error("에디터에서 이미지 노드를 찾지 못했어요.");
        continue;
      }
      const node = imageType.create({ src: result.url });
      view.dispatch(view.state.tr.replaceSelectionWith(node));
      okCount += 1;
    } catch (e) {
      toast.error((e as Error).message);
    }
  }
  if (okCount === files.length) {
    toast.success(
      files.length === 1
        ? "이미지 업로드 완료"
        : `이미지 ${okCount}장 업로드 완료`,
      { id: toastId },
    );
  } else if (okCount === 0) {
    toast.dismiss(toastId);
  } else {
    toast.success(`${okCount}/${files.length}장 업로드 완료`, { id: toastId });
  }
}
