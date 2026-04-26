import { ContentCard } from "@/components/contents/content-card";
import { getAllContents } from "@/lib/content";

/**
 * Shows the three most recent Contents items (blog/news/video mix) on the
 * main page so visitors don't have to open `/contents` to see what's new.
 * Server component: reads from the same `getAllContents()` source as the
 * full listing page.
 */
export function HomeContentsPreview() {
  const items = getAllContents().slice(0, 3);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border-subtle bg-bg-elev-1 p-8 text-center">
        <p className="text-text-muted">곧 첫 기록을 올릴게요.</p>
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
