import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/brand/page-header";
import { ZoomOutGesture } from "@/components/nav/zoom-out-gesture";
import { ContentsBrowser } from "@/components/sections/contents/contents-browser";
import { getAllContents } from "@/lib/content";
import type { ContentsFilter } from "@/lib/content/types";

export const revalidate = 300;

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
  const initialFilter = parseFilter(sp.f);
  const all = await getAllContents();

  return (
    <>
      <ZoomOutGesture backHref="/" />
      <PageHeader />
      <main className="mx-auto max-w-[1200px] px-6 pb-32 pt-20 sm:px-10">
        <header className="mb-10">
          <h1 className="mb-6 text-[40px] font-medium leading-[1.25] tracking-[-0.01em] sm:text-[56px]">
            Contents
          </h1>
        </header>
        <ContentsBrowser items={all} initialFilter={initialFilter} />
      </main>
    </>
  );
}
