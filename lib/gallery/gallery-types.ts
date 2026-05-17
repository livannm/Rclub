export type GalleryPhoto = {
  id: string;
  event_id: string;
  event_slug: string;
  image_url: string;
  alt_fr: string;
  alt_en: string;
  order: number;
};

export type LocalizedGalleryPhoto = {
  id: string;
  image_url: string;
  alt: string;
  order: number;
};

export type CreatePhotoPayload = {
  event_id: string;
  event_slug: string;
  image_url: string;
  alt_fr: string;
  alt_en: string;
  order: number;
};
