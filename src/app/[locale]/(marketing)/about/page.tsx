import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

/**
 * Legacy /about route — content was merged into the home page as the #about
 * scroll section. Redirect preserves external links and bookmarks.
 */
export default async function AboutPage() {
  const locale = await getLocale();
  redirect({ href: "/#about", locale });
}
