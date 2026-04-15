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
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("entityType", entityType);
    const res = await api.post<{ media: UploadedMedia[] }>(
      "/uploads",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data.media;
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
