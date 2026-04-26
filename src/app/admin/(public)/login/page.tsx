import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signInWithGoogleAction } from "@/features/admin/actions/auth";
import { getCurrentProfile } from "@/features/admin/utils/auth";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { next, error } = await searchParams;

  const profile = await getCurrentProfile();
  if (profile && (profile.role === "admin" || profile.role === "staff")) {
    redirect(next ?? "/admin/posts");
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-10 shadow-sm">
        <h1 className="font-display text-2xl font-medium tracking-tight">
          Admin
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          어크로스 직원 전용. Google 계정으로 로그인하세요.
        </p>

        <form action={signInWithGoogleAction} className="mt-8 space-y-3">
          <input type="hidden" name="next" value={next ?? "/admin/posts"} />
          <Button type="submit" className="w-full" size="lg">
            Google로 계속하기
          </Button>
        </form>

        {error ? (
          <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            로그인 실패: {error}
          </p>
        ) : null}

        {profile && profile.role === null ? (
          <p className="mt-4 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
            로그인됐지만 권한이 없습니다. 관리자에게 권한 요청을 해주세요.
          </p>
        ) : null}
      </div>
    </main>
  );
}
