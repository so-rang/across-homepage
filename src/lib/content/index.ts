import { z } from "zod";
import type { JSONContent } from "@tiptap/react";
import generatedJson from "@/content/generated.json";
import metaJson from "@/content/meta.json";
import { getSupabaseAnonClient } from "@/lib/supabase/anon";
import type { BlogItem, ContentsItem, NewsItem, VideoItem } from "./types";

const NewsSchema = z.object({
  id: z.string(),
  type: z.literal("news"),
  sourceName: z.string(),
  sourceLogo: z.string(),
  url: z.string().url(),
  thumbnail: z.string(),
  thumbnailAspect: z.union([z.literal("1:1"), z.literal("16:9")]),
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
});

const VideoSchema = z.object({
  id: z.string(),
  type: z.literal("video"),
  channelName: z.string(),
  ownedByUs: z.boolean(),
  youtubeId: z.string(),
  thumbnail: z.string().nullable(),
  thumbnailAspect: z.literal("16:9"),
  title: z.string(),
  excerpt: z.string(),
  date: z.string(),
  durationSec: z.number().int().nonnegative(),
});

const MetaSchema = z.object({
  items: z.array(z.union([NewsSchema, VideoSchema])),
});

const GeneratedSchema = z.object({
  fetchedAt: z.string(),
  items: z.array(z.union([NewsSchema, VideoSchema])),
});

export type BlogWithSource = BlogItem & { content: JSONContent };

type DbPostRow = {
  slug: string;
  title: string;
  excerpt: string | null;
  content: JSONContent;
  cover_image: string | null;
  cover_alt: string | null;
  category: string | null;
  read_time: number | null;
  author_name: string | null;
  author_bio: string | null;
  published_at: string | null;
};

function mapPostRow(row: DbPostRow): BlogWithSource {
  return {
    type: "blog",
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    date: (row.published_at ?? new Date().toISOString()).slice(0, 10),
    author: row.author_name ?? "",
    authorBio: row.author_bio ?? "",
    coverImage: row.cover_image ?? "",
    coverAlt: row.cover_alt ?? "",
    readTime: row.read_time ?? 0,
    category: row.category ?? "",
    content: row.content ?? { type: "doc", content: [] },
  };
}

const BLOG_SELECT =
  "slug,title,excerpt,content,cover_image,cover_alt,category,read_time,author_name,author_bio,published_at";

async function fetchPublishedPosts(): Promise<BlogWithSource[]> {
  const supabase = getSupabaseAnonClient();
  const { data } = await supabase
    .from("posts")
    .select(BLOG_SELECT)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data ?? []).map((row) => mapPostRow(row as DbPostRow));
}

export async function getAllContents(): Promise<ContentsItem[]> {
  const blogs: BlogItem[] = (await fetchPublishedPosts()).map((post) => {
    const { content, ...rest } = post;
    void content;
    return rest;
  });
  const meta = MetaSchema.parse(metaJson);
  const generated = GeneratedSchema.parse(generatedJson);
  const byId = new Map<string, NewsItem | VideoItem>();
  for (const item of generated.items) byId.set(item.id, item);
  for (const item of meta.items) byId.set(item.id, item);
  return [...blogs, ...byId.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getBlogPost(slug: string): Promise<BlogWithSource | null> {
  const supabase = getSupabaseAnonClient();
  const { data } = await supabase
    .from("posts")
    .select(BLOG_SELECT)
    .eq("slug", slug)
    .in("status", ["published", "private"])
    .maybeSingle();
  return data ? mapPostRow(data as DbPostRow) : null;
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const supabase = getSupabaseAnonClient();
  const { data } = await supabase
    .from("posts")
    .select("slug")
    .eq("status", "published");
  return ((data ?? []) as { slug: string }[]).map((row) => row.slug);
}

export function youtubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
