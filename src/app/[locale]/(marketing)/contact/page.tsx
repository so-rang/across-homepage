import type { Metadata } from "next";
import { PageHeader } from "@/components/brand/page-header";
import { Footer } from "@/components/footer";
import { ZoomOutGesture } from "@/components/nav/zoom-out-gesture";
import { ContactForm } from "@/components/sections/contact/contact-form";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "제품 도입·파트너십·미디어·채용 문의는 어크로스에 바로 보내주세요.",
};

export default function ContactPage() {
  return (
    <>
      <ZoomOutGesture backHref="/" />
      <Toaster richColors position="top-center" />
      <div className="flex h-[100svh] flex-col overflow-hidden [&_footer>div]:gap-5 [&_footer>div]:py-5 sm:[&_footer>div]:gap-6 sm:[&_footer>div]:py-6">
        <PageHeader />
        <main className="flex-1 overflow-hidden">
          <div className="mx-auto grid h-full max-w-6xl grid-cols-1 items-start gap-5 px-6 pb-4 pt-2 sm:px-10 sm:pt-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20 lg:pb-6 lg:pt-4">
            <header className="text-center lg:text-left">
              <h1 className="font-display text-[40px] font-medium leading-[1.1] tracking-[-0.01em] text-text sm:text-[56px]">
                Contact
              </h1>
              <p className="mt-2 text-[15px] font-light leading-[1.2] tracking-[-0.005em] text-text-muted sm:mt-2 sm:text-[18px]">
                문의하기
              </p>
              <p className="mt-3 text-[14px] leading-[1.6] text-text-muted sm:mt-4 sm:text-[15px] lg:mt-5 lg:max-w-[360px]">
                제품 도입·파트너십·미디어·채용 —<br className="hidden lg:block" />{" "}
                어떤 이야기든 편하게 들려주세요.
              </p>
              <div className="mt-4 hidden lg:block">
                <div className="h-px w-12 bg-border-subtle" aria-hidden />
                <a
                  href="mailto:ask@across.center"
                  className="mt-4 inline-flex items-center gap-2 font-mono text-[15px] text-text-muted transition-colors hover:text-text"
                >
                  <span aria-hidden className="text-signal-blue/80">
                    ↗
                  </span>
                  ask@across.center
                </a>
              </div>
            </header>
            <ContactForm />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
