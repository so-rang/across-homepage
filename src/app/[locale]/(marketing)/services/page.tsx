import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

/**
 * Legacy /services route — content was merged into the home page as the
 * #services scroll section. Redirect preserves external links and bookmarks.
 */
export default async function ServicesPage() {
  const locale = await getLocale();
  redirect({ href: "/#services", locale });
}
