import { toast } from "vue3-toastify";

export function useDownloadFile() {
  // Faylni yuklab olish funksiyasi
  const downloadFile = async (
    data: string,
    fileName: string = "downloaded_file.xlsx",
  ) => {
    try {
      const urlBlob = window.URL.createObjectURL(new Blob([data]));

      const link = document.createElement("a");
      link.href = urlBlob;
      link.setAttribute("download", fileName); // Fayl nomi

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error(":", error);
      toast("Error", {
        type: "error",
      });
    }
  };

  return {
    downloadFile,
  };
}
