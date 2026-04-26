"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { LayoutGrid, List as ListIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { deletePostsAction } from "@/features/admin/actions/posts";
import type { PostStatus } from "@/features/admin/types/post";

export type AdminPostListItem = {
  id: string;
  slug: string;
  title: string;
  status: PostStatus;
  cover_image: string | null;
  published_at: string | null;
  updated_at: string;
};

type View = "gallery" | "list";

const STATUS_LABEL: Record<PostStatus, string> = {
  draft: "임시저장",
  private: "비공개",
  published: "공개",
};

const STATUS_BADGE: Record<PostStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  private: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  published: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

export function PostsView({ posts }: { posts: AdminPostListItem[] }) {
  const [view, setView] = useState<View>("gallery");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  const allSelected = posts.length > 0 && selected.size === posts.length;
  const partiallySelected = selected.size > 0 && !allSelected;

  const allIds = useMemo(() => posts.map((p) => p.id), [posts]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(allIds));
  };

  const handleDelete = () => {
    if (selected.size === 0) return;
    if (!confirm(`${selected.size}개 글을 삭제할까요? 되돌릴 수 없습니다.`))
      return;
    startTransition(async () => {
      try {
        await deletePostsAction(Array.from(selected));
        setSelected(new Set());
        toast.success("삭제 완료");
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={allSelected}
            indeterminate={partiallySelected}
            onCheckedChange={toggleAll}
            aria-label="전체 선택"
          />
          <span className="text-sm text-muted-foreground">
            {selected.size > 0
              ? `${selected.size}개 선택됨`
              : `총 ${posts.length}개`}
          </span>
          {selected.size > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleDelete}
              disabled={pending}
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" aria-hidden />
              {pending ? "삭제 중…" : "선택 삭제"}
            </Button>
          ) : null}
        </div>

        <div className="inline-flex items-center rounded-md border border-border bg-card p-0.5">
          <ViewToggle
            active={view === "gallery"}
            onClick={() => setView("gallery")}
            label="갤러리"
            Icon={LayoutGrid}
          />
          <ViewToggle
            active={view === "list"}
            onClick={() => setView("list")}
            label="리스트"
            Icon={ListIcon}
          />
        </div>
      </div>

      {view === "gallery" ? (
        <GalleryView
          posts={posts}
          selected={selected}
          onToggle={toggle}
        />
      ) : (
        <ListView posts={posts} selected={selected} onToggle={toggle} />
      )}
    </div>
  );
}

function ViewToggle({
  active,
  onClick,
  label,
  Icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  Icon: typeof LayoutGrid;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs transition",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </button>
  );
}

function GalleryView({
  posts,
  selected,
  onToggle,
}: {
  posts: AdminPostListItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => {
        const isSelected = selected.has(p.id);
        return (
          <div
            key={p.id}
            className={cn(
              "group relative overflow-hidden rounded-xl border bg-card transition",
              isSelected ? "border-foreground" : "border-border",
            )}
          >
            <Link
              href={`/admin/posts/${p.id}`}
              className="block"
              prefetch={false}
            >
              <div className="relative aspect-video bg-muted">
                {p.cover_image ? (
                  <NextImage
                    src={p.cover_image}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    표지 없음
                  </div>
                )}
              </div>
            </Link>
            <div
              className="absolute left-2 top-2 z-10 rounded-md bg-background/80 p-1.5 backdrop-blur"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggle(p.id)}
                aria-label={`${p.title} 선택`}
              />
            </div>
            <div className="space-y-1.5 p-3">
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs",
                  STATUS_BADGE[p.status],
                )}
              >
                {STATUS_LABEL[p.status]}
              </span>
              <Link
                href={`/admin/posts/${p.id}`}
                className="block font-medium leading-snug hover:underline"
                prefetch={false}
              >
                {p.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {p.published_at
                  ? `발행 ${formatDate(p.published_at)}`
                  : `수정 ${formatDate(p.updated_at)}`}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ListView({
  posts,
  selected,
  onToggle,
}: {
  posts: AdminPostListItem[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="w-10 px-4 py-3" />
            <th className="px-4 py-3 font-medium">제목</th>
            <th className="px-4 py-3 font-medium">상태</th>
            <th className="px-4 py-3 font-medium">발행일</th>
            <th className="px-4 py-3 font-medium">수정일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr
              key={p.id}
              className="border-t border-border transition-colors hover:bg-muted/30"
            >
              <td className="px-4 py-3 align-middle">
                <Checkbox
                  checked={selected.has(p.id)}
                  onCheckedChange={() => onToggle(p.id)}
                  aria-label={`${p.title} 선택`}
                />
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/admin/posts/${p.id}`}
                  className="font-medium underline-offset-2 hover:underline"
                  prefetch={false}
                >
                  {p.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs",
                    STATUS_BADGE[p.status],
                  )}
                >
                  {STATUS_LABEL[p.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {p.published_at ? formatDate(p.published_at) : "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(p.updated_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toISOString().slice(0, 10);
}
