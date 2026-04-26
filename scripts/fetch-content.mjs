// Build-time fetch: @acrosshouse YouTube uploads + Google News coverage of 어크로스.
// Output: src/content/generated.json — consumed by src/lib/content/index.ts.
//
// Runs via `pnpm prebuild`. Network failures fall back to the previous
// generated.json so a transient outage never breaks `next build`.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src", "content", "generated.json");
const NEWS_IMG_DIR = path.join(ROOT, "public", "content", "news", "og");
const NEWS_IMG_PUBLIC = "/content/news/og";

const YT_CHANNEL_ID = "UCdKZrSV0Klr9WkbnFw9eWZg"; // @acrosshouse
const YT_FEED = `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`;

// External appearances — videos not on our channel but featuring our CEO or
// otherwise owned by Across narratively. Metadata (title, channel, date,
// thumbnail) is auto-fetched via videos.list; only the id lives here.
const EXTERNAL_VIDEO_IDS = [
  "o3aBEWJPWMA",
  "6MoCJz9kvcQ",
  "pVvd-xlUfOA",
];

// Multi-query union so we catch both brand mentions and GEO/AEO trade-press coverage.
const NEWS_QUERIES = [
  '"어크로스" GEO',
  '"어크로스" AEO',
  '"어크로스" 이재홍',
  '"어크로스" GPTO',
  // CEO 이재홍 책 — 북토크·콘퍼런스 커버리지는 제목에 "어크로스"가 안 들어가기도 함.
  '"AEO·GEO 생존전략"',
  '"AEO GEO 생존전략"',
];
const NEWS_FEED = (q) =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=ko&gl=KR&ceid=KR:ko`;

// RSS upstream caps at ~15 most recent uploads — we take all the midform
// ones in that window. Shorts are filtered out via the entry's link path.
const MAX_NEWS = 8;

// Editorial exclusions on top of the shorts filter — series that shouldn't
// appear on the Contents page even if they ship as midform.
const VIDEO_TITLE_BLOCKLIST = [/AI\s*READY,?\s*ARE\s*YOU\s*READY\??/i];

// Google News's DotsSplashUi endpoint returns different payloads based on
// UA signalling; a standard desktop Chrome string is the most reliable.
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

// Auto-load .env.local so YOUTUBE_API_KEY set for Next.js is also seen here.
// Shell-level exports still take precedence.
function loadEnvLocal() {
  const envPath = path.join(ROOT, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const m = trimmed.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    if (process.env[key]) continue;
    let value = m[2];
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}
loadEnvLocal();

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

function decode(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

function pick(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? decode(m[1].trim()) : "";
}

function pickAttr(block, tag, attr) {
  const m = block.match(new RegExp(`<${tag}[^>]*\\b${attr}="([^"]+)"`));
  return m ? m[1] : "";
}

