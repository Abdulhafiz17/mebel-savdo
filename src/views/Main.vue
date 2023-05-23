<template>
  <h3><span class="fa fa-home" /> Asosiy</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      {{ $util.currency(user?.balance) + " so'm" }}
    </div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <div class="row">
    <div class="col-md-3 col-6 my-1" v-for="item in links" :key="item">
      <router-link :to="item.link" class="card shadow h-100">
        <div class="card-body">
          <i class="fa-2x px-1" :class="item.icon" />
          <i v-if="item.icon_2" class="fa-2x px-1" :class="item.icon_2" />
          <hr />
          <strong>{{ item.title }}</strong>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
export default {
  name: "Main",
  data() {
    return {
      role: localStorage["role"],
      user: null,
      admin: [
        // {
        //   link: `/statistics`,
        //   icon: "fa fa-chart-line",
        //   title: "Hisobotlar",
        // },
        {
          link: `/filiallar`,
          icon: "fa fa-code-branch",
          title: "Filiallar",
        },
        {
          link: `/omborlar`,
          icon: "fa fa-warehouse",
          title: "Omborlar",
        },
        {
          link: `/mijozlar`,
          icon: "fa fa-handshake",
          title: "Mijozlar",
        },
        {
          link: `/pre-orders`,
          icon: "fa fa-receipt",
          title: "Oldindan buyurtmalar",
        },
        {
          link: `/taminotlar`,
          icon: "fa fa-truck",
          title: "Ta'minot",
        },
        {
          link: `/taminotchilar`,
          icon: "fa fa-truck-loading",
          title: "Ta'minotchilar",
        },
        {
          link: `/cashiers`,
          icon: "fa fa-cash-register",
          title: "Kassalar",
        },
        {
          link: `/davomat`,
          icon: "fa fa-clipboard-check",
          title: "davomat",
        },
        {
          link: `/admin-hodimlar`,
          icon: "fa fa-user-group",
          title: "Hodimlar",
        },
        {
          link: `/products`,
          icon: "fa fa-box",
          title: "Mahsulotlar",
        },
        {
          link: `/products-from-warehouse`,
          icon: "fa fa-code-branch",
          icon_2: "fa fa-warehouse",
          title: "Filial ombordan so'ragan mahsulotlar",
        },
        {
          link: `/wanted-products`,
          icon: "fa fa-box",
          title: "Yetishmayotgan mahsulotlar",
        },
        {
          link: `/transfer`,
          icon: "fa fa-arrow-up",
          icon_2: "fa fa-arrow-down",
          title: "Transfer",
        },
        {
          link: `/settings`,
          icon: "fa fa-tools",
          title: "Sozlamalar",
        },
      ],
      warehouseman: [
        {
          link: `/ombor/${localStorage["branch_id"]}`,
          icon: "fa fa-warehouse",
          title: "Ombor",
        },
        {
          link: `/ombor-taminotlar/${localStorage["branch_id"]}`,
          icon: "fa fa-truck-loading",
          title: "Taminotlar",
        },
        {
          link: `/transfer`,
          icon: "fa fa-arrow-up",
          icon_2: "fa fa-arrow-down",
          title: "Transfer",
        },
        {
          link: `/pre-orders`,
          icon: "fa fa-receipt",
          title: "Oldindan buyurtmalar",
        },
        {
          link: `/`,
          icon: "fa fa-sign-out",
          title: "Chiqish",
        },
      ],
      logistika: [
        {
          link: `/davomat`,
          icon: "fa fa-clipboard-check",
          title: "davomat",
        },
        {
          link: `/logistika-hodimlar`,
          icon: "fa fa-user-group",
          title: "Hodimlar",
        },
        {
          link: `/transport`,
          icon: "fa fa-truck",
          title: "Transport",
        },
        {
          link: `/transfer`,
          icon: "fa fa-arrow-up",
          icon_2: "fa fa-arrow-down",
          title: "Transfer",
        },
        {
          link: `/pre-orders`,
          icon: "fa fa-receipt",
          title: "Oldindan buyurtmalar",
        },
        {
          link: `/settings`,
          icon: "fa fa-tools",
          title: "Sozlamalar",
        },
        {
          link: `/`,
          icon: "fa fa-sign-out",
          title: "Chiqish",
        },
      ],
      cashier: [
        {
          link: `/filiallar`,
          icon: "fa fa-code-branch",
          title: "Filiallar",
        },
        {
          link: `/cashiers`,
          icon: "fa fa-cash-register",
          title: "Kassalar",
        },
        {
          link: `/pre-orders`,
          icon: "fa fa-receipt",
          title: "Oldindan buyurtmalar",
        },
        {
          link: `/expense`,
          icon: "fa fa-wallet",
          title: "Chiqim",
        },
        {
          link: `/admin-hodimlar`,
          icon: "fa fa-user-group",
          title: "Hodimlar",
        },
        {
          link: `/`,
          icon: "fa fa-sign-out",
          title: "Chiqish",
        },
      ],
      worker: [
        {
          link: `/transport`,
          icon: "fa fa-truck",
          title: "Transport",
        },
        {
          link: `/transfer`,
          icon: "fa fa-arrow-up",
          icon_2: "fa fa-arrow-down",
          title: "Transfer",
        },
        {
          link: `/pre-orders`,
          icon: "fa fa-receipt",
          title: "Oldindan buyurtmalar",
        },
        {
          link: `/settings`,
          icon: "fa fa-tools",
          title: "Sozlamalar",
        },
        {
          link: `/`,
          icon: "fa fa-sign-out",
          title: "Chiqish",
        },
      ],
      ustanovshik: [
        {
          link: `/transport`,
          icon: "fa fa-truck",
          title: "Transport",
        },
        {
          link: `/transfer`,
          icon: "fa fa-arrow-up",
          icon_2: "fa fa-arrow-down",
          title: "Transfer",
        },
        {
          link: `/pre-orders`,
          icon: "fa fa-receipt",
          title: "Oldindan buyurtmalar",
        },
        {
          link: `/kpi?user_id=${localStorage["user_id"]}`,
          icon: "fa fa-file-invoice",
          title: "Kpi",
        },
        {
          link: `/settings`,
          icon: "fa fa-tools",
          title: "Sozlamalar",
        },
        {
          link: `/`,
          icon: "fa fa-sign-out",
          title: "Chiqish",
        },
      ],
      seller: [
        {
          link: `/hodim/${localStorage["user_id"]}`,
          icon: "fa fa-receipt",
          title: "Buyurtmalar",
        },
        {
          link: `/hodim-tarix/${localStorage["user_id"]}`,
          icon: "fa fa-history",
          title: "To'lov tarix",
        },
        {
          link: `/kpi?user_id=${localStorage["user_id"]}`,
          icon: "fa fa-file-invoice",
          title: "Kpi",
        },
        {
          link: `/settings`,
          icon: "fa fa-tools",
          title: "Sozlamalar",
        },
        {
          link: `/`,
          icon: "fa fa-sign-out",
          title: "Chiqish",
        },
      ],
      taminotchi: [
        {
          link: `/taminotlar`,
          icon: "fa fa-truck",
          title: "Ta'minot",
        },
        {
          link: `/taminotchilar`,
          icon: "fa fa-truck-loading",
          title: "Ta'minotchilar",
        },
        {
          link: `/wanted-products`,
          icon: "fa fa-box",
          title: "Yetishmayotgan mahsulotlar",
        },
        {
          link: `/settings`,
          icon: "fa fa-tools",
          title: "Sozlamalar",
        },
        {
          link: `/`,
          icon: "fa fa-sign-out",
          title: "Chiqish",
        },
      ],
      operator: [
        {
          link: `/transport`,
          icon: "fa fa-truck",
          title: "Magazindan  ketgan buyurtmalar",
        },
        {
          link: `/pre-orders`,
          icon: "fa fa-receipt",
          title: "Topshirilgan buyurtmalar",
        },
        {
          link: `/settings`,
          icon: "fa fa-tools",
          title: "Sozlamalar",
        },
        {
          link: `/`,
          icon: "fa fa-sign-out",
          title: "Chiqish",
        },
      ],
    };
  },
  computed: {
    links() {
      return this[this.role];
    },
  },
  created() {
    api.user().then((res) => {
      this.user = res.data;
    });
  },
};
</script>

<style scoped>
@media (max-width: 425px) {
  .col-md-3 {
    font-size: 14px;
  }
}
</style>
