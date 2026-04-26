/**
 * Pure helper — safe for client components.
 * Default YouTube thumbnail URL (no fs access, no server-only deps).
 */
export function youtubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
