import type { Metadata } from "next";
import {
  cormorant,
  jetbrainsMono,
  notoSerifKr,
  pretendard,
} from "@/app/fonts";
import { Toaster } from "@/components/ui/sonner";
import { THEME_BOOTSTRAP } from "@/lib/theme/bootstrap";
import { cn } from "@/lib/utils";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Across Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={cn(
        "h-full",
        pretendard.variable,
        jetbrainsMono.variable,
        cormorant.variable,
        notoSerifKr.variable,
      )}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body className="min-h-full font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
