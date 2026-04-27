import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signInWithGoogleAction } from "@/features/admin/actions/auth";
import { getCurrentProfile } from "@/features/admin/utils/auth";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { next, error } = await searchParams;

  const profile = await getCurrentProfile();
  if (profile) {
    redirect(next ?? "/admin");
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <span
            aria-hidden
            className="across-mark block aspect-[589/758] h-12 bg-foreground/85"
          />
        </div>

        <div className="mt-10 text-center">
          <h1 className="font-display text-3xl font-medium tracking-tight">
            관리자 콘솔
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            어크로스 직원 전용 공간입니다.
            <br className="hidden sm:inline" /> Google 계정으로 계속하세요.
          </p>
        </div>

        <form action={signInWithGoogleAction} className="mt-10">
          <input type="hidden" name="next" value={next ?? "/admin"} />
          <Button
            type="submit"
            size="lg"
            variant="outline"
            className="w-full gap-2.5 bg-background"
          >
            <GoogleGlyph className="h-4 w-4" />
            Google로 계속하기
          </Button>
        </form>

        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-center text-sm text-destructive"
          >
            로그인 실패: {error}
          </p>
        ) : null}

        <div className="mt-12 text-center text-xs text-muted-foreground">
          권한이 필요한 경우 관리자에게 문의하세요.
        </div>

        <div className="mt-3 text-center">
          <Link
            href="/"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ← 어크로스 홈으로
          </Link>
        </div>
      </div>
    </main>
  );
}

function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.12 2.73-2.4 3.58v2.97h3.86c2.26-2.09 3.59-5.16 3.59-8.79z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.94-2.92l-3.86-2.97c-1.07.72-2.45 1.16-4.08 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.27 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.31a7.21 7.21 0 010-4.62V6.6H1.29a12 12 0 000 10.8l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.18 15.24 0 12 0 7.31 0 3.27 2.7 1.29 6.6l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}
