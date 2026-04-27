import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PageHeader } from "@/components/brand/page-header";
import { ContentCard } from "@/components/contents/content-card";
import { ZoomOutGesture } from "@/components/nav/zoom-out-gesture";
import { FilterChips } from "@/components/sections/contents/filter-chips";
import { getAllContents } from "@/lib/content";
import type { ContentsFilter } from "@/lib/content/types";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contents.metadata");
  return {
    title: "Contents",
    description: t("description"),
  };
}

function parseFilter(raw: string | string[] | undefined): ContentsFilter {
  const v = Array.isArray(raw) ? raw[0] : raw;
  if (v === "blog" || v === "video" || v === "news") return v;
  return "all";
}

export default async function ContentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filter = parseFilter(sp.f);
  const all = await getAllContents();
  const items = filter === "all" ? all : all.filter((i) => i.type === filter);
  const t = await getTranslations("contents");

  return (
    <>
      <ZoomOutGesture backHref="/" />
      <PageHeader />
      <main className="mx-auto max-w-[1200px] px-6 pb-32 pt-20 sm:px-10">
        <header className="mb-10">
          <h1 className="mb-6 text-[40px] font-medium leading-[1.25] tracking-[-0.01em] sm:text-[56px]">
            Contents
          </h1>
          <FilterChips active={filter} />
        </header>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-subtle bg-bg-elev-1 p-10 text-center">
            <p className="text-text-muted">{t("emptyCategory")}</p>
            <Link
              href="/contents"
              className="mt-4 inline-block text-sm text-signal-blue hover:underline"
            >
              {t("viewAll")}
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li
                key={item.type === "blog" ? `b-${item.slug}` : `x-${item.id}`}
                className="h-full"
              >
                <ContentCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
