import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/Home.vue";
const role = localStorage.getItem("role");

let routes = [
  {
    path: "/:catchAll(.*)",
    name: "notFound",
    meta: { requiresAuth: false, title: "Sahifa Topilmadi" },
    component: () => import("../components/NotFound/NotFound.vue"),
  },
  {
    path: "/",
    name: "login",
    meta: { requiresAuth: false, title: "Login" },
    component: () => import("../views/Login/Login.vue"),
  },
  {
    path: "/home",
    name: "home",
    meta: { requiresAuth: false, title: "Loading" },
    component: HomeView,
  },
  {
    path: "/transport",
    name: "transport",
    meta: { requiresAuth: true, title: "Transport" },
    component: () => import("../views/Transport/Transport.vue"),
  },
  {
    path: "/transfer",
    name: "transfer",
    meta: { requiresAuth: true, title: "Transfer" },
    component: () => import("../views/Logistika/Transfer.vue"),
  },
  {
    path: "/branch-transfer",
    name: "branch-transfer",
    meta: { requiresAuth: true, title: "Transfer" },
    component: () => import("../components/table/BranchTransfer.vue"),
  },
  {
    path: "/main",
    name: "main",
    meta: { requiresAuth: true, title: "Asosiy" },
    component: () => import("../views/Main.vue"),
  },
  {
    path: "/ombor/:id",
    name: "ombor",
    meta: { requiresAuth: true, title: "Ombor" },
    component: () => import("../views/Omborlar/Ombor.vue"),
  },
  {
    path: "/ombor-taminotlar/:id",
    name: "ombor-taminotlar",
    meta: { requiresAuth: true, title: "Ombor ta'minotlari" },
    component: () => import("../views/Omborlar/omborTaminotlar.vue"),
  },
  {
    path: "/ombor-buyurtmalar/:id",
    name: "ombor-buyurtmalar",
    meta: { requiresAuth: true, title: "Ombor Buyurtmalar" },
    component: () => import("../views/Omborlar/omborBuyurtmalar.vue"),
  },
  {
    path: "/omborlar",
    name: "omborlar",
    meta: { requiresAuth: true, title: "Omborlar", role: "admin" },
    component: () => import("../views/Omborlar/Omborlar.vue"),
  },
  {
    path: "/filiallar",
    name: "filiallar",
    meta: { requiresAuth: true, title: "Filiallar" },
    component: () => import("../views/Filiallar/Filiallar.vue"),
  },
  {
    path: "/filial/:id",
    name: "filial",
    meta: { requiresAuth: true, title: "Filial", role: "admin" },
    component: () => import("../views/Filiallar/FilialHistory.vue"),
  },
  {
    path: "/statistic/:id",
    name: "statistic",
    meta: { requiresAuth: true, title: "Hisobotlar" },
    component: () => import("../views/Statistic/Statistic.vue"),
  },
  {
    path: "/statistics",
    name: "statistics",
    meta: { requiresAuth: true, title: "Hisobotlar", role: "admin" },
    component: () => import("../views/AdminStatistic/Statistic.vue"),
  },
  {
    path: "/kpi",
    name: "kpi",
    meta: { requiresAuth: true, title: "Kpi" },
    component: () => import("../views/Kpi/Kpi.vue"),
  },
  {
    path: "/hodimlar/:id",
    name: "hodimlar",
    meta: { requiresAuth: true, title: "Hodimlar" },
    component: () => import("../views/Hodimlar/Hodimlar.vue"),
  },
  {
    path: "/admin-hodimlar",
    name: "admin-hodimlar",
    meta: { requiresAuth: true, title: "Hodimlar" },
    component: () => import("../views/Admin/Hodimlar.vue"),
  },
  {
    path: "/logistika-hodimlar",
    name: "logistika-hodimlar",
    meta: { requiresAuth: true, title: "Hodimlar" },
    component: () => import("../views/Logistika/Hodimlar.vue"),
  },
  {
    path: "/ombor-hodimlar/:id",
    name: "ombor-hodimlar",
    meta: { requiresAuth: true, title: "Hodimlar" },
    component: () => import("../views/Omborlar/Hodimlar.vue"),
  },
  {
    path: "/hodim/:id",
    name: "hodim",
    meta: { requiresAuth: true, title: "Hodim haqida" },
    component: () => import("../views/Hodimlar/HodimHaqida.vue"),
  },
  {
    path: "/hodim-tarix/:id",
    name: "hodim-tarix",
    meta: { requiresAuth: true, title: "Hodim to'lov tarixi" },
    component: () => import("../views/Hodimlar/Tolovlar.vue"),
  },
  {
    path: "/davomat",
    name: "davomat",
    meta: { requiresAuth: true, title: "Davomat" },
    component: () => import("../views/Davomat/Davomat.vue"),
  },
  {
    path: "/mijozlar",
    name: "mijozlar",
    meta: { requiresAuth: true, title: "Mijozlar" },
    component: () => import("../views/Mijozlar/Mijozlar.vue"),
  },
  {
    path: "/mijoz/:id",
    name: "mijoz",
    meta: { requiresAuth: true, title: "Mijoz" },
    component: () => import("../views/Mijozlar/Mijoz.vue"),
  },
  {
    path: "/nasiyalar",
    name: "Nasiyalar",
    meta: { requiresAuth: true, title: "Nasiyalar" },
    component: () => import("../views/Nasiya/Nasiyalar.vue"),
  },
  {
    path: "/nasiya/:id/:order_id",
    name: "Nasiya",
    meta: { requiresAuth: true, title: "Nasiyalar" },
    component: () => import("../views/Nasiya/NasiyaTarix.vue"),
  },
  {
    path: "/return",
    name: "Return",
    meta: { requiresAuth: true, title: "Mahsulot qaytarb olish" },
    component: () => import("../views/Vozvrat/Vozvrat.vue"),
  },
  {
    path: "/taminotchi/:id",
    name: "taminotchi",
    meta: { requiresAuth: true, title: "Ta'minotchi" },
    component: () => import("../views/Ta'minotchilar/Ta'minotchi.vue"),
  },
  {
    path: "/taminotchilar",
    name: "taminotchilar",
    meta: { requiresAuth: true, title: "Ta'minotchilar" },
    component: () => import("../views/Ta'minotchilar/Ta'minotchilar.vue"),
  },
  {
    path: "/taminotlar",
    name: "taminotlar",
    meta: { requiresAuth: true, title: "Ta'minotlar" },
    component: () => import("../views/Ta'minotchilar/Ta'minotlar.vue"),
  },
  {
    path: "/taminot/:id",
    name: "taminot",
    meta: { requiresAuth: true, title: "Ta'minot" },
    component: () => import("../views/Ta'minotchilar/Ta'minot.vue"),
  },
  {
    path: "/taminot/:id",
    name: "taminot",
    meta: { requiresAuth: true, title: "Ta'minot", role: "branch_admin" },
    component: () => import("../views/Ta'minotchilar/Ta'minotForBranch.vue"),
  },
  {
    path: "/categories",
    name: "categories",
    meta: { requiresAuth: true, title: "Kategoriyalar" },
    component: () => import("../views/Categories/Categories.vue"),
  },
  {
    path: "/revision/:id",
    name: "revision",
    meta: { requiresAuth: true, title: "Mahsulotlar qoldig'i" },
    component: () => import("../views/Revision/Revision.vue"),
  },
  {
    path: "/products",
    name: "products",
    meta: { requiresAuth: true, title: "Mahsulotlar" },
    component: () => import("../views/Mahsulotlar/Mahsulotlar.vue"),
  },
  {
    path: "/wanted-products",
    name: "wanted-products",
    meta: { requiresAuth: true, title: "Yetishmayotgan Mahsulotlar" },
    component: () =>
      import("../views/Mahsulotlar/YetishmayotganMahsulotlar.vue"),
  },
  {
    path: "/nomenclature",
    name: "nomenclature",
    meta: { requiresAuth: true, title: "Nomenklatura" },
    component: () => import("../views/Nomenklatura/nomenklatura.vue"),
  },
  {
    path: "/products-from-warehouse",
    name: "products-from-warehouse",
    meta: { requiresAuth: true, title: "Mahsulotlar" },
    component: () => import("../views/Mahsulotlar/ProductsFromWarehouse.vue"),
  },
  {
    path: "/categoryProducts/:id",
    name: "categoryProducts",
    meta: {
      requiresAuth: true,
      title: "Kategoriya mahsulotlari",
      role: "branch_admin",
    },
    component: () => import("../views/Categories/CategoryProducts.vue"),
  },
  {
    path: "/expense",
    name: "expense",
    meta: { requiresAuth: true, title: "Chiqim" },
    component: () => import("../views/Chiqim/Expense.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    meta: { requiresAuth: true, title: "Sozlamalar" },
    component: () => import("../views/Setting.vue"),
  },
  {
    path: "/kassa",
    name: "kassa",
    meta: { requiresAuth: true, title: "Buyurtma" },
    component: () => import("../views/Kassa/Kassa.vue"),
  },
  {
    path: "/pre-order",
    name: "pre-order",
    meta: { requiresAuth: true, title: "Oldindan buyurtma" },
    component: () => import("../views/PreOrder/preOrder.vue"),
  },
  {
    path: "/pre-orders",
    name: "pre-orders",
    meta: { requiresAuth: true, title: "Oldindan buyurtmalar" },
    component: () => import("../views/PreOrder/preOrders.vue"),
  },
  {
    path: "/services",
    name: "services",
    meta: { requiresAuth: true, title: "Servislar" },
    component: () => import("../views/Service/services.vue"),
  },
  {
    path: "/cashiers",
    name: "cashiers",
    meta: { requiresAuth: true, title: "Kassalar" },
    component: () => import("../views/Cashier/Cashiers.vue"),
  },
  {
    path: "/cashier/:id",
    name: "cashier",
    meta: { requiresAuth: true, title: "Kassa" },
    component: () => import("../views/Cashier/Cashier.vue"),
  },
  {
    path: "/cashierHistory/:id",
    name: "cashierHistory",
    meta: { requiresAuth: true, title: "Kassa Tarix" },
    component: () => import("../views/Cashier/CashierHistory.vue"),
  },
  {
    path: "/admin/:id",
    name: "admin",
    meta: { requiresAuth: true, title: "Admin" },
    component: () => import("../views/Admin/Admin.vue"),
  },
  {
    path: "/benefit",
    name: "benefit",
    meta: { requiresAuth: true, title: "Foydani hisoblash" },
    component: () => import("../views/Foyda/Foyda.vue"),
  },
];

routes = routes.filter((item) => {
  if (item.meta.role) {
    return item.meta.role == role;
  } else {
    return item;
  }
});

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem("access_token") !== null;
  const role = localStorage.getItem("role");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!loggedIn) {
      next("/");
    }
  }
  next();
});

export default router;
