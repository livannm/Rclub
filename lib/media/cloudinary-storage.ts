import { v2 as cloudinary } from "cloudinary";
import type { CloudinaryConfig } from "./cloudinary-config";
import type { MediaStorage, MediaUploadInput, UploadedMedia } from "./media-storage";

export class CloudinaryStorage implements MediaStorage {
  readonly provider = "cloudinary" as const;
  private readonly folder: string;

  constructor(config: CloudinaryConfig) {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
      secure: true
    });
    this.folder = config.folder;
  }

  async upload(input: MediaUploadInput): Promise<UploadedMedia> {
    const dataUri = `data:${input.contentType};base64,${input.data.toString("base64")}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: this.folder,
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
      overwrite: false
    });

    return {
      url: result.secure_url,
      provider: this.provider,
      resourceType: result.resource_type === "video" ? "video" : "image",
      bytes: result.bytes,
      format: result.format,
      width: result.width,
      height: result.height,
      publicId: result.public_id
    };
  }
}
