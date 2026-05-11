"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ContentsFilter } from "@/lib/content/types";

const FILTER_IDS: ContentsFilter[] = ["all", "video", "news", "blog"];

type Props = {
  active: ContentsFilter;
  onPick: (f: ContentsFilter) => void;
};

export function FilterChips({ active, onPick }: Props) {
  const t = useTranslations("contents.filters");

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
