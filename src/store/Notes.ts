import Trans from "@/i18n/translation";
// /src/store/notes.ts
import { ref, reactive } from "vue";
import { defineStore } from "pinia";
import { requestApi } from "@/api";
import { toast } from "vue3-toastify";
import type { INotes, INotesPoint, IFormNotesPoint, IQuery } from "@/types";
import type { Method } from "axios";

export const useNotesStore = defineStore("notes", () => {
  // Reaktiv holatlar
  const dialogs = reactive({ isAdd: false, isUpdate: false, isBlock: false });
  const formNotesPoint = reactive<IFormNotesPoint>({
    description: "",
    trade_point_id: 0,
    cityId: 0,
    districtId: 0,
  });
  const formNotes = reactive({ description: "" });
  const query = reactive<IQuery>({ pageCount: 0, pageNumber: 1, pageSize: 10 });

  const selectedIdNote = ref<number | undefined>();
  const notes = ref<INotes[]>([]);
  const notesPoint = ref<INotesPoint[]>([]);

  // API ma'lumotlarini olish
  const fetchData = async (url: string, setter: (data: any) => void) => {
    try {
      const { data } = await requestApi(url, "GET", query);
      setter(data.items);
      query.pageCount = data.pageCount;
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const handleSubmit = async (
    url: string,
    method: Method,
    form: any,
    refetch: () => void,
  ) => {
    try {
      await requestApi(url, method, {}, form);
      dialogs.isAdd = dialogs.isUpdate = false;
      // fetchData(url, (data) => (notes.value = data));
      refetch();
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const handleDelete = async (url: string, refetch: () => void) => {
    try {
      await requestApi(url, "DELETE");
      toast(Trans.t("messages.success"), { type: "success" });
      dialogs.isBlock = false;
      refetch();
    } catch (error) {
      console.error("Operation failed.");
    }
  };

  const selectNote = (row: INotes) => {
    selectedIdNote.value = row.id;
    formNotes.description = row.description;
    dialogs.isUpdate = true;
  };

  const selectNotePoint = (row: INotesPoint) => {
    selectedIdNote.value = row.id;
    Object.assign(formNotesPoint, row);
    dialogs.isUpdate = true;
  };

  return {
    dialogs,
    notes,
    notesPoint,
    selectedIdNote,
    formNotes,
    formNotesPoint,
    query,
    selectNote,
    selectNotePoint,
    handleSubmit,
    handleDelete,
    fetchData,
  };
});
