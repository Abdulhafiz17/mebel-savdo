<template>
  <h4>Servislar</h4>
  <div class="row">
    <div class="col text-left"></div>
    <div class="col text-right">
      <div class="btn-group btn-group-sm">
        <button
          v-if="role == 'logistika'"
          class="btn btn-outline-success"
          @click="$refs.serviceModal.start()"
        >
          Yangi servis qo'shish
        </button>
        <button
          class="btn btn-outline-info"
          data-toggle="modal"
          data-target="#filter"
        >
          <i class="fa fa-filter"></i>
        </button>
      </div>
    </div>
  </div>
  <hr />

  <div class="responsive" style="max-height: 80vh">
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in services.data" :key="item">
        <div class="card shadow h-100">
          <div class="card-body flex">
            <ul class="list">
              <li>
                <strong>ID </strong>
                <span>{{ item.id }}</span>
              </li>
              <li>
                <i class="fa fa-calendar-alt"></i>
                <span>{{ item.date }}</span>
              </li>
              <li v-if="item.order">
                <ul class="list">
                  <strong>Buyurtma</strong>
                  <li>
                    <i class="fa fa-calendar-alt"></i>
                    {{ item.order.time.replace("T", " ") }}
                  </li>
                  <li v-if="item.order.comment">
                    <i class="fa fa-comment"></i>
                    {{ item.order.comment }}
                  </li>
                  <ul class="list" v-if="item.order.customer">
                    <strong>Mijoz</strong>
                    <li>
                      <i class="fa fa-handshake"></i>
                      {{ item.order.customer?.name }}
                    </li>
                    <a :href="`tel:+998${item.order.customer?.phone}`">
                      <i class="fa fa-phone"></i>
                      {{ "+998" + item.order.customer?.phone }}
                    </a>
                  </ul>
                </ul>
              </li>
              <li v-if="item.pre_order">
                <ul class="list">
                  <strong>Oldindan buyurtma</strong>
                  <li>
                    <i class="fa fa-calendar-alt"></i>
                    {{ item.pre_order.time.replace("T", " ") }}
                  </li>
                  <li>
                    <i class="fa fa-calendar-alt"></i>
                    {{ item.pre_order.date }}
                  </li>
                  <li v-if="item.pre_order.comment">
                    <i class="fa fa-comment"></i>
                    {{ item.pre_order.comment }}
                  </li>
                  <ul class="list" v-if="item.pre_order.customer">
                    <strong>Mijoz</strong>
                    <li>
                      <i class="fa fa-handshake"></i>
                      {{ item.pre_order.customer?.name }}
                    </li>
                    <a :href="`tel:+998${item.pre_order.customer?.phone}`">
                      <i class="fa fa-phone"></i>
                      {{ "+998" + item.pre_order.customer?.phone }}
                    </a>
                  </ul>
                </ul>
              </li>
            </ul>
            <div class="row">
              <div
                class="col"
                v-if="!item.status && ['ustanovshik'].includes(role)"
              >
                <button
                  class="btn btn-sm btn-block btn-outline-primary"
                  @click="putService(item.id)"
                >
                  <i class="fa fa-check"></i>
                </button>
              </div>
            </div>
          </div>
          <!-- <pre>{{ item }}</pre> -->
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="filter">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header"><h5>Filter</h5></div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              Status
              <select class="form-select" v-model="filter.status">
                <option value="false">Faol</option>
                <option value="true">Yakunlangan</option>
              </select>
            </div>
            <div class="col-12">
              Turi
              <select class="form-select" v-model="filter.source">
                <option value="order">Buyurtma</option>
                <option value="pre_order">Oldindan buyurtma</option>
              </select>
            </div>
            <div class="col-12" v-if="role !== 'worker'">
              Haydovchi
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('worker')"
                >
                  {{ filter.worker?.name || "Haydovchi tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event, 'worker')"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="filter.worker = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12" v-if="role !== 'ustanovshik'">
              Ustanovshik
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('ustanovshik')"
                >
                  {{ filter.ustanovshik?.name || "Ustanovshik tanlang" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollUsers($event, 'ustanovshik')"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in users.data"
                      :key="item"
                      @click="filter.ustanovshik = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            class="btn btn-outline-primary"
            data-dismiss="modal"
            @click="getServices(0, 25)"
          >
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            @click="
              filter = {
                source: 'order',
                worker: null,
                ustanovshik: null,
                logistika: null,
                status: 'false',
              };
              getServices(0, 25);
            "
          >
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  </div>

  <serviceModal ref="serviceModal" @end="getServices(0, 25)" />
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
import serviceModal from "@/components/modal/serviceModal.vue";
export default {
  name: "services",
  components: { Pagination, serviceModal },
  data() {
    return {
      role: localStorage["role"],
      user_id: localStorage["user_id"],
      users: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      filter: {
        source: "order",
        worker: null,
        ustanovshik: null,
        logistika: null,
        status: "false",
      },
      services: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
    };
  },
  created() {
    this.getServices(0, 25);
  },
  methods: {
    getServices(page, limit) {
      let worker_id = this.filter.worker?.id || 0;
      let ustanovshik_id = this.filter.ustanovshik?.id || 0;
      if (this.role == "worker") worker_id = this.user_id;
      if (this.role == "ustanovshik") ustanovshik_id = this.user_id;
      api
        .services(
          0,
          this.filter.source,
          worker_id,
          ustanovshik_id,
          0,
          this.filter.status,
          page,
          limit
        )
        .then((res) => {
          this.services = res.data;
        });
    },
    getUsers(role) {
      api.users(0, 0, [role], "", 0, 25).then((res) => {
        this.users = res.data;
      });
    },
    scrollUsers(event, role) {
      const element = event.target;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        if (this.users.current_page < this.users.pages) {
          api
            .users(0, 0, [role], "", this.users.current_page + 1, 25)
            .then((res) => {
              this.users.current_page = res.data.current_page;
              this.users.pages = res.data.pages;
              this.users.data = this.users.data.concat(res.data.data);
            });
        }
      }
    },
    putService(id) {
      api.confirmService(id).then(() => {
        api.success().then(() => {
          this.getServices(0, 25);
        });
      });
    },
  },
};
</script>

<style scoped>
.flex {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
