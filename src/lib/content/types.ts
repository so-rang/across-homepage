export type BlogItem = {
  type: "blog";
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  coverAlt: string;
  readTime: number;
  author: string;
  authorBio: string;
  category: string;
};

export type NewsItem = {
  type: "news";
  id: string;
  sourceName: string;
  sourceLogo: string;
  url: string;
  thumbnail: string;
  thumbnailAspect: "1:1" | "16:9";
  title: string;
  excerpt: string;
  date: string;
};

export type VideoItem = {
  type: "video";
  id: string;
  channelName: string;
  ownedByUs: boolean;
  youtubeId: string;
  thumbnail: string | null;
  thumbnailAspect: "16:9";
  title: string;
  excerpt: string;
  date: string;
  durationSec: number;
};

export type ContentsItem = BlogItem | NewsItem | VideoItem;
export type ContentsFilter = "all" | "blog" | "video" | "news";
