import {
  DEFAULT_CLUB_PLACE_SEARCH_QUERY,
  getClubPlaceConfig,
} from "@/lib/site/club-place";

export type ClubPhone = {
  display: string;
  href: string;
};

export type ClubContact = {
  instagramUrl: string;
  instagramHandle: string;
  facebookUrl: string;
  tiktokUrl: string;
  tiktokHandle: string;
  phones: ClubPhone[];
  phoneDisplay: string;
  phoneHref: string;
  whatsappUrl: string;
  email: string;
  emailHref: string;
  address: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
};

const DEFAULT_INSTAGRAM_URL =
  "https://www.instagram.com/rclub.strasbourg?igsh=MTB4amRydjI2Nmxqbg==";
const DEFAULT_PHONES: ClubPhone[] = [
  { display: "+33 7 68 38 16 36", href: "tel:+33768381636" },
  { display: "+33 6 95 86 89 36", href: "tel:+33695868936" },
];

function resolvePhone(
  display: string | undefined,
  href: string | undefined,
  fallback: ClubPhone,
): ClubPhone {
  const resolvedDisplay = display ?? fallback.display;
  return {
    display: resolvedDisplay,
    href: href ?? `tel:${resolvedDisplay.replace(/\s/g, "")}`,
  };
}

export function getClubContact(): ClubContact {
  const instagramUrl = process.env.NEXT_PUBLIC_CLUB_INSTAGRAM_URL ?? DEFAULT_INSTAGRAM_URL;
  const facebookUrl =
    process.env.NEXT_PUBLIC_CLUB_FACEBOOK_URL ?? "https://www.facebook.com/rclubstrasbourg";
  const tiktokUrl =
    process.env.NEXT_PUBLIC_CLUB_TIKTOK_URL ?? "https://www.tiktok.com/@rclubstrasbourg";
  const phones = [
    resolvePhone(
      process.env.NEXT_PUBLIC_CLUB_PHONE,
      process.env.NEXT_PUBLIC_CLUB_PHONE_HREF,
      DEFAULT_PHONES[0]!,
    ),
    resolvePhone(
      process.env.NEXT_PUBLIC_CLUB_PHONE_2,
      process.env.NEXT_PUBLIC_CLUB_PHONE_2_HREF,
      DEFAULT_PHONES[1]!,
    ),
  ];
  const phoneDisplay = phones[0]!.display;
  const phoneHref = phones[0]!.href;
  const address =
    process.env.NEXT_PUBLIC_CLUB_ADDRESS ?? "24 Place des Halles, 67000 Strasbourg";
  const { placeId: mapsPlaceId } = getClubPlaceConfig();
  const rawMapsUrl = process.env.NEXT_PUBLIC_CLUB_MAPS_URL;
  const defaultMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(DEFAULT_CLUB_PLACE_SEARCH_QUERY)}&query_place_id=${mapsPlaceId}`;
  const mapsUrl =
    rawMapsUrl && /^https:\/\//i.test(rawMapsUrl) ? rawMapsUrl : defaultMapsUrl;
  const defaultMapsEmbedUrl = `https://maps.google.com/maps?q=place_id:${mapsPlaceId}&hl=fr&z=18&ie=UTF8&iwloc=&output=embed`;
  const mapsEmbedUrl = process.env.NEXT_PUBLIC_CLUB_MAPS_EMBED_URL ?? defaultMapsEmbedUrl;

  const handleMatch = instagramUrl.match(/instagram\.com\/([^/?#]+)/i);
  const instagramHandle = handleMatch?.[1] ? `@${handleMatch[1]}` : "@rclub.strasbourg";

  const tiktokHandleMatch = tiktokUrl.match(/tiktok\.com\/@([^/?#]+)/i);
  const tiktokHandle = tiktokHandleMatch?.[1] ? `@${tiktokHandleMatch[1]}` : "@rclubstrasbourg";

  const waNumber = phoneHref.replace(/^tel:\+?/, "");
  const whatsappUrl = `https://wa.me/${waNumber}`;
  const email = process.env.NEXT_PUBLIC_CLUB_EMAIL ?? "contact@r-club.fr";

  return {
    instagramUrl,
    instagramHandle,
    facebookUrl,
    tiktokUrl,
    tiktokHandle,
    phones,
    phoneDisplay,
    phoneHref,
    whatsappUrl,
    email,
    emailHref: `mailto:${email}`,
    address,
    mapsUrl,
    mapsEmbedUrl,
  };
}
