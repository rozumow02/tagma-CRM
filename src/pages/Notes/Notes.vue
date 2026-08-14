<script setup lang="ts">
import Header from "@/components/main/Header.vue";
import Trans from "@/i18n/translation";
import { useNotesStore } from "@/store/Notes";
import type { IFormOption, INotes } from "@/types";
import { resetObject } from "@/utils/utils";
import Add from "@/views/Dynamic/add.vue";
import Block from "@/views/Dynamic/block.vue";
import Table from "@/views/Dynamic/Table.vue";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
const storeNotes = useNotesStore();
const {
  dialogs,
  notes,
  formNotes,
  formNotesPoint,
  query,
  notesPoint,
  selectedIdNote,
} = storeToRefs(storeNotes);

const headers = [
  { text: "index", value: "index" },
  { text: "note", value: "description" },
  { text: "action", value: "action" },
];

const data = computed<IFormOption[]>(() => [
  {
    model: "description",
    label: "note",
    type: "input",
  },
]);
interface IDropdowns {
  title: string;
}
const dropdowns: IDropdowns[] = [{ title: "edit" }, { title: "delete" }];

const changePage = (page: number) => {
  query.value.pageNumber = page;
  storeNotes.fetchData("notes", (data) => (notes.value = data));
};

const clickByOption = (row: INotes, item?: string) => {
  selectedIdNote.value = row.id;
  if (item == "edit") {
    formNotes.value.description = row.description;
    dialogs.value.isUpdate = true;
  } else if (item == "delete") {
    dialogs.value.isBlock = true;
  }
};
onBeforeMount(() => {
  refetchNotes();
});

const refetchNotes = () => {
  storeNotes.fetchData("notes", (data) => (notes.value = data));
};
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('menuItems.notes')">
      <Add
        :data="formNotes"
        :forms="data"
        label="notes.add"
        @clear-object="resetObject(formNotes)"
        @update-forms="
          storeNotes.handleSubmit('notes', 'POST', formNotes, refetchNotes)
        "
        add
        v-model="dialogs.isAdd"
      />
    </Header>
    <Table
      :headers="headers"
      :rows="notes"
      :dropdowns="dropdowns"
      @click-by-id="clickByOption"
    >
      <template #dialog="{ row }">
        <Add
          v-if="row.id === selectedIdNote"
          :data="formNotes"
          :forms="data"
          label="notes.update"
          @update-forms="
            storeNotes.handleSubmit(
              `notes/${row.id}`,
              'PUT',
              formNotes,
              refetchNotes,
            )
          "
          v-model="dialogs.isUpdate"
        ></Add>
        <Block
          v-model="dialogs.isBlock"
          dialog-type="delete"
          @submit="storeNotes.handleDelete(`notes/${row.id}`, refetchNotes)"
        ></Block>
      </template>
    </Table>
  </div>
  <Pagination
    class="mt-4"
    v-if="query.pageCount"
    :current-page="query.pageNumber"
    :total-pages="query.pageCount"
    @page-change="changePage"
  />
</template>
