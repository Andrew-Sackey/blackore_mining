import type { Metadata } from "next";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://blackoremining.com").replace(
  /\/$/,
  "",
);

export const indexable = process.env.VERCEL_ENV === "production";

export const homeTitle = "BlackOre Mining · Gold exploration in Ghana's Bono Region";

export const homeDescription =
  "BlackOre Mining is exploring the 41.09 km² Badu concession in Ghana's Birimian terrain, in the Bono Region's Wenchi Municipality.";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  image: string;
  imageAlt: string;
  /** Home already includes the brand, so the title template must not add it again. */
  absolute?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  absolute = false,
}: PageMeta): Metadata {
  const fullTitle = absolute ? title : `${title} · BlackOre Mining`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: "BlackOre Mining",
      locale: "en_GB",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}

export const homeMetadata = pageMetadata({
  title: homeTitle,
  description: homeDescription,
  path: "/",
  image: "/og/og-home.png",
  imageAlt:
    "BlackOre Mining. Birimian ground, ready to be tested. A 41.09 km² exploration concession at Badu, Bono Region, Ghana.",
  absolute: true,
});
