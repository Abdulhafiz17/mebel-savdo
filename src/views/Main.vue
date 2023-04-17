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
      links: [
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
          icon: "fas fa-warehouse",
          title: "Omborlar",
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
          link: `/settings`,
          icon: "fa fa-tools",
          title: "Sozlamalar",
        },
      ],
    };
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
