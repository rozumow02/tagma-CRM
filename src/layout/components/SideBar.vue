<template>
  <aside
    class="min-w-72 h-screen bg-white flex flex-col text-gray3 font-medium"
  >
    <!-- Wordmark -->
    <div class="border-b flex justify-center items-center h-[60px]">
      <h1 class="text-p1 font-sans font-medium text-main">Distribution CRM</h1>
    </div>

    <p v-if="DEMO_MODE" class="border-b px-4 py-3 text-xs leading-relaxed" role="note">
      Portfolio demo · synthetic data · changes reset on reload
    </p>
    <el-scrollbar height="calc(100vh- 220px)" class="">
      <!-- Navigation -->
      <nav class="flex-1">
        <ul class="p-3 capitalize relative">
          <li v-for="item in menuItems" :key="item.id">
            <RouterLink
              v-if="!item.children"
              v-permission="[isAdmin === 'admin' ? isAdmin : item.isAdmin]"
              :to="`/${item.path}`"
              @click="toggleActive(item)"
              :class="[
                'flex items-center px-4 py-2 my-2 cursor-pointer rounded-md',
                item.active ? 'bg-main text-white' : 'hover:bg-gray-100',
              ]"
            >
              <div
                v-if="item.active"
                class="w-1 h-10 bg-main absolute left-0 rounded-xl"
              ></div>
              <span>{{ t(`menuItems.${item.nameKey}`) }} </span>
            </RouterLink>

            <div
              v-else
              @click="toggleActive(item)"
              :class="[
                'flex items-center px-4 py-2 my-2 cursor-pointer rounded-md',
                item.active ? 'bg-main text-white' : 'hover:bg-gray-100',
              ]"
            >
              <div
                v-if="item.active"
                class="w-1 h-10 bg-main absolute left-0 rounded-xl"
              ></div>
              <span class="capitalize"
                >{{ t(`menuItems.${item.nameKey}`) }}
              </span>
              <chevron-down-icon
                v-if="item.children"
                :class="[
                  'ml-auto w-4 h-4 transition-transform',
                  item.expanded ? 'transform rotate-180' : '',
                ]"
              />
            </div>

            <ul v-if="item.children && item.expanded">
              <li v-for="child in item.children" :key="child.id" class="">
                <RouterLink
                  :to="`/${child.path}`"
                  v-permission="[isAdmin === 'admin' ? isAdmin : child.isAdmin]"
                  @click="toggleActive(child)"
                  :class="[
                    'flex items-center px-2 py-2 cursor-pointer',
                    child.active ? 'text-text' : 'hover:bg-gray-100',
                  ]"
                >
                  <div class="flex items-center justify-center w-auto">
                    <div
                      class="w-1.5 rounded-[50%] h-1.5"
                      :class="child.active ? 'bg-main' : 'bg-gray3'"
                    ></div>
                  </div>
                  <span class="ml-4"
                    >{{ t(`menuItems.${child.nameKey}`) }}
                  </span>
                </RouterLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </el-scrollbar>
    <!-- Footer -->
    <div class="p-5 border-t flex justify-between items-center">
      <button v-if="!DEMO_MODE" class="hover:text-gray-800 flex items-center" @click="logout">
        <log-out-icon class="w-5 h-5 mr-2" />
        <RouterLink to="/login">{{ t("exit") }}</RouterLink>
      </button>
      <button
        v-if="Trans.currentLocale == 'ru'"
        class="hover:text-gray-800 flex item"
        @click="Trans.switchLanguage('tm')"
      >
        <span class="capitalize">{{ t("locale.ru") }}</span>
        <ChevronRight :size="22" class="ml-2" />
      </button>

      <button
        v-if="Trans.currentLocale == 'tm'"
        class="hover:text-gray-800 flex item"
        @click="Trans.switchLanguage('ru')"
      >
        <span class="capitalize">{{ t("locale.tm") }}</span>
        <ChevronRight :size="22" class="ml-2" />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { DEMO_MODE } from "@/demo/config";
import { ref, onMounted } from "vue";
import { ElScrollbar } from "element-plus";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/store/auth";
import {
  HomeIcon,
  ShoppingCartIcon,
  PackageIcon,
  UsersIcon,
  MapPinIcon,
  FilterIcon,
  TruckIcon,
  FileTextIcon,
  ChevronDownIcon,
  LogOutIcon,
  ChevronRight,
} from "lucide-vue-next";
import Trans from "@/i18n/translation";
import { useI18n } from "vue-i18n";
import type { StorageKeys } from "@/constants/storageKeys";
import type { IUserType } from "@/types";
import { useUserData } from "@/store/UseAppDataStore";
const { t, setLocaleMessage } = useI18n();
const { logout } = useAuthStore();
const { getUserData } = useUserData();
const isAdmin = getUserData("ROLE");
const route = useRoute();

interface MenuItem {
  id: number;
  name?: string;
  icon?: any;
  active: boolean;
  expanded?: boolean;
  children?: MenuItem[];
  parentId?: number;
  nameKey: string;
  path: string;
  isAdmin?: IUserType;
}

