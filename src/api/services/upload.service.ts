import api from "../axios.config";

interface UploadedMedia {
  id: number;
  url: string;
  filename: string;
  mimeType: string;
  size?: number;
  width?: number;
  height?: number;
}

interface UploadMediaResponse {
  media?: UploadedMedia[];
}

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const responseError =
    typeof error === "object" && error !== null && "response" in error
      ? (error as { response?: { data?: { message?: string; error?: string } } })
      : undefined;

  const apiMessage =
    responseError?.response?.data?.message ||
    responseError?.response?.data?.error;

  if (apiMessage && apiMessage.trim().length > 0) {
    return apiMessage;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};

const uploadService = {
  uploadFiles: async (
    files: File[],
    entityType: "ping" | "wave",
  ): Promise<UploadedMedia[]> => {
    if (!files || files.length === 0) return [];

    // If only 1 file, upload directly
    if (files.length === 1) {
      const formData = new FormData();
      formData.append("files", files[0]);
      formData.append("entityType", entityType);
      const res = await api.post<{ media: UploadedMedia[] }>(
        "/uploads",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        },
      );
      return res.data.media || [];
    }

    // For multiple files, upload individually so that:
    // 1. Payloads stay small and don't choke the network or hit the 30s aggregate timeout
    // 2. Low-memory hosting (Render) doesn't fail trying to buffer and stream multiple images at once
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("files", file);
      formData.append("entityType", entityType);
      const res = await api.post<{ media: UploadedMedia[] }>(
        "/uploads",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        },
      );
      const item = res.data.media?.[0];
      if (!item) {
        throw new Error(`Upload failed for ${file.name}`);
      }
      return item;
    });

    return Promise.all(uploadPromises);
  },

  /**
   * Upload profile picture for current user
   * @param file - Image file (JPEG, PNG, GIF, WebP)
   * @returns Uploaded media and updated user info
   */
  uploadProfilePicture: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/uploads/profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  /**
   * Upload anonymous profile picture (alias avatar)
   * @param file - Image file (JPEG, PNG, GIF, WebP, max 5MB)
   * @returns Uploaded media URL
   */
  uploadAnonProfilePicture: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("files", file);

    try {
      const res = await api.post<UploadMediaResponse>("/uploads", formData);
      const uploadedUrl = res.data.media?.[0]?.url;

      if (!uploadedUrl) {
        throw new Error(
          "Upload succeeded but no media URL was returned. Please try again.",
        );
      }

      return uploadedUrl;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          "Could not upload anonymous alias picture. Please check file type/size and retry.",
        ),
      );
    }
  },
};

export default uploadService;
