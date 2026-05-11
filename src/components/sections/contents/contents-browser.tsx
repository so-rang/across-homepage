"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { ContentCard } from "@/components/contents/content-card";
import { FilterChips } from "@/components/sections/contents/filter-chips";
import type { ContentsFilter, ContentsItem } from "@/lib/content/types";

type Props = {
  items: ContentsItem[];
  initialFilter: ContentsFilter;
};

export function ContentsBrowser({ items, initialFilter }: Props) {
  const t = useTranslations("contents");
  const [filter, setFilter] = useState<ContentsFilter>(initialFilter);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.type === filter)),
    [items, filter]
  );

  const onPick = useCallback((f: ContentsFilter) => {
    setFilter(f);
    if (typeof window === "undefined") return;
    const next = new URLSearchParams(window.location.search);
    if (f === "all") next.delete("f");
    else next.set("f", f);
    const qs = next.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    window.history.replaceState(window.history.state, "", url);
  }, []);

  return (
    <>
      <div className="mb-10">
        <FilterChips active={filter} onPick={onPick} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-subtle bg-bg-elev-1 p-10 text-center">
          <p className="text-text-muted">{t("emptyCategory")}</p>
          <button
            type="button"
            onClick={() => onPick("all")}
            className="mt-4 inline-block text-sm text-signal-blue hover:underline"
          >
            {t("viewAll")}
          </button>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li
              key={item.type === "blog" ? `b-${item.slug}` : `x-${item.id}`}
              className="h-full"
            >
              <ContentCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
