export type ClubCoords = {
  lat: number;
  lng: number;
};

/** Google Place ID du Rclub Strasbourg (24 Place des Halles). */
export const DEFAULT_CLUB_PLACE_ID = "ChIJQQeIt07IlkcRS1RMUGXpyuA";

export const DEFAULT_CLUB_COORDS: ClubCoords = {
  lat: 48.585772,
  lng: 7.742566,
};

/** Requête Places ciblée sur l'établissement. */
export const DEFAULT_CLUB_PLACE_SEARCH_QUERY = "Rclub Strasbourg";

/** Centre de Strasbourg pour biaiser la recherche Places. */
export const STRASBOURG_LOCATION_BIAS: ClubCoords = {
  lat: 48.5734,
  lng: 7.7521,
};

function parseCoords(raw: string | undefined): ClubCoords | null {
  if (!raw) return null;
  const [latRaw, lngRaw] = raw.split(",").map((part) => part.trim());
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

export type ClubPlaceConfig = {
  placeId: string;
  coords: ClubCoords;
  searchQuery: string;
  apiKey: string | undefined;
};

export function getClubPlaceConfig(): ClubPlaceConfig {
  return {
    placeId: process.env.NEXT_PUBLIC_CLUB_MAPS_PLACE_ID ?? DEFAULT_CLUB_PLACE_ID,
    coords: parseCoords(process.env.NEXT_PUBLIC_CLUB_MAPS_COORDS) ?? DEFAULT_CLUB_COORDS,
    searchQuery:
      process.env.NEXT_PUBLIC_CLUB_MAPS_SEARCH_QUERY ?? DEFAULT_CLUB_PLACE_SEARCH_QUERY,
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  };
}
