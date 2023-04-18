<template>
  <h3><span class="fa fa-truck" /> {{ warehouse?.name }} ta'minotlari</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-outline-info"
        data-toggle="modal"
        data-target="#filter"
      >
        <i class="fa fa-filter" /> Filter
      </button>
    </div>
  </div>
  <hr />

  <div class="body">
    <ul class="list-group">
      <router-link
        class="list-group-item"
        v-for="item in parties.data"
        :key="item"
        :to="`/taminot/${item.id}`"
        @click="setItem(true)"
      >
        <span><strong>Id: </strong> {{ item.id }} </span>
        <span><strong>Sana:</strong> {{ item.sana }} </span>
      </router-link>
    </ul>
  </div>

  <div class="modal fade" id="filter">
    <div class="modal-dialog modal-sm">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Filter</h4>
        </div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              Status
              <select class="form-select" v-model="filter.status">
                <option value="false">Faol</option>
                <option value="true">Yakunlangan</option>
              </select>
            </div>
            <div class="col-12" v-if="filter.status == 'true'">
              Status
              <select class="form-select" v-model="filter.warehouseman">
                <option value="false">Omborga qabul qilinmagan</option>
                <option value="true">Omborga qabul qilingan</option>
              </select>
            </div>
            <div class="col-12" v-if="filter.warehouseman == 'true'">
              Omborchi
              <select class="form-select" v-model="filter.warehouseman_id">
                <option
                  v-for="item in warehousemen"
                  :key="item"
                  :value="item.id"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            data-dismiss="modal"
            @click="getParties(0, 25)"
          >
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            @click="
              filter = {
                status: 'false',
                warehouseman: false,
                warehouseman_id: 0,
              };
              getParties(0, 25);
            "
          >
            <i class="fa fa-trash"></i>
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
  name: "Ta'minot",
  components: { Pagination },
  data() {
    return {
      warehousemen: [],
      warehouse: null,
      filter: {
        status: "true",
        warehouseman: false,
        warehouseman_id: 0,
      },
      parties: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.getParties(0, 25);
    this.getWarehouse();
  },
  methods: {
    getParties(page, limit) {
      api
        .parties(
          this.filter.status,
          this.filter.warehouseman,
          this.filter.warehouseman_id,
          this.$route.params.id,
          page,
          limit
        )
        .then((Response) => {
          this.parties = Response.data;
        });
    },
    getUsers() {
      api
        .users(0, this.$route.params.id, ["warehouseman"], 0, 100)
        .then((res) => {
          this.warehousemen = res.data.data;
        });
    },
    getWarehouse() {
      api.warehouse(this.$route.params.id).then((res) => {
        this.warehouse = res.data;
      });
    },
    post() {
      api.createParty().then((Response) => {
        api.success().then(() => {
          this.get(false, 0, 100);
        });
      });
    },
    setItem(boolean) {
      if (boolean) {
        localStorage.setItem("supply", boolean);
      } else {
        localStorage.removeItem("supply");
      }
    },
  },
};
</script>

<style scoped>
.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 70vh;
}
</style>
