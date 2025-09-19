import { createClient } from "@/utils/supabase/client";

// Helper to extract file path from Supabase storage URL
function extractFilePathFromUrl(url: string): string | null {
  try {
    // Supabase storage URLs typically look like:
    // https://[project].supabase.co/storage/v1/object/public/profile_images/filename.webp
    const urlParts = url.split("/");
    const publicIndex = urlParts.indexOf("public");

    if (publicIndex !== -1 && publicIndex < urlParts.length - 2) {
      // Extract the path after 'public/bucket_name/'
      const pathParts = urlParts.slice(publicIndex + 2);
      return pathParts.join("/");
    }

    return null;
  } catch (error) {
    console.error("Error extracting file path from URL:", error);
    return null;
  }
}

// Helper to delete image from storage
export async function deleteImage(imageUrl: string, bucket: string): Promise<boolean> {
  const supabase = createClient();

  try {
    const filePath = extractFilePathFromUrl(imageUrl);

    if (!filePath) {
      console.warn("Could not extract file path from URL:", imageUrl);
      return false;
    }

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error("Error deleting profile image:", error);
      return false;
    }

    console.log("Successfully deleted profile image:", filePath);
    return true;
  } catch (error) {
    console.error("Error in deleteProfileImage:", error);
    return false;
  }
}
