<template>
  <h3><span class="fa fa-file-invoice" /> Kpi {{ user?.name || "" }}</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4"></div>
  </div>
  <hr />

  <div class="table-responsive" style="max-height: 82vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th v-if="!$route.query.user_id">Hodim</th>
          <th>Summa</th>
          <th>Sana</th>
          <th>
            <button
              class="btn btn-sm btn-outline-info"
              data-toggle="modal"
              data-target="#filter"
            >
              <i class="fa fa-filter"></i>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in kpi" :key="item">
          <td v-if="!$route.query.user_id">{{ item.user }}</td>
          <td>{{ $util.currency(item.Branch_kpi.money) + " so'm" }}</td>
          <td>{{ item.Branch_kpi.date }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="modal fade" id="filter">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Filter</h4>
        </div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12" v-if="!$route.query.user_id">
              Hodim
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers()"
                >
                  {{ user?.name || "Hodim tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event)"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="user = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12">
              Sana
              <input type="date" class="form-control" v-model="date" />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            data-dismiss="modal"
            @click="getKpi()"
          >
            <i class="far fa-circle-check" />
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            @click="
              $route.query.user_id ? false : (user = null);
              date = '';
              getKpi();
            "
          >
            <i class="fa fa-trash" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "Kpi",
  components: { Pagination },
  data() {
    return {
      user_id: this.$route.query.user_id,
      user: null,
      users: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      role: localStorage["role"],
      date: "",
      kpi: [],
    };
  },
  created() {
    if (this.user_id) this.getUser();
    else this.getKpi();
  },
  methods: {
    getUser() {
      api.thisUser(this.user_id).then((res) => {
        this.user = res.data;
        this.getKpi();
      });
    },
    getUsers() {
      api.users(0, 0, [], "", 0, 25).then((res) => {
        this.users = res.data;
      });
    },
    scrollUsers(event) {
      const element = event.target;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        if (this.users.current_page < this.users.pages) {
          api
            .users(0, 0, [], "", this.users.current_page + 1, 25)
            .then((res) => {
              this.users.current_page = res.data.current_page;
              this.users.pages = res.data.pages;
              this.users.data = this.users.data.concat(res.data.data);
            });
        }
      }
    },
    getKpi() {
      const branch_id = this.user?.branch_id || 0;
      const user_id = this.user?.id || 0;
      api.branchKpi(branch_id, user_id, this.date).then((res) => {
        this.kpi = res.data;
      });
    },
  },
};
</script>
