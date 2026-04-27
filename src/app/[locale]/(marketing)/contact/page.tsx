import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

/**
 * Legacy /contact route — the contact form was inlined into the home page's
 * #contact scroll section. Redirect preserves external links and bookmarks.
 */
export default async function ContactPage() {
  const locale = await getLocale();
  redirect({ href: "/#contact", locale });
}
