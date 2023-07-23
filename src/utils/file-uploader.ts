import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { COLUD_NAME, CLOUD_API_KEY, CLOUD_SECRET_KEY } from "../config";

export const upload = multer({ storage: multer.memoryStorage() });

cloudinary.config({
  cloud_name: COLUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_SECRET_KEY,
});

interface UploadedImage {
  secure_url: string;
  public_id: string;
}

async function uploadImages(
  images: Express.Multer.File[]
): Promise<UploadedImage[]> {
  try {
    if (!images || images.length === 0) {
      throw new Error("No image files provided");
    }

    const uploadPromises = images.map(
      (file) =>
        new Promise<UploadApiResponse>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream((error, result) => {
              if (error) reject(error);
              else resolve(result as any);
            })
            .end(file.buffer);
        })
    );

    // Upload images to Cloudinary in parallel
    const results = await Promise.all(uploadPromises);

    const uploadedImages: UploadedImage[] = results.map((result) => ({
      secure_url: result.secure_url,
      public_id: result.public_id,
    }));

    return uploadedImages;
  } catch (error) {
    throw new Error("Error uploading images");
  }
}

export { uploadImages };
