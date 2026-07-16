import {
  DEFAULT_CLUB_COORDS,
  STRASBOURG_LOCATION_BIAS,
  type ClubCoords,
} from "@/lib/site/club-place";

export type ResolvedClubPlace = {
  coords: ClubCoords;
  placeId: string | null;
  displayName: string | null;
  source: "place_id" | "places_search" | "fallback_coords";
};

function toCoords(location: google.maps.LatLng | google.maps.LatLngLiteral): ClubCoords {
  if (typeof (location as google.maps.LatLng).lat === "function") {
    const latLng = location as google.maps.LatLng;
    return { lat: latLng.lat(), lng: latLng.lng() };
  }
  const literal = location as google.maps.LatLngLiteral;
  return { lat: literal.lat, lng: literal.lng };
}

async function resolveFromPlaceId(placeId: string): Promise<ResolvedClubPlace | null> {
  const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;
  const place = new Place({ id: placeId });

  try {
    await place.fetchFields({ fields: ["location", "displayName", "id"] });
  } catch {
    return null;
  }

  if (!place.location) return null;

  return {
    coords: toCoords(place.location),
    placeId: place.id ?? placeId,
    displayName: place.displayName ?? null,
    source: "place_id",
  };
}

async function resolveFromPlacesSearch(searchQuery: string): Promise<ResolvedClubPlace | null> {
  const { Place } = (await google.maps.importLibrary("places")) as google.maps.PlacesLibrary;

  try {
    const { places } = await Place.searchByText({
      textQuery: searchQuery,
      fields: ["location", "displayName", "id"],
      locationBias: STRASBOURG_LOCATION_BIAS,
      maxResultCount: 1,
      language: "fr",
      region: "fr",
    });

    const match = places[0];
    if (!match?.location) return null;

    return {
      coords: toCoords(match.location),
      placeId: match.id ?? null,
      displayName: match.displayName ?? null,
      source: "places_search",
    };
  } catch {
    return null;
  }
}

export async function resolveClubPlace(options: {
  placeId: string;
  searchQuery: string;
  fallbackCoords?: ClubCoords;
}): Promise<ResolvedClubPlace> {
  const fallbackCoords = options.fallbackCoords ?? DEFAULT_CLUB_COORDS;

  const fromPlaceId = await resolveFromPlaceId(options.placeId);
  if (fromPlaceId) return fromPlaceId;

  const fromSearch = await resolveFromPlacesSearch(options.searchQuery);
  if (fromSearch) return fromSearch;

  return {
    coords: fallbackCoords,
    placeId: options.placeId,
    displayName: null,
    source: "fallback_coords",
  };
}
