"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ContentsFilter } from "@/lib/content/types";

const FILTERS: { id: ContentsFilter; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "video", label: "영상" },
  { id: "news", label: "뉴스" },
  { id: "blog", label: "블로그" },
];

export function FilterChips({ active }: { active: ContentsFilter }) {
  const router = useRouter();
  const sp = useSearchParams();

  const onPick = useCallback(
    (f: ContentsFilter) => {
      const next = new URLSearchParams(sp);
      if (f === "all") next.delete("f");
      else next.set("f", f);
      router.replace(`/contents${next.toString() ? `?${next}` : ""}`, {
        scroll: false,
      });
    },
    [router, sp]
  );

  return (
    <div
      role="tablist"
      aria-label="콘텐츠 필터"
      className="flex gap-2 overflow-x-auto [scroll-snap-type:x_mandatory]"
    >
      {FILTERS.map((f) => (
        <button
          key={f.id}
          type="button"
          role="tab"
          aria-selected={active === f.id}
          onClick={() => onPick(f.id)}
          className={cn(
            "shrink-0 snap-start rounded-full border px-4 py-2 text-sm transition-colors",
            active === f.id
              ? "border-text bg-text text-bg"
              : "border-border-subtle bg-bg-elev-2 text-text-muted hover:text-text"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
