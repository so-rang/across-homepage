import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/features/admin/actions/auth";
import { AdminThemeToggle } from "@/features/admin/components/admin-theme-toggle";
import { requireStaffProfile } from "@/features/admin/utils/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireStaffProfile();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <nav className="flex items-center gap-6">
            <Link
              href="/admin/posts"
              className="font-display text-base font-medium tracking-tight"
            >
              Across Admin
            </Link>
            <Link
              href="/admin/posts"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Posts
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {profile.display_name ?? profile.email}
            </span>
            <AdminThemeToggle />
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" size="sm">
                로그아웃
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
