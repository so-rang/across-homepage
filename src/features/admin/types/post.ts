import type { JSONContent } from "@tiptap/react";

export type PostStatus = "draft" | "private" | "published";

export interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: JSONContent;
  cover_image: string | null;
  cover_alt: string | null;
  category: string | null;
  read_time: number | null;
  status: PostStatus;
  author_id: string | null;
  author_name: string | null;
  author_bio: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileRow {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "admin" | "staff" | null;
  created_at: string;
  updated_at: string;
}
