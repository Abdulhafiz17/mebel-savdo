<template>
  <h3><span class="fa fa-handshake" /> Mijozlar</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1">
      <div class="input-group input-group-sm">
        <input
          class="form-control"
          type="search"
          placeholder="Qidiruv"
          v-model="search"
          @keyup="get(0, 25)"
        />
      </div>
    </div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-success"
        data-toggle="modal"
        data-target="#yangiMijoz"
        v-if="role !== 'admin'"
      >
        Yangi mijoz
      </button>
    </div>
  </div>
  <hr />

  <div class="body">
    <div class="responsive">
      <div class="row">
        <div class="col-md-4 my-1" v-for="(item, idx) in mijozlar" :key="item">
          <div class="card shadow">
            <div class="card-body">
              <details :id="idx">
                <summary>
                  <span class="fa fa-user" />
                  <span>{{ item.name }}</span>
                </summary>
                <ul class="list-group">
                  <a class="list-group-item" :href="'tel:+998' + item.phone">
                    <i class="fa fa-phone" />
                    <span>+998 {{ format(item.phone) }}</span>
                  </a>
                  <li class="list-group-item">
                    <i class="fa fa-calendar-day" />
                    <span>{{ item.birthday }}</span>
                  </li>
                  <li class="list-group-item">
                    <i class="fa fa-user-tag" />
                    <span> {{ item.type }} </span>
                  </li>
                  <li class="list-group-item">
                    <i class="fa fa-location-dot" />
                    <span> {{ item.address }} </span>
                  </li>
                  <li class="list-group-item">
                    <i class="fa fa-arrows-h" />
                    <span> {{ item.map_lat }} </span>
                  </li>
                  <li class="list-group-item">
                    <i class="fa fa-arrows-v" />
                    <span> {{ item.map_long }} </span>
                  </li>
                </ul>
              </details>
              <div class="row my-1 gap-1">
                <div class="col">
                  <router-link
                    :to="`/mijoz/${item.id}`"
                    class="btn btn-sm btn-block btn-outline-info"
                  >
                    <span class="fa fa-info" />
                  </router-link>
                </div>
                <div class="col">
                  <button
                    class="btn btn-sm btn-block btn-outline-warning"
                    data-toggle="modal"
                    data-target="#editMijoz"
                    @click="editMijoz = item"
                  >
                    <span class="fas fa-edit" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <Pagination :page="page" :pages="pages" :limit="limit" @get="get" />
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="editMijoz">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ editMijoz.name }} ma'lumotlarini tahrirlash</h4>
        </div>
        <form @submit.prevent="put(editMijoz)">
          <div class="modal-body">
            <div class="row gap-1 text-left">
              <div class="col-md-12">
                Ism
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="editMijoz.name"
                />
              </div>
              <div class="col-md-12">
                Telefon raqam
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+998</div>
                  </div>
                  <input
                    class="form-control"
                    type="tel"
                    minlength="9"
                    maxlength="9"
                    placeholder="tel"
                    required
                    v-model="editMijoz.phone"
                  />
                </div>
              </div>
              <div class="col-md-12">
                Tug'ilgan sana
                <input
                  class="form-control form-control-sm"
                  type="date"
                  required
                  v-model="editMijoz.birthday"
                />
              </div>
              <div class="col-md-12">
                Toifa
                <select
                  class="form-select form-select-sm"
                  v-model="editMijoz.type"
                >
                  <option value="Premium">Premium</option>
                  <option value="Narx">Narx</option>
                  <option value="Umumiy">Umumiy</option>
                  <option value="Qora ro'yxat">Qora ro'yxat</option>
                </select>
              </div>
              <div class="col-md-12">
                Geo joylashuv
                <div class="row">
                  <div class="col-6">
                    <div class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="uzunlik"
                        required
                        v-model="editMijoz.map_long"
                      />
                      <div class="input-group-text">uzunlik</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="kenglik"
                        required
                        v-model="editMijoz.map_lat"
                      />
                      <div class="input-group-text">kenglik</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button
              id="close-modal"
              class="btn btn-outline-danger"
              data-dismiss="modal"
              @click="get(0, 100)"
            >
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="yangiMijoz">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Yangi mijoz qo'shish</h4>
        </div>
        <form @submit.prevent="post()">
          <div class="modal-body">
            <div class="row gap-1 text-left">
              <div class="col-md-12">
                Ism
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="yangiMijoz.name"
                />
              </div>
              <div class="col-md-12">
                Telefon raqam
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <div class="input-group-text">+998</div>
                  </div>
                  <input
                    class="form-control"
                    type="tel"
                    minlength="9"
                    maxlength="9"
                    placeholder="tel"
                    required
                    v-model="yangiMijoz.phone"
                  />
                </div>
              </div>
              <div class="col-md-12">
                Tug'ilgan sana
                <input
                  class="form-control form-control-sm"
                  type="date"
                  required
                  v-model="yangiMijoz.birthday"
                />
              </div>
              <div class="col-md-12">
                Toifa
                <select
                  class="form-select form-select-sm"
                  v-model="yangiMijoz.type"
                >
                  <option value="Premium">Premium</option>
                  <option value="Narx">Narx</option>
                  <option value="Umumiy">Umumiy</option>
                  <option value="Qora ro'yxat">Qora ro'yxat</option>
                </select>
              </div>
              <div class="col-md-12">
                Geo joylashuv
                <div class="row">
                  <div class="col-6">
                    <div class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="uzunlik"
                        required
                        v-model="yangiMijoz.map_long"
                      />
                      <div class="input-group-text">uzunlik</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="input-group input-group-sm">
                      <input
                        type="text"
                        class="form-control form-control-sm"
                        placeholder="kenglik"
                        required
                        v-model="yangiMijoz.map_lat"
                      />
                      <div class="input-group-text">kenglik</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button
              close-modal
              class="btn btn-outline-danger"
              data-dismiss="modal"
              @click="get(0, 100)"
            >
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "Mijozlar",
  components: { Pagination },
  data() {
    return {
      role: localStorage["role"],
      search: "",
      yangiMijoz: {
        name: "",
        phone: null,
        birthday: "",
        type: "",
        address: "",
        map_long: "",
        map_lat: "",
      },
      page: 0,
      pages: 1,
      limit: 25,
      mijozlar: [],
      editMijoz: {},
    };
  },
  created() {
    this.get(0, 25);
  },
  methods: {
    format(number) {
      return String(
        "(" +
          String(number).substr(0, 2) +
          ") " +
          String(number).substr(2, 3) +
          " " +
          String(number).substr(5, 2) +
          " " +
          String(number).substr(7, 2)
      );
    },
    get(page, limit) {
      if (this.role == "admin")
        api.customersAdmin(page, limit, this.search).then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.mijozlar = Response.data.data;
        });
      else
        api.customers(page, limit, this.search).then((Response) => {
          this.page = Response.data.current_page;
          this.pages = Response.data.pages;
          this.limit = Response.data.limit;
          this.mijozlar = Response.data.data;
        });
    },
    post() {
      api.createCustomer(this.yangiMijoz).then(() => {
        this.yangiMijoz = {
          name: "",
          phone: null,
          birthday: "",
          type: "",
          address: "",
          map_long: "",
          map_lat: "",
        };
        api.success("close-modal").then(() => {
          this.get(0, 25);
        });
      });
    },
    put(data) {
      api.updateCustomer(data).then((Response) => {
        document.querySelector("#close-modal").click();
        api.success().then(() => {
          this.get(0, 25);
        });
      });
    },
  },
};
</script>

<style scoped>
.list-group-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.responsive {
  overflow-x: hidden;
  max-height: 75vh;
}
</style>
