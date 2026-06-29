export type MediaProvider = "cloudinary" | "local";

export type MediaResourceType = "image" | "video";

export interface MediaUploadInput {
  data: Buffer;
  filename: string;
  contentType: string;
}

export interface UploadedMedia {
  url: string;
  provider: MediaProvider;
  resourceType: MediaResourceType;
  bytes: number;
  format?: string;
  width?: number;
  height?: number;
  publicId?: string;
}

export interface MediaStorage {
  readonly provider: MediaProvider;
  upload(input: MediaUploadInput): Promise<UploadedMedia>;
}
