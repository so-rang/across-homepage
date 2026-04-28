import Image from "next/image";
import { CLIENTS, type Client } from "@/lib/clients";
import { cn } from "@/lib/utils";

const MID = Math.ceil(CLIENTS.length / 2);
const ROW_TOP = CLIENTS.slice(0, MID);
const ROW_BOTTOM = CLIENTS.slice(MID);

const T1 = Math.ceil(CLIENTS.length / 3);
const T2 = Math.ceil((CLIENTS.length * 2) / 3);
const ROW_M_TOP = CLIENTS.slice(0, T1);
const ROW_M_MID = CLIENTS.slice(T1, T2);
const ROW_M_BOTTOM = CLIENTS.slice(T2);

type Props = {
  ariaLabel?: string;
};

function logoHeight(c: Client): number {
  if (c.displayHeight != null) return c.displayHeight;
  const r = c.width / c.height;
  if (r > 4) return 24;
  if (r > 2.5) return 30;
  if (r > 1.5) return 38;
  if (r > 1.0) return 46;
  return 50;
}

function LogoItem({ client }: { client: Client }) {
  const h = logoHeight(client);
  const imgClass = "w-auto object-contain";
  const media = client.darkSrc ? (
    <>
      <Image
        src={client.src}
        alt={client.name}
        width={client.width}
        height={client.height}
        loading="lazy"
        className={cn(imgClass, "block dark:hidden")}
        style={{ height: `${h}px` }}
        sizes="(min-width: 640px) 200px, 140px"
      />
      <Image
        src={client.darkSrc}
        alt=""
        width={client.width}
        height={client.height}
        loading="lazy"
        aria-hidden="true"
        className={cn(imgClass, "hidden dark:block")}
        style={{ height: `${h}px` }}
        sizes="(min-width: 640px) 200px, 140px"
      />
    </>
  ) : (
    <Image
      src={client.src}
      alt={client.name}
      width={client.width}
      height={client.height}
      loading="lazy"
      className={cn(
        imgClass,
        client.invertOnDark && "dark:invert",
        client.brightenOnDark && "dark:brightness-125 dark:saturate-150"
      )}
      style={{ height: `${h}px` }}
      sizes="(min-width: 640px) 200px, 140px"
    />
  );
  return (
    <li
      className="flex shrink-0 items-center justify-center"
      style={{ height: `${h}px` }}
    >
      {client.href ? (
        <a
          href={client.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={client.name}
          className="flex h-full items-center justify-center rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-signal-blue/60"
        >
          {media}
        </a>
      ) : (
        media
      )}
    </li>
  );
}

function Row({
  items,
  direction,
}: {
  items: readonly Client[];
  direction: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "clients-marquee-track flex items-center",
        direction === "left"
          ? "clients-marquee-track--left"
          : "clients-marquee-track--right"
      )}
    >
      <ul className="flex items-center gap-x-10 pe-10">
        {items.map((c) => (
          <LogoItem key={`${direction}-a-${c.id}`} client={c} />
        ))}
      </ul>
      <ul
        className="flex items-center gap-x-10 pe-10"
        aria-hidden="true"
      >
        {items.map((c) => (
          <LogoItem key={`${direction}-b-${c.id}`} client={c} />
        ))}
      </ul>
    </div>
  );
}

export function ClientsMarquee({ ariaLabel }: Props) {
  return (
    <div
      className="clients-marquee relative"
      role="region"
      aria-label={ariaLabel ?? "Clients"}
    >
      <div className="hidden space-y-6 md:block">
        <Row items={ROW_TOP} direction="left" />
        <Row items={ROW_BOTTOM} direction="right" />
      </div>
      <div className="space-y-5 md:hidden">
        <Row items={ROW_M_TOP} direction="left" />
        <Row items={ROW_M_MID} direction="right" />
        <Row items={ROW_M_BOTTOM} direction="left" />
      </div>
    </div>
  );
}
