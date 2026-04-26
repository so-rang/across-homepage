"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { ContentsFilter } from "@/lib/content/types";

const FILTER_IDS: ContentsFilter[] = ["all", "video", "news", "blog"];

export function FilterChips({ active }: { active: ContentsFilter }) {
  const t = useTranslations("contents.filters");
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
      aria-label={t("ariaLabel")}
      className="flex gap-2 overflow-x-auto [scroll-snap-type:x_mandatory]"
    >
      {FILTER_IDS.map((id) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={active === id}
          onClick={() => onPick(id)}
          className={cn(
            "shrink-0 snap-start rounded-full border px-4 py-2 text-sm transition-colors",
            active === id
              ? "border-text bg-text text-bg"
              : "border-border-subtle bg-bg-elev-2 text-text-muted hover:text-text"
          )}
        >
          {t(id)}
        </button>
      ))}
    </div>
  );
}