function toIsoDate(s) {
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

function truncate(s, n) {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

async function loadYouTubeViaRss() {
  const xml = await fetchText(YT_FEED);
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];
  const items = [];
  for (const e of entries) {
    const videoId = pick(e, "yt:videoId");
    if (!videoId) continue;
    // Shorts carry `/shorts/<id>` in the alternate link; midform uses `/watch?v=`.
    const link = pickAttr(e, "link", "href");
    if (/\/shorts\//.test(link)) continue;
    const title = pick(e, "title");
    if (VIDEO_TITLE_BLOCKLIST.some((re) => re.test(title))) continue;
    const published = pick(e, "published");
    const description = pick(e, "media:description");
    const thumb = pickAttr(e, "media:thumbnail", "url");
    items.push({
      id: `video-${videoId}`,
      type: "video",
      channelName: "어크로스하우스",
      ownedByUs: true,
      youtubeId: videoId,
      thumbnail: thumb || null,
      thumbnailAspect: "16:9",
      title,
      excerpt: truncate(description, 140) || title,
      date: toIsoDate(published),
      durationSec: 0,
    });
  }
  return items;
}

// ISO 8601 duration (PT#H#M#S) → seconds.
function parseIsoDuration(iso) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return 0;
  return (Number(m[1]) || 0) * 3600 + (Number(m[2]) || 0) * 60 + (Number(m[3]) || 0);
}

async function loadYouTubeViaApi(apiKey) {
  // Every channel's uploads live in a playlist with id = UU + channel id suffix.
  const uploadsId = `UU${YT_CHANNEL_ID.slice(2)}`;
  const videoIds = [];
  let pageToken = "";
  do {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("playlistId", uploadsId);
    url.searchParams.set("maxResults", "50");
    url.searchParams.set("key", apiKey);
    if (pageToken) url.searchParams.set("pageToken", pageToken);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`playlistItems: ${res.status} ${await res.text()}`);
    const data = await res.json();
    for (const it of data.items ?? []) videoIds.push(it.contentDetails.videoId);
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);

  const items = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50);
    const url = new URL("https://www.googleapis.com/youtube/v3/videos");
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("id", batch.join(","));
    url.searchParams.set("key", apiKey);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`videos: ${res.status} ${await res.text()}`);
    const data = await res.json();
    for (const v of data.items ?? []) {
      const durSec = parseIsoDuration(v.contentDetails?.duration ?? "");
      const thumbs = v.snippet?.thumbnails ?? {};
      const thumb =
        thumbs.maxres?.url ??
        thumbs.standard?.url ??
        thumbs.high?.url ??
        thumbs.medium?.url ??
        null;
      items.push({
        id: `video-${v.id}`,
        type: "video",
        channelName: v.snippet?.channelTitle || "어크로스하우스",
        ownedByUs: true,
        youtubeId: v.id,
        thumbnail: thumb,
        thumbnailAspect: "16:9",
        title: v.snippet?.title ?? "",
        excerpt: truncate(v.snippet?.description ?? "", 140) || v.snippet?.title || "",
        date: (v.snippet?.publishedAt ?? "").slice(0, 10),
        durationSec: durSec,
      });
    }
  }

  // Shorts can run up to 3 min, so a pure duration cutoff misses 61–180s shorts.
  // The only authoritative test: probe `/shorts/<id>` — YouTube returns 200 for
  // actual Shorts, 303 redirect to `/watch?v=` for midform. Only probe the
  // ambiguous window; anything over 3 min cannot be a Short.
  const ambiguous = items.filter((i) => i.durationSec > 0 && i.durationSec <= 180);
  const isShort = new Map();
  const batchSize = 5;
  for (let i = 0; i < ambiguous.length; i += batchSize) {
    const chunk = ambiguous.slice(i, i + batchSize);
    await Promise.all(
      chunk.map(async (item) => {
        try {
          const r = await fetch(`https://www.youtube.com/shorts/${item.youtubeId}`, {
            method: "HEAD",
            headers: { "User-Agent": UA },
            redirect: "manual",
          });
          isShort.set(item.youtubeId, r.status === 200);
        } catch {
          // If probing fails, fall back to duration: ≤60s assumed short.
          isShort.set(item.youtubeId, item.durationSec <= 60);
        }
      })
    );
  }
  const midform = items.filter(
    (i) =>
      !isShort.get(i.youtubeId) &&
      !VIDEO_TITLE_BLOCKLIST.some((re) => re.test(i.title))
  );

  const externals = await fetchExternalVideos(apiKey);
  const merged = [...midform, ...externals];
  merged.sort((a, b) => (a.date < b.date ? 1 : -1));
  return merged;
}

async function fetchExternalVideos(apiKey) {
  if (EXTERNAL_VIDEO_IDS.length === 0) return [];
  const url = new URL("https://www.googleapis.com/youtube/v3/videos");
  url.searchParams.set("part", "snippet,contentDetails");
  url.searchParams.set("id", EXTERNAL_VIDEO_IDS.join(","));
  url.searchParams.set("key", apiKey);
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`[fetch-content] external videos API failed: ${res.status}`);
    return [];
  }
  const data = await res.json();
  const items = [];
  for (const v of data.items ?? []) {
    const thumbs = v.snippet?.thumbnails ?? {};
    const thumb =
      thumbs.maxres?.url ??
      thumbs.standard?.url ??
      thumbs.high?.url ??
      thumbs.medium?.url ??
      null;
    items.push({
      id: `video-${v.id}`,
      type: "video",
      channelName: v.snippet?.channelTitle || "외부 채널",
      ownedByUs: false,
      youtubeId: v.id,
      thumbnail: thumb,
      thumbnailAspect: "16:9",
      title: v.snippet?.title ?? "",
      excerpt:
        truncate(v.snippet?.description ?? "", 140) || v.snippet?.title || "",
      date: (v.snippet?.publishedAt ?? "").slice(0, 10),
      durationSec: parseIsoDuration(v.contentDetails?.duration ?? ""),
    });
  }
  return items;
}

