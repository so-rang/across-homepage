export type ProductId = "gpto" | "genrank" | "naeo";

type ImageLogo = {
  kind: "image";
  src: string;
  width: number;
  height: number;
  whiteOnDark?: boolean;
};

type TextLogo = {
  kind: "text";
  text: string;
};

export type OwnedProduct = {
  id: ProductId;
  name: string;
  href: string;
  logo: ImageLogo | TextLogo;
};

export const OWNED_PRODUCTS: readonly OwnedProduct[] = [
  {
    id: "gpto",
    name: "GPTO",
    href: "https://gpto.kr",
    logo: {
      kind: "image",
      src: "/logo/gpto_logo_white.png",
      width: 9600,
      height: 4000,
      whiteOnDark: true,
    },
  },
  {
    id: "genrank",
    name: "GenRank",
    href: "https://genrank.com",
    logo: {
      kind: "text",
      text: "GenRank",
    },
  },
  {
    id: "naeo",
    name: "NAEO",
    href: "https://www.naeo.kr",
    logo: {
      kind: "image",
      src: "/logo/naeo_logo_cutout.png",
      width: 740,
      height: 192,
    },
  },
];
