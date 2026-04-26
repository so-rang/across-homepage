"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { VideoItem } from "@/lib/content/types";

type Props = {
  video: VideoItem;
  children: React.ReactNode;
  triggerClassName?: string;
};

/**
 * Video modal (DESIGN.md §8.4).
 * - Embeds youtube-nocookie with `playsinline` + muted autoplay.
 * - Falls back to opening youtube.com in a new tab if embed blocked.
 * - CTA label switches on `ownedByUs`.
 */
export function VideoModal({ video, children, triggerClassName }: Props) {
  const [open, setOpen] = useState(false);
  const [embedFailed, setEmbedFailed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      if (iframeRef.current && !iframeRef.current.dataset.loaded) {
        setEmbedFailed(true);
        window.open(
          `https://www.youtube.com/watch?v=${video.youtubeId}`,
          "_blank",
          "noopener,noreferrer"
        );
      }
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [open, video.youtubeId]);

  const handleOpenChange = (next: boolean) => {
    if (next) setEmbedFailed(false);
    setOpen(next);
  };

  const ctaHref = video.ownedByUs
    ? "https://www.youtube.com/@acrosshouse?sub_confirmation=1"
    : `https://www.youtube.com/watch?v=${video.youtubeId}`;
  const ctaLabel = video.ownedByUs
    ? "어크로스하우스 구독"
    : "원본 채널에서 보기";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        className={cn(
          "block h-full w-full text-left focus-visible:outline-none",
          triggerClassName
        )}
      >
        {children}
      </DialogTrigger>
      <DialogContent className="w-[min(94vw,1200px)] max-w-none overflow-hidden border-border-subtle bg-bg/95 p-0 backdrop-blur-[12px] sm:max-w-none">
        <DialogHeader className="sr-only">
          <DialogTitle>{video.title}</DialogTitle>
          <DialogDescription>{video.excerpt}</DialogDescription>
        </DialogHeader>
        <div className="relative aspect-video w-full bg-black">
          {!embedFailed ? (
            <iframe
              ref={iframeRef}
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?playsinline=1&autoplay=1&mute=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              onLoad={(e) => {
                (e.currentTarget as HTMLIFrameElement).dataset.loaded = "1";
              }}
              aria-live="polite"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center p-6 text-center text-sm text-text-muted">
              이 영상은 YouTube에서 열립니다.
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-medium tracking-[0.01em]">{video.title}</p>
            <p className="mt-1 text-sm text-text-muted">
              {video.channelName} · {video.date}
            </p>
          </div>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border-strong px-5 py-2 text-sm transition-colors hover:bg-bg-elev-1"
          >
            {ctaLabel} <span aria-hidden>↗</span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
