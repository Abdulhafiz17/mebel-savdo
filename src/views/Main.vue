<template>
  <h3><span class="fa fa-home" /> Asosiy</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <div class="row">
    <div class="col-md-4 my-1" v-for="item in links" :key="item">
      <router-link :to="item.link" class="card shadow">
        <div class="card-body">
          <i class="fa-2x" :class="item.icon" />
          <hr />
          <strong>{{ item.title }}</strong>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      role: localStorage["role"],
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
          link: `/products`,
          icon: "fa fa-box",
          title: "Mahsulotlar",
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
          link: `/admin-hodimlar`,
          icon: "fa fa-user-group",
          title: "Hodimlar",
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
          link: `/ombor-buyurtmalar/${localStorage["branch_id"]}`,
          icon: "fa fa-receipt",
          title: "Buyurtmalar",
        },
        {
          link: `/ombor-taminotlar/${localStorage["branch_id"]}`,
          icon: "fa fa-truck-loading",
          title: "Taminotlar",
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
      ],
    };
  },
  computed: {
    links() {
      return this[this.role];
    },
  },
};
</script>

<style scoped>
@media (max-width: 425px) {
  .col-md-4 {
    width: 50%;
    font-size: 14px;
  }
}
</style>
