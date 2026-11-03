<script setup lang="ts">
import { requestApi } from "@/api";
import HorizontalFilter from "@/components/filter/horizontalFilter.vue";
import Header from "@/components/main/Header.vue";
import Trans from "@/i18n/translation";
import { useNotesStore } from "@/store/Notes";
import type {
  FilterOption,
  IFormOption,
  INotesPoint,
  ISelectAll,
} from "@/types";
import { resetObject } from "@/utils/utils";
import Add from "@/views/Dynamic/add.vue";
import Block from "@/views/Dynamic/block.vue";
import Table from "@/views/Dynamic/Table.vue";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, reactive, ref, toRef, watch } from "vue";
import { useRoute } from "vue-router";
const storeNotes = useNotesStore();
const { dialogs, formNotesPoint, query, notesPoint, selectedIdNote } =
  storeToRefs(storeNotes);

const headers = [
  { text: "index", value: "index" },
  { text: "points.code", value: "trade_point_code" },
  { text: "note", value: "description" },
  { text: "point", value: "trade_point" },
  { text: "location", value: "location" },
  { text: "create_at", value: "created_at" },
  { text: "action", value: "action" },
];

const selected = reactive({
  cityId: 0,
  districtId: 0,
});
const allDistricts = ref<ISelectAll[]>([]);
const allCities = ref<ISelectAll[]>([]);
watch(
  () => formNotesPoint.value.cityId,
  async (newValue) => {
    if (newValue)
      try {
        const { data } = await requestApi(
          `points/districts?cityId=${newValue}`,
        );
        allDistricts.value = data;
      } catch (error) {
        console.error("Operation failed.");
      }
  },
);
watch(
  () => formNotesPoint.value.districtId,
  async (newValue) => {
    if (newValue)
      try {
        const { data } = await requestApi(
          `routes/points?districtId=${newValue}`,
        );
        allPoints.value = data;
      } catch (error) {
        console.error("Operation failed.");
      }
  },
);
const data = computed<IFormOption[]>(() => [
  {
    type: "select",
    model: "cityId",
    label: "city",
    options: allCities.value,
  },
  {
    type: "select",
    model: "districtId",
    label: "district",
    options: allDistricts.value,
  },
  {
    type: "select",
    model: "trade_point_id",
    label: "point",
    options: allPoints.value,
    filterable: true,
  },
  {
    model: "description",
    label: "note",
    type: "input",
  },
]);

const data2 = computed<IFormOption[]>(() => [
  {
    model: "description",
    label: "note",
    type: "input",
  },
]);
interface IDropdowns {
  title: string;
}
const route = useRoute();
const pointId = computed(() => {
  return route.params.id;
});
const dropdowns: IDropdowns[] = [{ title: "edit" }, { title: "delete" }];

const changePage = (page: number) => {
  query.value.pageNumber = page;
  // storeNotes.fetchData("notes", (data) => (notesPoint.value = data));
  refetchNotes();
};

const clickByOption = (row: INotesPoint, item?: string) => {
  selectedIdNote.value = row.id;
  if (item == "edit") {
    // Object.assign(formNotesPoint.value, row);
    formNotesPoint.value.cityId = row.city_id;
    formNotesPoint.value.districtId = row.disctrict_id;
    formNotesPoint.value.trade_point_id = row.trade_point_id;
    formNotesPoint.value.description = row.description;

    selected.cityId = row.city_id;
    selected.districtId = row.district_id;
    dialogs.value.isUpdate = true;
  } else if (item == "delete") {
    dialogs.value.isBlock = true;
  }
};
onBeforeMount(() => {
  if (!pointId.value) getAllOptions();
  refetchNotes();
});

const allPoints = ref<ISelectAll[]>([]);

const getAllOptions = async () => {
  try {
    const { data } = await requestApi("points/cities");
    allCities.value = data;
  } catch (error) {
    console.error("Operation failed.");
  }
};

const refetchNotes = () => {
  storeNotes.fetchData(
    `notes/point?tradePointId=${pointId.value || null}`,
    (data) => (notesPoint.value = data),
  );
  if (pointId.value)
    formNotesPoint.value.trade_point_id = Number(pointId.value);
};
const clearObject = () => {
  resetObject(formNotesPoint.value);
  if (pointId.value)
    formNotesPoint.value.trade_point_id = Number(pointId.value);
};

const filterNPoint = computed<FilterOption[]>(() => [
  {
    type: "input",
    model: "code",
    placeholder: Trans.t("points.code"),
  },
]);
</script>

<template>
  <div class="border rounded-lg">
    <Header :title="Trans.t('notes.points')">
      <Add
        :data="formNotesPoint"
        :forms="pointId ? data2 : data"
        label="notes.add"
        @clear-object="clearObject"
        @update-forms="
          storeNotes.handleSubmit(
            `notes/points?trade_point_id=${formNotesPoint.trade_point_id || ''}&description= ${
              formNotesPoint.description || ''
            }`,
            'GET',
            {},
            refetchNotes,
          )
        "
        add
        v-model="dialogs.isAdd"
      />
    </Header>
    <HorizontalFilter
      :query="query"
      :filters="filterNPoint"
      @update-query="refetchNotes"
    />
    <Table
      :headers="headers"
      :rows="notesPoint"
      :dropdowns="dropdowns"
      @click-by-id="clickByOption"
    >
      <template #dialog="{ row }">
        <Add
          v-if="row.id === selectedIdNote"
          :data="formNotesPoint"
          :forms="pointId ? data2 : data"
          label="notes.update"
          @update-forms="
            storeNotes.handleSubmit(
              `notes/point/${row.id}`,
              'PUT',
              formNotesPoint,
              refetchNotes,
            )
          "
          v-model="dialogs.isUpdate"
        ></Add>
        <Block
          v-model="dialogs.isBlock"
          dialog-type="delete"
          @submit="
            storeNotes.handleDelete(`notes/point/${row.id}`, refetchNotes)
          "
        ></Block>
      </template>
    </Table>
  </div>
  <Pagination
    v-if="query.pageCount"
    class="mt-4"
    :current-page="query.pageNumber"
    :total-pages="query.pageCount"
    @page-change="changePage"
  />
</template>
