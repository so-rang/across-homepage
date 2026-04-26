import { getTranslations } from "next-intl/server";
import { ContentCard } from "@/components/contents/content-card";
import { getAllContents } from "@/lib/content";

export async function HomeContentsPreview() {
  const t = await getTranslations("home.contents");
  const items = (await getAllContents()).slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-subtle bg-bg-elev-1 p-8 text-center">
        <p className="text-text-muted">{t("empty")}</p>
      </div>
    );
  }

  return (
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
  );
}
