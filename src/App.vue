<template>
  <div class="app dark">
    <span v-if="$route.name !== 'login'">
      <notification v-if="$route.name !== 'home'" />
      <Sidebar v-if="['branch_admin'].includes(role)" />
    </span>
    <div class="container-fluid pt-2" style="height: 100vh">
      <div
        id="main-card"
        :class="{ 'card shadow p-2 responsive': $route.name !== 'login' }"
        :style="{ 'margin-left': margin }"
      >
        <div class="btn-group btn-group-sm btn-admin" v-if="route_buttons">
          <button class="btn btn-outline-secondary" @click="back()">
            <i class="fa fa-arrow-left" />
          </button>
          <router-link to="/main" class="btn btn-outline-secondary">
            <i class="fa fa-home" />
          </router-link>
        </div>
        <Router-view v-slot="{ Component, route }">
          <transition name="router" mode="out-in">
            <div :key="route">
              <component :is="Component"></component>
            </div>
          </transition>
        </Router-view>
      </div>
    </div>
    <isloading v-if="loading" />
  </div>
</template>

<script>
import Sidebar from "./components/sidebar/Sidebar.vue";
import notification from "./components/notification/notification.vue";
import swal from "sweetalert";
import isloading from "./components/Animation/Anime.vue";
export default {
  name: "App",
  components: { Sidebar, isloading, notification },
  data() {
    return {
      role: localStorage.getItem("role") || "admin",
    };
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    margin() {
      if (
        this.$route.name == "login" ||
        [
          "admin",
          "cashier",
          "logistika",
          "warehouseman",
          "worker",
          "ustanovshik",
          "seller",
          "taminotchi",
          "operator",
        ].includes(this.role)
      )
        return "";
      else return "35px";
    },
    route_buttons() {
      if (
        [
          "admin",
          "cashier",
          "logistika",
          "warehouseman",
          "worker",
          "ustanovshik",
          "seller",
          "taminotchi",
          "operator",
        ].includes(this.role) &&
        this.$route.name !== "login" &&
        this.$route.name !== "main"
      )
        return true;
      else return false;
    },
  },
  watch: {
    $route(to) {
      document.title = `Savdo • ${to.meta.title}`;
      this.setDisplay();
    },
  },
  created() {
    this.setDisplay();
    setInterval(() => {
      window.onoffline = () => {
        swal({
          icon: "warning",
          title: "Tarmoq bilan aloqa mavjud emas !",
          closeOnClickOutside: false,
          closeOnEsc: false,
        });
      };
    }, 60000);
    window.ononline = () => {
      swal({
        icon: "success",
        title: "Aloqa mavjud !",
        timer: 1500,
      }).then(() => {});
    };
  },
  mounted() {},
  methods: {
    back() {
      this.$router.go(-1);
    },
    setDisplay() {
      document.documentElement.style.setProperty(
        "--main-font",
        localStorage.getItem("main_font")
      );
      document.documentElement.style.setProperty(
        "--main-color",
        localStorage.getItem("main_color")
      );
      document.documentElement.style.setProperty(
        "--main-border",
        localStorage.getItem("main_color2")
      );
      document.documentElement.style.setProperty(
        "--main-logo",
        localStorage.getItem("main_logo")
      );
    },
  },
};
</script>

<style>
@import url("./main.css");
@import url("./dark.css");
.btn-admin {
  position: absolute;
  z-index: 10;
}

.router-enter-active {
  animation: routerIn 0.1s ease;
  transform-origin: top;
}

@keyframes routerIn {
  0% {
    /* transform: translate(100%, 0); */
    /* transform: scale(0); */
    opacity: 0;
  }
  /* 50% {
    transform: scale(1.1);
  } */
  100% {
    /* transform: translate(0, 0); */
    /* transform: scale(1); */
    opacity: 1;
  }
}

.router-leave-active {
  animation: routerOut 0.1s ease;
}

@keyframes routerOut {
  from {
    /* transform: translate(0, 0); */
    /* transform: scale(1); */
    opacity: 1;
  }
  to {
    /* transform: translate(100%, 0); */
    /* transform: scale(0.9); */
    opacity: 0;
  }
}
</style>
