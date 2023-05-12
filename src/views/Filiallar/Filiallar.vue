<template>
  <h3><i class="fa fa-code-branch" /> Filiallar</h3>
  <div class="row">
    <div class="col-md-4">
      <div class="input-group input-group-sm">
        <input
          class="form-control"
          type="search"
          placeholder="Qidiruv"
          v-model="search"
        />
        <div class="input-group-append">
          <div class="input-group-text">
            <i class="fa fa-search" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        v-if="role == 'admin'"
        class="btn btn-sm btn-block btn-outline-secondary"
        data-toggle="modal"
        data-target="#filialAdd"
      >
        <span class="fa fa-plus" /> Filial qo'shish
      </button>
    </div>
  </div>
  <hr />

  <div class="responsive">
    <div class="row">
      <div class="col-md-4 my-1" v-for="item in filter" :key="item">
        <div class="card shadow">
          <div class="card-image">
            <img
              v-if="
                logos.find((logo) => {
                  return logo.source == item.id;
                })
              "
              :src="
                image +
                logos.find((logo) => {
                  return logo.source == item.id;
                }).logo
              "
              :alt="
                logos.find((logo) => {
                  return logo.source == item.id;
                }).logo
              "
            />
          </div>
          <div class="card-body">
            <h4>{{ item.name }}</h4>
            <hr />
            <ul class="list-group">
              <!-- <li class="list-group-item" v-if="item.balances.length">
                <span
                  v-for="balance in item.balances"
                  :key="balance"
                  :class="balance.balance >= 0 ? 'text-success' : 'text-danger'"
                >
                  {{ Intl.NumberFormat().format(balance.balance) }}
                  {{ balance.currency ? balance.currency.currency : "" }}
                </span>
              </li>
              <li class="list-group-item" v-else>
                <i class="fa fa-money-bill" />
                <span>0</span>
              </li> -->
              <li class="list-group-item">
                <i class="fa fa-location-dot" /> {{ item.address }}
              </li>
              <a class="list-group-item" :href="`tel:+998${item.phone}`">
                <i class="fa fa-phone" /> +998
                {{ format(item.phone) }}
              </a>
            </ul>
            <div class="row my-1">
              <div class="col my-1" v-if="role == 'admin'">
                <router-link
                  :to="`/statistic/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-success"
                >
                  <i class="fa fa-chart-line" />
                </router-link>
              </div>
              <div class="col my-1" v-if="role == 'admin'">
                <router-link
                  :to="`/hodimlar/${item.id}`"
                  class="btn btn-sm btn-block btn-outline-info"
                >
                  <i class="fa fa-user-group" />
                </router-link>
              </div>
              <div class="col my-1">
                <router-link
                  :to="`/cashiers?branch_id=${item.id}`"
                  class="btn btn-sm btn-block btn-outline-primary"
                >
                  <i class="fa fa-cash-register" />
                </router-link>
              </div>
              <div class="col my-1" v-if="role == 'admin'">
                <router-link
                  :to="{ path: '/transfer', query: { branch_id: item.id } }"
                  class="btn btn-sm btn-block btn-outline-secondary"
                >
                  <i class="fa fa-history" />
                </router-link>
              </div>
              <div class="col my-1" v-if="role == 'admin'">
                <a
                  :href="`https://www.google.com/maps/@${item.map_lat},${item.map_long},20z`"
                  target="_blank"
                  class="btn btn-sm btn-block btn-outline-success"
                >
                  <i class="fa fa-location-dot" />
                </a>
              </div>
              <div class="col my-1" v-if="role == 'admin'">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#edit"
                  @click="
                    editFilial = item;
                    filial_currency = item.trade_currency;
                  "
                >
                  <i class="fa fa-edit" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="filialAdd">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Filial qo'shish</h4>
        </div>
        <form @submit.prevent="post(yangiFilial)">
          <div class="modal-body">
            <div class="responsive" style="max-height: 60vh">
              <div class="row gap-1">
                <label class="col-md-12">
                  Nomi
                  <input
                    class="form-control form-control-sm"
                    type="text"
                    placeholder="nomi"
                    required
                    v-model="yangiFilial.name"
                  />
                </label>
                <label class="col-md-12">
                  Telefon raqam
                  <div class="input-group input-group-sm">
                    <div class="input-group-text">+998</div>
                    <input
                      class="form-control"
                      type="tel"
                      minlength="9"
                      maxlength="9"
                      placeholder="tel"
                      required
                      v-model="yangiFilial.phone"
                    />
                  </div>
                </label>
                <label class="col-md-12">
                  Manzil
                  <input
                    class="form-control form-control-sm"
                    type="text"
                    placeholder="manzil"
                    required
                    v-model="yangiFilial.address"
                  />
                </label>
                <div class="col-md-12">
                  Savdo limit
                  <div class="row">
                    <div class="col-md-6">
                      <label class="input-group input-group-sm">
                        <input
                          class="form-control"
                          type="number"
                          min="0"
                          placeholder="dan"
                          required
                          v-model="yangiFilial.limit_money"
                        />
                        <div class="input-group-text">so'm</div>
                      </label>
                    </div>
                    <div class="col-md-6">
                      <label class="input-group input-group-sm">
                        <input
                          class="form-control"
                          type="number"
                          min="0"
                          placeholder="gacha"
                          required
                          v-model="yangiFilial.limit_money2"
                        />
                        <div class="input-group-text">so'm</div>
                      </label>
                    </div>
                  </div>
                </div>
                <label class="col-md-12">
                  Bonus
                  <div class="input-group input-group-sm">
                    <input
                      class="form-control"
                      type="number"
                      min="0"
                      placeholder="bonus"
                      required
                      v-model="yangiFilial.bonus"
                    />
                    <div class="input-group-text">so'm</div>
                  </div>
                </label>
                <div class="col-md-12">
                  Geo joylashuv
                  <div class="row">
                    <div class="col-md-6">
                      <label class="input-group input-group-sm">
                        <input
                          class="form-control"
                          type="text"
                          placeholder="kenglik"
                          required
                          v-model="yangiFilial.map_lat"
                        />
                        <div class="input-group-text">kenglik</div>
                      </label>
                    </div>
                    <div class="col-md-6">
                      <label class="input-group input-group-sm">
                        <input
                          class="form-control"
                          type="text"
                          placeholder="uzunlik"
                          required
                          v-model="yangiFilial.map_long"
                        />
                        <div class="input-group-text">uzunlik</div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="edit">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ editFilial.name }}</h4>
        </div>
        <form @submit.prevent="put(editFilial)">
          <div class="modal-body">
            <div class="row gap-1">
              <label class="col-md-12">
                Nomi
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="nomi"
                  required
                  v-model="editFilial.name"
                />
              </label>
              <label class="col-md-12">
                Telefon raqam
                <div class="input-group input-group-sm">
                  <div class="input-group-text">+998</div>
                  <input
                    class="form-control"
                    type="tel"
                    minlength="9"
                    maxlength="9"
                    placeholder="tel"
                    required
                    v-model="editFilial.phone"
                  />
                </div>
              </label>
              <label class="col-md-12">
                Manzil
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="manzil"
                  required
                  v-model="editFilial.address"
                />
              </label>
              <div class="col-md-12">
                Savdo limit
                <div class="row">
                  <div class="col-md-6">
                    <label class="input-group input-group-sm">
                      <input
                        class="form-control"
                        type="number"
                        min="0"
                        placeholder="dan"
                        required
                        v-model="editFilial.limit_money"
                      />
                      <div class="input-group-text">so'm</div>
                    </label>
                  </div>
                  <div class="col-md-6">
                    <label class="input-group input-group-sm">
                      <input
                        class="form-control"
                        type="number"
                        min="0"
                        placeholder="gacha"
                        required
                        v-model="editFilial.limit_money2"
                      />
                      <div class="input-group-text">so'm</div>
                    </label>
                  </div>
                </div>
              </div>
              <label class="col-md-12">
                Bonus
                <div class="input-group input-group-sm">
                  <input
                    class="form-control"
                    type="number"
                    min="0"
                    placeholder="bonus"
                    required
                    v-model="editFilial.bonus"
                  />
                  <div class="input-group-text">so'm</div>
                </div>
              </label>
              <div class="col-md-12">
                Geo joylashuv
                <div class="row">
                  <div class="col-md-6">
                    <label class="input-group input-group-sm">
                      <input
                        class="form-control"
                        type="text"
                        placeholder="kenglik"
                        required
                        v-model="editFilial.map_lat"
                      />
                      <div class="input-group-text">kenglik</div>
                    </label>
                  </div>
                  <div class="col-md-6">
                    <label class="input-group input-group-sm">
                      <input
                        class="form-control form-control-sm"
                        type="text"
                        placeholder="uzunlik"
                        required
                        v-model="editFilial.map_long"
                      />
                      <div class="input-group-text">uzunlik</div>
                    </label>
                  </div>
                  <label class="col-md-12">
                    Logo
                    <input
                      class="form-control form-control-sm"
                      type="file"
                      branch-logo
                    />
                  </label>
                  <span
                    v-if="
                      logos.find((logo) => {
                        return logo.source == editFilial.id;
                      })
                    "
                  >
                    <img
                      :src="
                        image +
                        logos.find((logo) => {
                          return logo.source == editFilial.id;
                        }).logo
                      "
                      :alt="
                        image +
                        logos.find((logo) => {
                          return logo.source == editFilial.id;
                        }).logo
                      "
                    />
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-danger"
                      @click="
                        deleteImage(
                          logos.find((logo) => {
                            return logo.source == editFilial.id;
                          }).id
                        )
                      "
                    >
                      <i class="far fa-circle-xmark" />
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <i class="far fa-circle-check" />
            </button>
            <button
              class="btn btn-outline-danger"
              data-dismiss="modal"
              @click="get()"
            >
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api";
export default {
  name: "Filiallar",
  data() {
    return {
      role: localStorage["role"],
      image: api.url_to_files,
      search: "",
      currencies: [],
      logos: [],
      branches: [],
      editFilial: {},
      filial_currency: null,
      yangiFilial: {
        name: null,
        phone: null,
        map_long: null,
        map_lat: null,
        address: null,
        limit_money: null,
        limit_money2: null,
        bonus: null,
      },
    };
  },
  computed: {
    filter() {
      return this.branches.filter((branch) => {
        return (
          branch.name.toLowerCase().match(this.search.toLowerCase()) ||
          String(branch.phone).match(this.search)
        );
      });
    },
  },
  created() {
    this.get();
    this.getLocation();
  },
  mounted() {},
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
    get() {
      api.branches().then((Response) => {
        this.branches = Response.data.branch;
        this.logos = Response.data.logos;
      });
    },
    post(data) {
      api.createBranch(data).then((Response) => {
        document.querySelectorAll("[data-dismiss]")[0].click();
        api.success().then(() => {
          this.yangiFilial = {
            name: null,
            phone: null,
            map_long: null,
            map_lat: null,
            address: null,
          };
          this.get();
        });
      });
    },
    put(data) {
      const file = document.querySelector("[branch-logo]").files[0];
      Number(data.phone);
      api.updateBranch(data).then((Response) => {
        if (file) this.postImage(data, file);
        else
          api.success().then(() => {
            document.querySelectorAll("[data-dismiss]")[1].click();
            this.get();
          });
      });
    },
    postImage(data, image) {
      const file = new FormData();
      file.append("file", image);
      api.createLogo(data, file).then((Response) => {
        document.querySelectorAll("[data-dismiss]")[1].click();
        api.success().then(() => {
          document.querySelector("[type='file']").value = null;
          this.get();
        });
      });
    },
    deleteImage(id) {
      api.removeLogo(id).then((Response) => {
        document.querySelectorAll("[data-dismiss]")[1].click();
        api.success().then(() => {
          this.get();
        });
      });
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.yangiFilial.map_lat = position.coords.latitude;
            this.yangiFilial.map_long = position.coords.longitude;
          },
          (error) => {
            console.log(error.message);
          }
        );
      }
    },
  },
};
</script>

<style scoped>
input[type="color"] {
  display: block;
  width: 100%;
}

.card {
  height: 100%;
}

.card-image {
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
}

.card-image img {
  width: 40%;
  object-fit: contain;
}

.modal-body span img {
  width: 20%;
}
.responsive {
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 80vh;
}

summary {
  padding: 8px;
}

h5 {
  margin: 0;
}
</style>