async function loadYouTube() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    try {
      const items = await loadYouTubeViaApi(apiKey);
      console.log(`[fetch-content] YouTube API: ${items.length} midform videos`);
      return items;
    } catch (err) {
      console.warn(
        `[fetch-content] YouTube API failed, falling back to RSS:`,
        err.message
      );
    }
  }
  return loadYouTubeViaRss();
}

function sourceFromTitleSuffix(title) {
  // Google News encodes "<headline> - <publisher>" (sometimes repeated).
  const parts = title.split(" - ").map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return { cleanTitle: title, source: "" };
  const source = parts[parts.length - 1];
  const clean = parts.slice(0, -1).join(" - ");
  // Collapse "headline - 매체 - 매체" duplication.
  const dedup = clean.endsWith(` - ${source}`)
    ? clean.slice(0, -(source.length + 3))
    : clean;
  return { cleanTitle: dedup, source };
}

function extractGoogleNewsId(link) {
  const m = link.match(/\/rss\/articles\/([^?]+)/) || link.match(/\/articles\/([^?]+)/);
  return m ? m[1] : null;
}

// Google News interstitial links are JS-resolved. This mirrors the RPC the
// client fires via _/DotsSplashUi/data/batchexecute to get the publisher URL.
async function decodeGoogleNewsUrl(id) {
  const page = await fetch(`https://news.google.com/articles/${id}`, {
    headers: { "User-Agent": UA },
  });
  if (!page.ok) return null;
  const html = await page.text();
  const ts = html.match(/data-n-a-ts="(\d+)"/)?.[1];
  const sig = html.match(/data-n-a-sg="([^"]+)"/)?.[1];
  if (!ts || !sig) return null;

  const reqPayload = JSON.stringify([
    "garturlreq",
    [
      ["X", "X", ["X", "X"], null, null, 1, 1, "US:en", null, 1, null, null, null, null, null, 0, 1],
      "X",
      "X",
      1,
      [1, 1, 1],
      1,
      1,
      null,
      0,
      0,
      null,
      0,
    ],
    id,
    Number(ts),
    sig,
  ]);
  const body = new URLSearchParams({
    "f.req": JSON.stringify([[["Fbv4je", reqPayload, null, "generic"]]]),
  });
  const res = await fetch(
    `https://news.google.com/_/DotsSplashUi/data/batchexecute?rpcids=Fbv4je&source-path=/articles/${id}&hl=en-US&gl=US`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": UA,
      },
      body,
    }
  );
  if (!res.ok) return null;
  const text = await res.text();
  // Response: ")]}'" prefix, then JSON containing a stringified inner array
  // whose elements use escaped quotes (\"garturlres\",\"https://...\").
  const inner = text.match(/\\"garturlres\\",\\"(https?:\/\/[^\\"]+)\\"/);
  return inner ? inner[1].replace(/\\u003d/g, "=").replace(/\\u0026/g, "&") : null;
}

async function fetchOgImage(articleUrl) {
  try {
    const res = await fetch(articleUrl, {
      headers: { "User-Agent": UA },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = await res.text();
    // Try Open Graph, then Twitter, then first <img> srcset.
    const og = html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+name=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
    if (og) return new URL(og[1], articleUrl).toString();
    const tw = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    if (tw) return new URL(tw[1], articleUrl).toString();
    return null;
  } catch {
    return null;
  }
}

async function downloadImage(imgUrl, destPath) {
  try {
    const res = await fetch(imgUrl, { headers: { "User-Agent": UA } });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 512) return false; // probably a tracking pixel
    fs.writeFileSync(destPath, buf);
    return true;
  } catch {
    return false;
  }
}

function imgExtensionFromUrl(u) {
  const ext = path.extname(new URL(u).pathname).toLowerCase().slice(1, 5);
  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) return ext === "jpeg" ? "jpg" : ext;
  return "jpg";
}

// Minimal header parsers for the three formats Korean news sites actually use
// for OG images. Lets us flag wide-vs-square without an image-processing dep.
function readImageSize(buf) {
  // PNG — IHDR is fixed offset.
  if (buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  // JPEG — scan segments for an SOF marker.
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) return null;
      const marker = buf[i + 1];
      // SOF0-SOF15 except DHT/JPG/DAC.
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
      }
      const segLen = buf.readUInt16BE(i + 2);
      i += 2 + segLen;
    }
    return null;
  }
  // WebP — RIFF container. VP8X/VP8/VP8L each encode dimensions differently.
  if (
    buf.toString("ascii", 0, 4) === "RIFF" &&
    buf.toString("ascii", 8, 12) === "WEBP"
  ) {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") {
      return {
        w: (buf.readUIntLE(24, 3) & 0xffffff) + 1,
        h: (buf.readUIntLE(27, 3) & 0xffffff) + 1,
      };
    }
    if (chunk === "VP8 ") {
      return {
        w: buf.readUInt16LE(26) & 0x3fff,
        h: buf.readUInt16LE(28) & 0x3fff,
      };
    }
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
  }
  return null;
}

