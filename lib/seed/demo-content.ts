import type { ClubEvent } from "@/lib/events/event-schema";
import type { GalleryPhoto } from "@/lib/gallery/gallery-types";

const SEED_TIMESTAMP = "2026-05-18T00:00:00.000Z";

export const DEMO_EVENT_IDS = {
  takeMeBack: "11111111-1111-4111-8111-111111110001",
  ven8Mai: "11111111-1111-4111-8111-111111110002",
  legendR: "11111111-1111-4111-8111-111111110003",
  adultsOnly: "11111111-1111-4111-8111-111111110004",
  rFamily: "11111111-1111-4111-8111-111111110005"
} as const;

export const DEMO_EVENTS: ClubEvent[] = [
  {
    id: DEMO_EVENT_IDS.ven8Mai,
    slug: "ven-8-mai",
    title_fr: "Vendredi 8 Mai",
    title_en: "Friday May 8",
    description_fr: "Soiree signature au Rclub Strasbourg.",
    description_en: "Signature night at Rclub Strasbourg.",
    starts_at: "2026-05-23T22:00:00.000Z",
    ends_at: "2026-05-24T05:00:00.000Z",
    location: "Rclub Strasbourg",
    cover_image_url: "/media/events/ven-8-mai.png",
    is_published: true,
    created_at: SEED_TIMESTAMP,
    updated_at: SEED_TIMESTAMP
  },
  {
    id: DEMO_EVENT_IDS.takeMeBack,
    slug: "take-me-back-15-mai",
    title_fr: "Take Me Back",
    title_en: "Take Me Back",
    description_fr: "Retour aux classiques sur la piste.",
    description_en: "A classics-driven night on the floor.",
    starts_at: "2026-05-24T22:00:00.000Z",
    ends_at: "2026-05-25T05:00:00.000Z",
    location: "Rclub Strasbourg",
    cover_image_url: "/media/events/take-me-back-15-mai.png",
    is_published: true,
    created_at: SEED_TIMESTAMP,
    updated_at: SEED_TIMESTAMP
  },
  {
    id: DEMO_EVENT_IDS.legendR,
    slug: "legend-r",
    title_fr: "Legend R",
    title_en: "Legend R",
    description_fr: "Soiree Legend R, ambiance premium et energie maximale.",
    description_en: "Legend R night with premium energy and full club atmosphere.",
    starts_at: "2026-05-25T22:00:00.000Z",
    ends_at: "2026-05-26T05:00:00.000Z",
    location: "Rclub Strasbourg",
    cover_image_url: "/media/events/legend-r.png",
    is_published: true,
    created_at: SEED_TIMESTAMP,
    updated_at: SEED_TIMESTAMP
  },
  {
    id: DEMO_EVENT_IDS.adultsOnly,
    slug: "adults-only-v5",
    title_fr: "Adults Only V5",
    title_en: "Adults Only V5",
    description_fr: "Edition Adults Only, soiree exclusive 18+.",
    description_en: "Adults Only edition, exclusive 18+ night.",
    starts_at: "2026-05-30T22:00:00.000Z",
    ends_at: "2026-05-31T05:00:00.000Z",
    location: "Rclub Strasbourg",
    cover_image_url: "/media/events/adults-only-v5.png",
    is_published: true,
    created_at: SEED_TIMESTAMP,
    updated_at: SEED_TIMESTAMP
  },
  {
    id: DEMO_EVENT_IDS.rFamily,
    slug: "r-family",
    title_fr: "R Family",
    title_en: "R Family",
    description_fr: "Soiree R Family, esprit collectif et sets immersifs.",
    description_en: "R Family night with collective energy and immersive sets.",
    starts_at: "2026-06-06T22:00:00.000Z",
    ends_at: "2026-06-07T05:00:00.000Z",
    location: "Rclub Strasbourg",
    cover_image_url: "/media/events/r-family.png",
    is_published: true,
    created_at: SEED_TIMESTAMP,
    updated_at: SEED_TIMESTAMP
  }
];

export const DEMO_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "legend-r-1",
    event_id: DEMO_EVENT_IDS.legendR,
    event_slug: "legend-r",
    image_url: "/media/events/legend-r.png",
    alt_fr: "Affiche Legend R",
    alt_en: "Legend R poster",
    order: 1
  },
  {
    id: "legend-r-2",
    event_id: DEMO_EVENT_IDS.legendR,
    event_slug: "legend-r",
    image_url: "/media/events/adults-only-v5.png",
    alt_fr: "Ambiance Adults Only au Rclub",
    alt_en: "Adults Only atmosphere at Rclub",
    order: 2
  },
  {
    id: "legend-r-3",
    event_id: DEMO_EVENT_IDS.legendR,
    event_slug: "legend-r",
    image_url: "/media/events/r-family.png",
    alt_fr: "Soiree R Family",
    alt_en: "R Family night",
    order: 3
  }
];
