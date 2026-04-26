import { HomeContentsCarousel } from "@/components/sections/home-contents-carousel";
import { getAllContents } from "@/lib/content";

/**
 * Server wrapper around the client carousel — reads the content index at
 * build/request time and forwards the items to the interactive component.
 * Graceful fallback when no items exist yet.
 */
export function HomeContentsSlider() {
  const items = getAllContents().slice(0, 8);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-subtle bg-bg-elev-1 p-8 text-center">
        <p className="text-text-muted">곧 첫 기록을 올릴게요.</p>
      </div>
    );
  }

  return <HomeContentsCarousel items={items} />;
}
