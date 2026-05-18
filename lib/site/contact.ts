export type ClubContact = {
  instagramUrl: string;
  instagramHandle: string;
  phoneDisplay: string;
  phoneHref: string;
  address: string;
  mapsUrl: string;
};

export function getClubContact(): ClubContact {
  const instagramUrl =
    process.env.NEXT_PUBLIC_CLUB_INSTAGRAM_URL ?? "https://www.instagram.com/rclubstrasbourg";
  const phoneDisplay = process.env.NEXT_PUBLIC_CLUB_PHONE ?? "+33 3 88 24 00 00";
  const phoneHref =
    process.env.NEXT_PUBLIC_CLUB_PHONE_HREF ??
    `tel:${phoneDisplay.replace(/\s/g, "")}`;
  const address =
    process.env.NEXT_PUBLIC_CLUB_ADDRESS ?? "7 Quai des Pêcheurs, 67000 Strasbourg";
  const mapsUrl =
    process.env.NEXT_PUBLIC_CLUB_MAPS_URL ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const handleMatch = instagramUrl.match(/instagram\.com\/([^/?#]+)/i);
  const instagramHandle = handleMatch?.[1] ? `@${handleMatch[1]}` : "@rclubstrasbourg";

  return {
    instagramUrl,
    instagramHandle,
    phoneDisplay,
    phoneHref,
    address,
    mapsUrl
  };
}
