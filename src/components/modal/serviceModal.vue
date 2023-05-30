<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#add-service"
  ></button>
  <div class="modal fade" id="add-service">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="postService()">
        <div class="modal-header"><h5>Yangi servis</h5></div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12" v-if="type">
              Servis turi
              <select class="form-select" required v-model="add_service.source">
                <option value="order">Buyurtma</option>
                <option value="pre_order">Oldindan buyurtma</option>
              </select>
            </div>
            <div class="col-12">
              Buyurtma id
              <input
                type="number"
                class="form-control"
                :disabled="disabled"
                required
                v-model="add_service.source_id"
              />
            </div>
            <div class="col-12">
              Haydovchi
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('worker')"
                >
                  {{ worker?.name || "Haydovchi tanlang" }}
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
                      @click="worker = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12">
              Ustanovshik
              <div class="dropdown">
                <button
                  id="customerDropdown"
                  class="btn btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getUsers('ustanovshik')"
                >
                  {{ ustanovshik?.name || "Ustanovshik tanlang" }}
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
                      @click="ustanovshik = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12">
              Izoh
              <textarea
                cols="30"
                rows="2"
                class="form-control"
                required
                v-model="add_service.comment"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" :disabled="!ustanovshik">
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-add-service
          >
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
export default {
  name: "serviceModal",
  emits: ["end"],
  data() {
    return {
      disabled: false,
      type: true,
      users: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      worker: null,
      ustanovshik: null,
      add_service: {
        source_id: null,
        source: "",
        ustanovshik_id: 0,
        worker_id: 0,
        comment: "",
      },
    };
  },
  computed: {
    toggle_button() {
      return document.querySelector(`[data-target="#add-service"]`);
    },
  },
  methods: {
    start(order_id, type) {
      this.worker = null;
      this.ustanovshik = null;
      this.add_service = {
        source_id: null,
        source: "",
        ustanovshik_id: 0,
        worker_id: 0,
        comment: "",
      };
      if (order_id) this.disabled = true;
      this.add_service.source_id = order_id || null;
      if (type) this.type = false;
      this.add_service.source = type || "";
      this.toggle_button.click();
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
    postService() {
      this.add_service.worker_id = this.worker?.id || 0;
      this.add_service.ustanovshik_id = this.ustanovshik.id;
      api.createService(this.add_service).then(() => {
        api.success("close-add-service").then(() => {
          this.worker = null;
          this.ustanovshik = null;
          this.add_service = {
            source_id: null,
            source: "",
            ustanovshik_id: 0,
            worker_id: 0,
            comment: "",
          };
          this.$emit("end");
        });
      });
    },
  },
};
</script>

<style scoped></style>
