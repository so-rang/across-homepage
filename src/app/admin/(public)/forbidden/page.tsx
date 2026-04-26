import type { Metadata } from "next";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/features/admin/actions/auth";
import { getCurrentProfile } from "@/features/admin/utils/auth";

export const metadata: Metadata = {
  title: "Access Denied",
  robots: { index: false, follow: false },
};

export default async function ForbiddenPage() {
  const profile = await getCurrentProfile();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-10 shadow-sm">
        <h1 className="font-display text-2xl font-medium tracking-tight">
          접근 권한이 없습니다
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {profile?.email
            ? `${profile.email} 계정에 admin 권한이 없습니다.`
            : "권한이 없습니다."}
          {" "}
          관리자에게 문의하세요.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <form action={signOutAction}>
            <Button type="submit" variant="outline" className="w-full">
              다른 계정으로 로그인
            </Button>
          </form>
          <Link
            href="/"
            className={cn(buttonVariants({ variant: "ghost" }), "w-full")}
          >
            홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}
