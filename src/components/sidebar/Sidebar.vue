<script>
import { sidebarWidth, collapsed, toggleSidebar } from "./state";
import * as api from "../Api/Api";
export default {
  components: { toggleSidebar },
  data() {
    return {
      image: api.url_to_files,
      role: localStorage.getItem("role"),
      branch_id: localStorage.getItem("branch_id"),
      logo: null,
    };
  },
  setup() {
    return { collapsed, sidebarWidth, toggleSidebar };
  },
  created() {
    if (this.$route.name !== "login")
      api.branch(this.branch_id).then((res) => {
        this.logo = res.data.logo?.logo;
      });
  },
  methods: {},
};
</script>

<template>
  <transition name="fade-SidebarLink">
    <div class="sidebar">
      <div class="sidebar-logo" v-if="logo">
        <img :src="image + logo" :alt="image + logo" />
      </div>
      <div class="sidebar-link">
        <router-link
          class="SidebarLink"
          :to="`/cashiers?branch_id=${branch_id}`"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-cash-register" /></i>
          <p>Kassa</p>
        </router-link>

        <router-link
          class="SidebarLink"
          to="/kassa"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-receipt" /></i>
          <p>Buyurtmalar</p>
        </router-link>

        <router-link
          class="SidebarLink"
          :to="`/statistic/${branch_id}`"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-chart-line" /></i>
          <p>Hisobotlar</p>
        </router-link>

        <router-link
          class="SidebarLink"
          :to="`/hodimlar/${branch_id}`"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-user-group" /></i>
          <p>Hodimlar</p>
        </router-link>

        <router-link
          class="SidebarLink"
          :to="`/davomat`"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-clipboard-check" /></i>
          <p>Davomat</p>
        </router-link>

        <router-link
          class="SidebarLink"
          to="/mijozlar"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-handshake" /></i>
          <p>Mijozlar</p>
        </router-link>

        <router-link
          class="SidebarLink"
          to="/nasiyalar"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-hand-holding-usd" /></i>
          <p>Nasiyalar</p>
        </router-link>

        <router-link
          class="SidebarLink"
          to="/return"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-undo" /></i>
          <p>Vozvrat</p>
        </router-link>

        <router-link
          class="SidebarLink"
          :to="`/taminot/${branch_id}`"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-truck-loading" /></i>
          <p>Ta'minot</p>
        </router-link>

        <router-link
          class="SidebarLink"
          to="/categories"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-folder" /></i>
          <p>Mahsulotlar</p>
        </router-link>

        <router-link
          class="SidebarLink"
          to="/products"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-folder" /></i>
          <p>Ombor mahsulotlar</p>
        </router-link>

        <router-link
          class="SidebarLink"
          :to="`/revision/${branch_id}`"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-box" /></i>
          <p>Mahsulotlar qoldig'i</p>
        </router-link>

        <router-link
          class="SidebarLink"
          :to="`/expense/${branch_id}`"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-wallet" /></i>
          <p>Chiqim</p>
        </router-link>

        <!-- <router-link
          class="SidebarLink"
          :to="`/admin/${branch_id}`"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-user" /></i>
          <p>Admin</p>
        </router-link> -->

        <router-link
          class="SidebarLink"
          to="/settings"
          v-if="role === 'branch_admin'"
        >
          <i class="icon"><span class="fa fa-tools" /></i>
          <p>Sozlamalar</p>
        </router-link>
      </div>
    </div>
  </transition>
</template>

<style lang="css" scoped>
@import "./css/style.css";
</style>
