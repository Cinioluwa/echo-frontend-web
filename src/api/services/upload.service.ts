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
};

export default uploadService;