function classifyAspect(size) {
  if (!size || !size.w || !size.h) return "1:1"; // safe default: contain + blur
  const ratio = size.w / size.h;
  // 16:9 = 1.778. Accept ≥1.6 as wide enough to render cover without cropping loss.
  return ratio >= 1.6 ? "16:9" : "1:1";
}

async function enrichNewsItem(item, cache) {
  // Step 1: fast path — reuse a prior enrichment when the image still exists
  // on disk. Skips expensive RPC/HTML fetches on every build.
  const cached = cache.get(item.id);
  const cachedThumb = cached?.thumbnail;
  if (
    cachedThumb &&
    cachedThumb.startsWith(NEWS_IMG_PUBLIC) &&
    fs.existsSync(path.join(ROOT, "public", cachedThumb))
  ) {
    item.url = cached.url ?? item.url;
    item.thumbnail = cachedThumb;
    try {
      // Re-probe so an aspect classification change (e.g. tightened 16:9
      // threshold) takes effect on next build without re-downloading.
      const size = readImageSize(fs.readFileSync(path.join(ROOT, "public", cachedThumb)));
      item.thumbnailAspect = classifyAspect(size);
    } catch {
      item.thumbnailAspect = cached.thumbnailAspect ?? "1:1";
    }
    return item;
  }

  const gnewsId = extractGoogleNewsId(item.url);
  if (!gnewsId) return item;
  const realUrl = await decodeGoogleNewsUrl(gnewsId);
  if (!realUrl) {
    // Decode failed (rate limit, etc.) — preserve any real URL we had before.
    if (cached?.url && !extractGoogleNewsId(cached.url)) item.url = cached.url;
    return item;
  }
  item.url = realUrl;
  const og = await fetchOgImage(realUrl);
  if (!og) return item;
  const ext = imgExtensionFromUrl(og);
  const filename = `${item.id}.${ext}`;
  fs.mkdirSync(NEWS_IMG_DIR, { recursive: true });
  const dest = path.join(NEWS_IMG_DIR, filename);
  const ok = await downloadImage(og, dest);
  if (ok) {
    item.thumbnail = `${NEWS_IMG_PUBLIC}/${filename}`;
    try {
      const size = readImageSize(fs.readFileSync(dest));
      item.thumbnailAspect = classifyAspect(size);
    } catch {
      item.thumbnailAspect = "1:1";
    }
  }
  return item;
}

async function loadNewsFromQuery(q) {
  const xml = await fetchText(NEWS_FEED(q));
  const entries = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  const items = [];
  for (const e of entries) {
    const rawTitle = pick(e, "title");
    const link = pick(e, "link");
    const pub = pick(e, "pubDate");
    const sourceTag = pick(e, "source") || sourceFromTitleSuffix(rawTitle).source;
    const { cleanTitle } = sourceFromTitleSuffix(rawTitle);
    if (!cleanTitle || !link) continue;
    items.push({
      id: `press-${toIsoDate(pub)}-${hash(link).slice(0, 8)}`,
      type: "news",
      sourceName: sourceTag || "Google News",
      sourceLogo: "",
      url: link,
      thumbnail: "/content/news/placeholder.svg",
      thumbnailAspect: "1:1",
      title: cleanTitle,
      excerpt: `${sourceTag || "뉴스"} 보도 · ${toIsoDate(pub)}`,
      date: toIsoDate(pub),
    });
  }
  return items;
}

