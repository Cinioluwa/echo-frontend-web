import api from "../axios.config";

const uploadService = {
  uploadFiles: async (files: File[], entityType: "ping" | "wave") => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("entityType", entityType);
    const res = await api.post<{ media: { id: number; url: string }[] }>(
      "/uploads",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return res.data.media;
  },
};

export default uploadService;