const menuItems = ref<MenuItem[]>([
  {
    id: 2,
    name: "Каналы торговли",
    nameKey: "input_data",
    icon: ShoppingCartIcon,
    active: false,
    path: "channels",
    expanded: false,
    isAdmin: "admin",
    children: [
      {
        id: 15,
        nameKey: "users",
        active: false,
        path: "users",
        parentId: 2,
        isAdmin: "admin",
      },
      {
        id: 1,
        name: "Города",
        nameKey: "cities",
        icon: HomeIcon,
        active: false,
        path: "city-manager",
        parentId: 2,
        isAdmin: "admin",
      },
      {
        id: 13,
        name: "Districts",
        nameKey: "districts",
        icon: HomeIcon,
        active: false,
        path: "districts",
        parentId: 2,
        isAdmin: "admin",
      },
      {
        id: 80,
        nameKey: "tradeChannels",
        active: false,
        name: "",
        path: "trade-channels",
        parentId: 2,
        isAdmin: "admin",
      },
      {
        id: 81,
        nameKey: "settingChannels",
        active: false,
        name: "",
        path: "setting-channels",
        parentId: 2,
        isAdmin: "viewer",
      },
      {
        id: 3,
        name: "Категории продаж",
        nameKey: "salesCategories",
        icon: PackageIcon,
        active: false,
        path: "sales-categories",
        parentId: 2,
        isAdmin: "admin",
      },
      {
        id: 62,
        name: "Типы продукции",
        nameKey: "productTypes",
        active: false,
        path: "products/product-types",
        parentId: 2,
        isAdmin: "admin",
      },
      {
        id: 63,
        nameKey: "manual",
        active: false,
        path: "manual",
        parentId: 2,
        isAdmin: "viewer",
      },
      {
        id: 64,
        nameKey: "routes",
        active: false,
        path: "route-orders",
        parentId: 2,
        isAdmin: "viewer",
      },
      {
        id: 65,
        nameKey: "plan",
        active: false,
        path: "plan",
        parentId: 2,
        isAdmin: "viewer",
      },
      {
        id: 66,
        nameKey: "furnitures",
        active: false,
        path: "furniture",
        parentId: 2,
        isAdmin: "viewer",
      },
    ],
  },
  {
    id: 4,
    name: "Рабочие",
    nameKey: "workers",
    icon: UsersIcon,
    active: false,
    expanded: false,
    path: "workers",
    isAdmin: "admin",
    children: [
      {
        id: 41,
        name: "Торговые представители",
        nameKey: "agents",
        active: false,
        parentId: 4,
        path: "sales-agents",
        isAdmin: "admin",
      },
      {
        id: 42,
        name: "Экспедиторы",
        nameKey: "ekspeditors",
        active: false,
        parentId: 4,
        path: "ekspeditors",
        isAdmin: "admin",
      },
      {
        id: 43,
        name: "Водители",
        nameKey: "drivers",
        active: false,
        parentId: 4,
        path: "drivers",
        isAdmin: "admin",
      },
      {
        id: 44,
        name: "Merchandisers",
        nameKey: "merchandisers",
        active: false,
        parentId: 4,
        path: "merchandisers",
        isAdmin: "admin",
      },
    ],
  },
  {
    id: 5,
    name: "Торговые точки",
    nameKey: "pointsOfSale",
    icon: MapPinIcon,
    active: false,
    path: "points-of-sale",
    isAdmin: "admin",
    children: [
      {
        id: 51,
        name: "Торговые точки",
        nameKey: "all",
        active: false,
        parentId: 5,
        path: "points-of-sale",
        isAdmin: "admin",
      },
      {
        id: 52,
        name: "Перекидка",
        nameKey: "transfer",
        active: false,
        parentId: 5,
        path: "points-of-transfer",
        isAdmin: "admin",
      },
    ],
  },
  {
    id: 6,
    name: "Список продукции",
    nameKey: "products",
    active: false,
    parentId: 6,
    path: "products/product-list",
    isAdmin: "admin",
  },
  {
    id: 18,
    nameKey: "sales",
    active: false,
    path: "sales",
    isAdmin: "admin",
  },

  {
    id: 19,
    nameKey: "total_sales",
    path: "total-sales",
    active: false,
    isAdmin: "admin",
  },
  {
    id: 17,
    nameKey: "marketing",
    path: "marketing",
    active: false,
    isAdmin: "admin",
  },
  // {
  //   id: 7,
  //   name: "Фильтры",
  //   nameKey: "filters",
  //   icon: FilterIcon,
  //   active: false,
  //   expanded: false,
  //   path: "filters",
  //   isAdmin: "admin",
  //   children: [
  //     {
  //       id: 71,
  //       name: "Все",
  //       nameKey: "all",
  //       active: false,
  //       parentId: 7,
  //       path: "filters/main",
  //       isAdmin: "admin",
  //     },
  //     {
  //       id: 72,
  //       name: "Дистрибуция",
  //       nameKey: "distribution",
  //       active: false,
  //       parentId: 7,
  //       path: "filters/distribution",
  //       isAdmin: "admin",
  //     },
  //     {
  //       id: 73,
  //       name: "Выставленность",
  //       nameKey: "display",
  //       active: false,
  //       parentId: 7,
  //       path: "filters/display",
  //       isAdmin: "admin",
  //     },
  //     {
  //       id: 74,
  //       name: "Распродано",
  //       nameKey: "soldOut",
  //       active: false,
  //       parentId: 7,
  //       path: "filters/soldOut",
  //       isAdmin: "admin",
  //     },
  //   ],
  // },
  // {
  //   id: 8,
  //   name: "Маршруты",
  //   nameKey: "routes",
  //   icon: TruckIcon,
  //   active: false,
  //   path: "routes",
  //   isAdmin: "admin",
  // },
  {
    id: 9,
    name: "Заказы",
    nameKey: "orders",
    icon: FileTextIcon,
    active: false,
    path: "orders",
    isAdmin: "admin",
  },
  {
    id: 11,
    name: "Торговые точки",
    nameKey: "discounts_promo",
    active: false,
    path: "discount-promo",
    isAdmin: "admin",
    children: [
      {
        id: 12,
        name: "Arzanladys",
        nameKey: "discounts",
        active: false,
        path: "discounts",
        isAdmin: "admin",
      },

      {
        id: 16,
        name: "aksiyalar",
        nameKey: "promotions",
        active: false,
        path: "promotions",
        isAdmin: "admin",
      },
      {
        id: 20,
        name: "promo",
        nameKey: "promo",
        active: false,
        path: "promo",
        isAdmin: "admin",
      },
    ],
  },
  {
    id: 12,
    name: "Podarka",
    nameKey: "gifts",
    active: false,
    path: "gifts",
    isAdmin: "admin",
  },
  {
    id: 14,
    name: "Note",
    nameKey: "notes",
    active: false,
    path: "notes",
    expanded: false,
    isAdmin: "admin",
    children: [
      {
        parentId: 14,
        nameKey: "notes",
        name: "Notes",
        active: false,
        path: "notes",
        id: 15,
        isAdmin: "admin",
      },
      {
        parentId: 14,
        nameKey: "notes_point",
        name: "Notes",
        active: false,
        path: "notes-point",
        id: 16,
        isAdmin: "admin",
      },
    ],
  },
  {
    id: 10,
    name: "Logs",
    nameKey: "logs",
    icon: FileTextIcon,
    active: false,
    path: "logs",
    isAdmin: "admin",
  },
  {
    id: 15,
    nameKey: "dilers",
    active: false,
    path: "dilers",
    expanded: false,
    isAdmin: "admin",
    children: [
      {
        id: 150,
        active: false,
        path: "dilers",
        nameKey: "mutual_settlements",
        parentId: 15,
        isAdmin: "admin",
      },
      {
        id: 151,
        active: false,
        path: "diler-info-products",
        nameKey: "shipments_SKUs_pcs",
        parentId: 15,
        isAdmin: "admin",
      },
      {
        id: 152,
        active: false,
        path: "diler-orders",
        nameKey: "shipmentscurrency_man",
        parentId: 15,
        isAdmin: "admin",
      },
    ],
  },
  {
    id: 17,
    nameKey: "remainders",
    active: false,
    path: "remainders",
    isAdmin: "admin",
  },
]);

