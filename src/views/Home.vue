<template></template>

<script>
import * as api from "@/components/Api/Api";
export default {
  name: "HomeView",
  data() {
    return {
      role: localStorage.getItem("role"),
      branch_id: localStorage.getItem("branch_id"),
    };
  },
  created() {
    if (
      ["admin", "cashier", "logistika", "worker", "warehouseman"].includes(
        this.role
      )
    ) {
      this.$router.replace("/main");
    } else if (this.role == "branch_admin") {
      this.forBranch();
    }
  },
  methods: {
    forBranch() {
      api.branch(this.branch_id).then(
        (Response) => {
          Response.data.branch.font
            ? localStorage.setItem("main_font", Response.data.branch.font)
            : false;
          Response.data.branch.colour
            ? localStorage.setItem("main_color", Response.data.branch.colour)
            : false;
          Response.data.branch.colour2
            ? localStorage.setItem("main_color2", Response.data.branch.colour2)
            : false;
          Response.data.logo
            ? localStorage.setItem("main_logo", Response.data.logo.logo)
            : false;
          this.$router.replace(`/kassa`);
        },
        () => {
          this.forBranch();
        }
      );
    },
  },
};
</script>
