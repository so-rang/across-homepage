"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInWithGoogleAction(formData: FormData) {
  const next = (formData.get("next") as string | null) ?? "/admin/posts";
  const supabase = await createSupabaseServerClient();
  // Pin OAuth redirect to the canonical site URL when configured. Vercel
  // preview deployments expose request hosts like `across-homepage-xyz.vercel.app`,
  // and Supabase silently falls back to its Site URL when `redirectTo`
  // isn't in the allow-list — landing the user on the wrong domain with no
  // session cookie set against the production host.
  const configuredSite = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const headersList = await headers();
  const origin =
    configuredSite ??
    headersList.get("origin") ??
    `https://${headersList.get("host") ?? "localhost:3000"}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/admin/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
  }
  if (data?.url) {
    redirect(data.url);
  }
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
