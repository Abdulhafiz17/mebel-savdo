<template>
  <h3><span class="fa fa-clipboard-check" /> Davomat</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <div class="table-responsive" style="max-height: 84vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Hodim</th>
          <th>Keldi</th>
          <th>Ketdi</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in users.data" :key="item">
          <td>{{ item.name }}</td>
          <td>{{ item.davomat?.kelgan_vaqt.replace("T", " ") }}</td>
          <td>{{ item.davomat?.ketgan_vaqt.replace("T", " ") }}</td>
          <td>
            <div class="btn-group btn-group-sm">
              <button
                v-if="!item.davomat"
                class="btn btn-outline-primary"
                @click="postDavomat(item.id)"
              >
                <i class="fa fa-arrow-down"></i> Keldi
              </button>
              <button
                v-if="item.davomat?.ketgan_vaqt[0] == '0'"
                class="btn btn-outline-danger"
                @click="putDavomat(item.davomat?.id)"
              >
                <i class="fa fa-arrow-up"></i> Ketdi
              </button>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">
            <Pagination
              :page="users.current_page"
              :pages="users.pages"
              :limit="users.limit"
              @get="getUsers"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api.js";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "davomat",
  components: { Pagination },
  data() {
    return {
      today: new Date().toISOString().substring(0, 10),
      role: localStorage["role"],
      branch_id: localStorage["branch_id"],
      users: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.getUsers(0, 25);
  },
  methods: {
    getUsers(page = 0, limit = 25) {
      let branch_id = 0;
      let warehouse_id = 0;
      let roles = [""];
      if (this.role == "admin") {
        roles = [];
      } else if (this.role == "branch_admin") {
        branch_id = this.branch_id;
        roles = ["branch_admin", "seller"];
      } else if (this.role == "logistika") {
        roles = ["worker", "ustanovshik"];
      }
      api.users(branch_id, warehouse_id, roles, page, limit).then((res) => {
        this.users = res.data;
        if (this.users.data.length) this.getDavomat(0);
      });
    },
    getDavomat(index) {
      api
        .davomat(this.users.data[index].id, this.today, this.today, 0, 1)
        .then((res) => {
          this.users.data[index].davomat = res.data.data[0]?.Davomat;
          if (index < this.users.data.length - 1) this.getDavomat(index + 1);
        });
    },
    postDavomat(id) {
      api.enter_user({ user_id: id }).then(() => {
        api.success().then(() => {
          this.getUsers(this.users.current_page, this.users.limit);
        });
      });
    },
    putDavomat(id) {
      api.close_user({ davomat_id: id }).then(() => {
        api.success().then(() => {
          this.getUsers(this.users.current_page, this.users.limit);
        });
      });
    },
  },
};
</script>
