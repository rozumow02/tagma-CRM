import { FILTERS_SLUG } from "@/constants";
import { DEMO_MODE } from "@/demo/config";
import Trans from "@/i18n/translation";
import { useAuthStore } from "@/store/auth";
import { useUserData } from "@/store/UseAppDataStore";
import { useI18n } from "vue-i18n";
import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return {
      top: 0,
      left: 0,
      behavior: "smooth",
    };
  },
  routes: [
    { path: "/", redirect: "/city-manager", meta: { requiresAuth: true } },
    {
      path: "/:locale?",
      component: () => import("../layout/default.vue"),
      name: "layout",
      beforeEnter: [Trans.routeMiddleware],
      meta: { requiresAuth: true },
      children: [
        {
          path: "city-manager",
          name: "cityManager",
          component: () => import("../pages/CityManager.vue"),
        },
        {
          path: "trade-channels",
          name: "tradeChannels",
          component: () => import("../pages/Channels/TradeChannels.vue"),
        },
        {
          path: "setting-channels",
          name: "settingChannels",
          component: () => import("../pages/Channels/SettingChannels.vue"),
        },
        {
          path: "sales-categories",
          name: "salesCategories",
          component: () => import("../pages/SalesCategories.vue"),
        },
        {
          path: "products/product-types",
          name: "productTypes",
          component: () => import("../pages/Products/ProductTypes.vue"),
        },
        {
          path: "products/product-list",
          name: "productList",
          component: () => import("../pages/Products/ProductList.vue"),
        },
        {
          path: "drivers",
          name: "drivers",
          component: () => import("../pages/Trade-team/Drivers.vue"),
        },
        {
          path: "merchandisers",
          name: "merchandisers",
          component: () => import("../pages/Trade-team/Merchandiser.vue"),
        },
        {
          path: "ekspeditors",
          name: "ekspeditors",
          component: () => import("../pages/Trade-team/Ekspeditors.vue"),
        },
        {
          path: "ekspeditors/remainder/:id",
          name: "remainder",
          component: () => import("../pages/Trade-team/Remainder.vue"),
        },
        {
          path: "sales-agents",
          name: "agents",
          component: () => import("../pages/Trade-team/Agents.vue"),
        },
        {
          path: "sales-agents/dolg/:id",
          name: "dolg",
          component: () => import("../pages/Trade-team/dolg.vue"),
        },
        {
          path: "sales-agents/payment/:id",
          name: "agentPayment",
          component: () => import("../pages/Trade-team/Payment.vue"),
        },
        {
          path: "points-of-sale",
          name: "points",
          component: () => import("../pages/Point/Points.vue"),
        },
        {
          path: "points-of-transfer",
          name: "pointTransfer",
          component: () => import("../pages/Point/transfer.vue"),
        },
        {
          path: "points-of-sale/:id",
          name: "view",
          component: () => import("../pages/Point/Prosmotr.vue"),
        },
        {
          path: "routes",
          name: "routes",
          component: () => import("../pages/routes.vue"),
        },
        {
          path: "logs",
          name: "logs",
          component: () => import("../pages/Logs.vue"),
        },
        {
          path: "discounts",
          name: "discounts",
          component: () => import("../pages/Discounts.vue"),
        },
        {
          path: "gifts",
          name: "gifts",
          component: () => import("../pages/Gifts.vue"),
        },
        {
          path: "promotions",
          name: "promotions",
          component: () => import("../pages/Promotions.vue"),
        },
        {
          path: "promo",
          name: "promo",
          component: () => import("../pages/Promo.vue"),
        },
        {
          path: "plan",
          name: "plan",
          component: () => import("../pages/Plan.vue"),
        },
        {
          path: "furniture",
          name: "furniture",
          component: () => import("../pages/Furniture.vue"),
        },
        {
          path: "home",
          name: "home",
          component: () => import("../pages/Dashboard.vue"),
        },
        {
          path: "orders",
          name: "orders",
          component: () => import("../pages/Orders.vue"),
        },
        {
          path: "districts",
          name: "districts",
          component: () => import("../pages/Districts.vue"),
        },
        {
          path: "notes",
          name: "notes",
          component: () => import("../pages/Notes/Notes.vue"),
        },
        {
          path: "notes-point",
          name: "notesPoint",
          component: () => import("../views/Points/NPoint.vue"),
        },
        {
          path: "users",
          name: "users",
          component: () => import("../pages/Users.vue"),
        },
        {
          path: "manual",
          name: "manual",
          component: () => import("../pages/manual.vue"),
        },
        {
          path: "marketing",
          name: "marketing",
          component: () => import("../pages/Filters/main.vue"),
        },
        {
          path: "route-orders",
          name: "routeOrders",
          component: () => import("../pages/routeOrders.vue"),
        },
        // {
        //   path: "filters/main",
        //   name: "main",
        //   component: () => import("../pages/Filters/main.vue"),
        // },
        // {
        //   path: "filters/:slug",
        //   name: "filters",
        //   component: () => import("../pages/Filters/[slug].vue"),
        //   beforeEnter: (to, from, next) => {
        //     if (FILTERS_SLUG.includes(to.params.slug as string)) {
        //       next();
        //     } else {
        //       next({ path: "/404" }); // Noto'g'ri slug bo'lsa
        //     }
        //   },
        // },
        {
          path: "dilers",
          name: "dilers",
          component: () => import("../pages/Diler/Dilers.vue"),
        },
        {
          path: "sales",
          name: "sales",
          component: () => import("../pages/Sales.vue"),
        },
        // {
        //   path: "diler-products",
        //   name: "dilerProducts",
        //   component: () => import("../pages/Diler/Products.vue"),
        // },
        {
          path: "diler-info-products",
          name: "dilerInfoProducts",
          component: () => import("../pages/Diler/DInformationForProducts.vue"),
        },
        {
          path: "diler-orders",
          name: "dilerOrders",
          component: () => import("../pages/Diler/Orders.vue"),
        },
        {
          path: "total-sales",
          name: "totalSales",
          component: () => import("../pages/TotalSales.vue"),
        },
        {
          path: "remainders",
          name: "remainders",
          component: () => import("../pages/Remainder.vue"),
        },

        {
          path: "404",
          component: () => import("../pages/404.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../pages/Login.vue"),
    },
    {
      path: "/:catchAll(.*)",
      component: () => import("../pages/404.vue"),
    },
    {
      path: "/test",
      component: () => import("../pages/test.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (DEMO_MODE) {
    if (typeof to.name === "string" && ["totalSales", "promotions", "routeOrders"].includes(to.name)) {
      return next();
    }
    return next({ name: "totalSales", replace: true });
  }
  const { getUserData } = useUserData();
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !getUserData("TOKEN")
  ) {
    return next({ name: "login" }); // Login sahifasiga yo‘naltirish va `return` bilan to'xtatish
  }

  next();
});

export default router;
