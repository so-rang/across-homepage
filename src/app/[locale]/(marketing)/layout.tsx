import { DawnSky } from "@/components/background/dawn-sky";
import { Stage } from "@/components/background/stage";
import { ConditionalFooter } from "@/components/conditional-footer";

/**
 * (marketing) layout — destination screens (Hero · About · Services · Contents · Contact).
 */
export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative isolate min-h-dvh overflow-x-clip">
      <Stage />
      <DawnSky />
      <div className="relative z-40">{children}</div>
      <div className="relative z-40">
        <ConditionalFooter />
      </div>
    </div>
  );
}
