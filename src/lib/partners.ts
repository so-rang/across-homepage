export type PartnerId = "hkgpto" | "medigpto" | "customereye";

export type Partner = {
  id: PartnerId;
  name: string;
  href: string;
  logo: {
    src: string;
    width: number;
    height: number;
    className?: string;
  };
};

export const PARTNERS: readonly Partner[] = [
  {
    id: "hkgpto",
    name: "한경GPTO",
    href: "https://www.hkgpto.com",
    logo: {
      src: "/logo/hkgpto_hk.svg",
      width: 80,
      height: 20,
      className: "dark:brightness-0 dark:invert",
    },
  },
  {
    id: "medigpto",
    name: "MediGPTO",
    href: "https://medigpto.com",
    logo: {
      src: "/logo/medi_trans_logo.png",
      width: 750,
      height: 728,
    },
  },
  {
    id: "customereye",
    name: "고객의눈 GPTO",
    href: "https://client-gpto.com",
    logo: {
      src: "/logo/client_eye_logo.png",
      width: 508,
      height: 136,
      className: "-mr-2 -translate-y-px",
    },
  },
];