if (DEMO_MODE) {
  menuItems.value = [
    { id: 1, nameKey: "total_sales", path: "total-sales", active: false },
    { id: 2, nameKey: "promotions", path: "promotions", active: false },
    { id: 3, nameKey: "routes", path: "route-orders", active: false },
    { id: 4, nameKey: "pointsOfSale", path: "points-of-sale", active: false },
  ];
}

const toggleActive = (item: MenuItem) => {
  if (item.children) {
    item.expanded = !item.expanded;
    menuItems.value.forEach((menuitem) => {
      menuitem.active = false;
    });
    item.active = true;
  } else {
    menuItems.value.forEach((menuItem) => {
      menuItem.active = false;
      if (menuItem.children) {
        menuItem.children.forEach((child) => {
          child.active = false;
          if (menuItem.id == item.parentId) menuItem.active = true;
        });
      }
    });
    item.active = true;
  }
};
const setActiveItemOnLoad = () => {
  const currentPath = route.path.replace(/^\//, ""); // Birinchi '/' belgisi olib tashlanadi

  menuItems.value.forEach((item) => {
    if (item.children) {
      item.children.forEach((child) => {
        if (currentPath == child.path) {
          child.active = true;
          item.active = true;
          item.expanded = true;
        }
      });
    } else {
      if (currentPath == item.path) {
        item.active = true;
      }
    }
  });
};

onMounted(() => {
  setActiveItemOnLoad();
});
</script>
