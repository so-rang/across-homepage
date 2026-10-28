import { COMPANY, SITE_URL } from "@/lib/seo/site";

// humanstxt.org credit file. Facts come from COMPANY; the stack line mirrors
// package.json. Served statically so it never hits a function.
export const dynamic = "force-static";

const BODY = `/* TEAM */
Company: ${COMPANY.legalName} (${COMPANY.tradeName})
CEO: ${COMPANY.ceo}
Contact: ${COMPANY.email}
Site: ${SITE_URL}

/* SITE */
Languages: 한국어, English, 日本語, 中文
Standards: HTML5, CSS3, JSON-LD, llms.txt
Components: Next.js, React, Tailwind CSS, next-intl
Hosting: Vercel
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
