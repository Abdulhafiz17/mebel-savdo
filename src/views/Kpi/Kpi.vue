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
          <!-- <th>Hodim</th> -->
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
          <!-- <td>{{ item.user }}</td> -->
          <td>{{ $util.currency(item.Branch_kpi.money) }}</td>
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
      role: localStorage["role"],
      date: "",
      kpi: [],
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      api.thisUser(this.user_id).then((res) => {
        this.user = res.data;
        this.getKpi();
      });
    },
    getKpi() {
      api
        .branchKpi(this.user.branch_id, this.user.id, this.date)
        .then((res) => {
          this.kpi = res.data;
        });
    },
  },
};
</script>
