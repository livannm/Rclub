export type ClubContact = {
  instagramUrl: string;
  instagramHandle: string;
  facebookUrl: string;
  tiktokUrl: string;
  tiktokHandle: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsappUrl: string;
  address: string;
  mapsUrl: string;
  mapsEmbedUrl: string;
};

export function getClubContact(): ClubContact {
  const instagramUrl =
    process.env.NEXT_PUBLIC_CLUB_INSTAGRAM_URL ?? "https://www.instagram.com/rclubstrasbourg";
  const facebookUrl =
    process.env.NEXT_PUBLIC_CLUB_FACEBOOK_URL ?? "https://www.facebook.com/rclubstrasbourg";
  const tiktokUrl =
    process.env.NEXT_PUBLIC_CLUB_TIKTOK_URL ?? "https://www.tiktok.com/@rclubstrasbourg";
  const phoneDisplay = process.env.NEXT_PUBLIC_CLUB_PHONE ?? "+33 3 88 24 00 00";
  const phoneHref =
    process.env.NEXT_PUBLIC_CLUB_PHONE_HREF ??
    `tel:${phoneDisplay.replace(/\s/g, "")}`;
  const address =
    process.env.NEXT_PUBLIC_CLUB_ADDRESS ?? "7 Quai des Pêcheurs, 67000 Strasbourg";
  const mapsUrl =
    process.env.NEXT_PUBLIC_CLUB_MAPS_URL ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const mapsEmbedUrl =
    process.env.NEXT_PUBLIC_CLUB_MAPS_EMBED_URL ??
    `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const handleMatch = instagramUrl.match(/instagram\.com\/([^/?#]+)/i);
  const instagramHandle = handleMatch?.[1] ? `@${handleMatch[1]}` : "@rclubstrasbourg";

  const tiktokHandleMatch = tiktokUrl.match(/tiktok\.com\/@([^/?#]+)/i);
  const tiktokHandle = tiktokHandleMatch?.[1] ? `@${tiktokHandleMatch[1]}` : "@rclubstrasbourg";

  const waNumber = phoneHref.replace(/^tel:\+?/, "");
  const whatsappUrl = `https://wa.me/${waNumber}`;

  return {
    instagramUrl,
    instagramHandle,
    facebookUrl,
    tiktokUrl,
    tiktokHandle,
    phoneDisplay,
    phoneHref,
    whatsappUrl,
    address,
    mapsUrl,
    mapsEmbedUrl
  };
}
