/**
 * Convert Google Drive links to direct usable URLs for media sending
 */
export const normalizeImageUrl = (url) => {
  try {
    if (!url) return null;

    // If it's NOT a Google Drive link → return as is
    if (!url.includes("drive.google.com")) {
      return url;
    }

    let fileId = null;

    // Format 1: https://drive.google.com/file/d/FILE_ID/view
    const fileMatch = url.match(/\/file\/d\/([^\/]+)/);
    if (fileMatch) {
      fileId = fileMatch[1];
    }

    // Format 2: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/[?&]id=([^&]+)/);
    if (!fileId && openMatch) {
      fileId = openMatch[1];
    }

    if (!fileId) {
      console.warn("⚠️ Could not extract Drive file ID");
      return url;
    }

    // Convert to direct image URL
    const directUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    return directUrl;

  } catch (error) {
    console.error("❌ URL normalization error:", error.message);
    return url;
  }
};