function hash(s) {
  // djb2 — stable per-link id without a crypto dep.
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

async function loadNews() {
  const all = [];
  for (const q of NEWS_QUERIES) {
    try {
      const batch = await loadNewsFromQuery(q);
      all.push(...batch);
    } catch (err) {
      console.warn(`[fetch-content] news query failed (${q}):`, err.message);
    }
  }
  // Only keep headlines that actually name the brand or a product —
  // upstream queries sometimes surface accelerator/program coverage that
  // only mentions us in the body.
  const NAMED = /어크로스|Across|GPTO|GenRank|NAEO|이재홍|AEO[\s·]?GEO\s*생존전략/;
  const named = all.filter((i) => NAMED.test(i.title));
  // Syndicators republish primary articles verbatim; prefer the original
  // publisher so 머니투데이 기사가 네이트로 둔갑하지 않도록.
  const SYNDICATORS = /^(네이트|다음|Daum|Zum|네이버 뉴스)$/i;
  const byTitle = new Map();
  for (const item of named) {
    const key = item.title.replace(/\s+/g, "").toLowerCase();
    const existing = byTitle.get(key);
    if (!existing) {
      byTitle.set(key, item);
      continue;
    }
    const existingIsSyndicator = SYNDICATORS.test(existing.sourceName);
    const incomingIsSyndicator = SYNDICATORS.test(item.sourceName);
    if (existingIsSyndicator && !incomingIsSyndicator) byTitle.set(key, item);
  }
  const deduped = [...byTitle.values()];
  deduped.sort((a, b) => (a.date < b.date ? 1 : -1));
  const top = deduped.slice(0, MAX_NEWS);
  const cache = loadCache();
  // Sequential + small delay — Google News rate-limits aggressive concurrency
  // on the DotsSplashUi RPC; a brief pause avoids intermittent empty decodes.
  for (const item of top) {
    try {
      await enrichNewsItem(item, cache);
    } catch (err) {
      console.warn(`[fetch-content] enrich failed for ${item.id}:`, err.message);
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  return top;
}

function loadCache() {
  const map = new Map();
  if (!fs.existsSync(OUT)) return map;
  try {
    const prev = JSON.parse(fs.readFileSync(OUT, "utf8"));
    for (const item of prev.items ?? []) {
      if (item.type === "news") map.set(item.id, item);
    }
  } catch {
    // ignore — cache is best-effort
  }
  return map;
}

function pruneStaleOgImages(news) {
  if (!fs.existsSync(NEWS_IMG_DIR)) return;
  // Keep any file whose basename (minus extension) matches a current news id.
  // A transient enrich failure shouldn't wipe a good image we can recover next
  // build — only delete files for articles that no longer appear in the feed.
  const keepIds = new Set(news.map((n) => n.id));
  for (const f of fs.readdirSync(NEWS_IMG_DIR)) {
    const stem = f.replace(/\.[^.]+$/, "");
    if (!keepIds.has(stem)) fs.unlinkSync(path.join(NEWS_IMG_DIR, f));
  }
}

// Skip the fetch entirely when generated.json is still fresh. Saves YouTube
// quota during hot-reload cycles. Override with FORCE=1 or --force.
const CACHE_TTL_HOURS = Number(process.env.CONTENT_CACHE_TTL_HOURS ?? 48);
function isCacheFresh() {
  if (process.env.FORCE === "1" || process.argv.includes("--force")) return false;
  if (!fs.existsSync(OUT)) return false;
  try {
    const prev = JSON.parse(fs.readFileSync(OUT, "utf8"));
    if (!prev.fetchedAt) return false;
    const ageMs = Date.now() - new Date(prev.fetchedAt).getTime();
    return ageMs < CACHE_TTL_HOURS * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

async function main() {
  if (isCacheFresh()) {
    const prev = JSON.parse(fs.readFileSync(OUT, "utf8"));
    const ageHrs = ((Date.now() - new Date(prev.fetchedAt).getTime()) / 3.6e6).toFixed(1);
    console.log(
      `[fetch-content] cache fresh (${ageHrs}h < ${CACHE_TTL_HOURS}h TTL) — skipped. Force with FORCE=1 or --force.`
    );
    return;
  }
  try {
    const [videos, news] = await Promise.all([loadYouTube(), loadNews()]);
    pruneStaleOgImages(news);
    const payload = {
      fetchedAt: new Date().toISOString(),
      items: [...videos, ...news],
    };
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    const withImg = news.filter((n) => n.thumbnail.startsWith(NEWS_IMG_PUBLIC)).length;
    console.log(
      `[fetch-content] wrote ${payload.items.length} items (${videos.length} video, ${news.length} news, ${withImg} news images) -> ${path.relative(ROOT, OUT)}`
    );
  } catch (err) {
    console.error("[fetch-content] fatal:", err.message);
    if (fs.existsSync(OUT)) {
      console.warn("[fetch-content] keeping previous generated.json");
      process.exit(0);
    }
    // First run with no network — emit empty file so build still works.
    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    fs.writeFileSync(
      OUT,
      `${JSON.stringify({ fetchedAt: new Date().toISOString(), items: [] }, null, 2)}\n`,
      "utf8"
    );
    console.warn("[fetch-content] wrote empty generated.json as fallback");
  }
}

main();
