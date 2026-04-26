import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import generatedJson from "@/content/generated.json";
import metaJson from "@/content/meta.json";
import type { BlogItem, ContentsItem, NewsItem, VideoItem } from "./types";

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

const BlogFrontmatterSchema = z.object({
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(80),
  excerpt: z.string().min(1).max(200),
  date: z.preprocess(
    (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
    z.string()
  ),
  author: z.string(),
  authorBio: z.string(),
  coverImage: z.string(),
  coverAlt: z.string(),
  readTime: z.number().int().positive(),
  category: z.string(),
  published: z.boolean(),
});

const NewsSchema = z.object({
  id: z.string(),
  type: z.literal("news"),
  sourceName: z.string(),
  // Generated items don't ship a local logo asset — allow empty.
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

export type BlogWithSource = BlogItem & { body: string };

function readBlogPosts(): BlogWithSource[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  const posts: BlogWithSource[] = [];
  for (const file of files) {
    const full = path.join(POSTS_DIR, file);
    const raw = fs.readFileSync(full, "utf8");
    const parsed = matter(raw);
    const fm = BlogFrontmatterSchema.parse(parsed.data);
    if (!fm.published) continue;
    posts.push({
      type: "blog",
      slug: fm.slug,
      title: fm.title,
      excerpt: fm.excerpt,
      date: fm.date,
      author: fm.author,
      authorBio: fm.authorBio,
      coverImage: fm.coverImage,
      coverAlt: fm.coverAlt,
      readTime: fm.readTime,
      category: fm.category,
      body: parsed.content,
    });
  }
  return posts;
}

export function getAllContents(): ContentsItem[] {
  const blogs: BlogItem[] = readBlogPosts().map((post) => {
    const { body, ...rest } = post;
    void body;
    return rest;
  });
  const meta = MetaSchema.parse(metaJson);
  const generated = GeneratedSchema.parse(generatedJson);
  // Curated meta.json wins on id collision so editors can override auto data.
  const byId = new Map<string, NewsItem | VideoItem>();
  for (const item of generated.items) byId.set(item.id, item);
  for (const item of meta.items) byId.set(item.id, item);
  return [...blogs, ...byId.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getBlogPost(slug: string): BlogWithSource | null {
  const posts = readBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export function getAllBlogSlugs(): string[] {
  return readBlogPosts().map((p) => p.slug);
}

export function youtubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
