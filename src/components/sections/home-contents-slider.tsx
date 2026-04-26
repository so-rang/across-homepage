import { getTranslations } from "next-intl/server";
import { HomeContentsCarousel } from "@/components/sections/home-contents-carousel";
import { getAllContents } from "@/lib/content";

export async function HomeContentsSlider() {
  const t = await getTranslations("home.contents");
  const items = (await getAllContents()).slice(0, 8);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-subtle bg-bg-elev-1 p-8 text-center">
        <p className="text-text-muted">{t("empty")}</p>
      </div>
    );
  }

  return <HomeContentsCarousel items={items} />;
}
