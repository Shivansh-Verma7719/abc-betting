import { createClient } from "../supabase/client";
import { compressImage, CompressionOptions } from "./compression";

export interface UploadOptions {
  bucket: string;
  folder?: string;
  compression?: CompressionOptions;
  generateUniqueFileName?: boolean;
}

export interface UploadResult {
  success: boolean;
  url?: string | null;
  error?: string;
  compressionInfo?: {
    originalSize: string;
    compressedSize: string;
    compressionRatio: string;
    originalFormat: string;
    finalFormat: string;
  };
}

/**
 * Uploads an image to Supabase storage with optional compression
 * @param file - The image file to upload
 * @param options - Upload configuration options
 * @returns Promise<UploadResult> - Upload result with URL or error
 */
export async function uploadImage(
  file: File,
  options: UploadOptions
): Promise<UploadResult> {
  const supabase = createClient();

  try {
    // Validate file
    if (!file || !file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Invalid file: Please provide a valid image file",
      };
    }

    let fileToUpload = file;
    let compressionInfo;

    // Apply compression if options are provided
    if (options.compression) {
      try {
        const compressionResult = await compressImage(
          file,
          options.compression
        );
        fileToUpload = compressionResult.file;
        compressionInfo = compressionResult.compressionInfo;
      } catch (compressionError) {
        console.error(
          "Compression failed, uploading original:",
          compressionError
        );
        // Continue with original file if compression fails
      }
    }

    // Generate file name
    let fileName = fileToUpload.name;
    if (options.generateUniqueFileName) {
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const extension = fileToUpload.name.split(".").pop() || "webp";
      fileName = `${timestamp}-${randomSuffix}.${extension}`;
    }

    // Add folder prefix if specified
    if (options.folder) {
      fileName = `${options.folder}/${fileName}`;
    }

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(fileName, fileToUpload, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading image:", error);
      return {
        success: false,
        error: `Upload failed: ${error.message}`,
      };
    }

    // Get the public URL for the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from(options.bucket).getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrl,
      compressionInfo,
    };
  } catch (error) {
    console.error("Error in uploadImage:", error);
    return {
      success: false,
      error: `Unexpected error: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
