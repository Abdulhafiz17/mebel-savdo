<template>
  <h3><span class="fa fa-user-group" /> Hodimlar</h3>
  <div class="row">
    <div class="col-md-4"></div>
    <div class="col-md-4 my-1"></div>
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-secondary"
        data-toggle="modal"
        data-target="#hodimQoshish"
      >
        <span class="fa fa-user-plus" /> Hodim qo'shish
      </button>
    </div>
  </div>
  <hr />

  <div class="responsive">
    <div class="row">
      <div class="col-md-4 my-1" v-for="hodim in hodimlar.data" :key="hodim">
        <div :class="hodim.status ? 'card' : 'card border-danger'">
          <div class="card-body">
            <details>
              <summary>
                <span
                  :class="
                    hodim.status ? 'fa fa-user' : 'fa fa-user-lock text-danger'
                  "
                />
                <span>{{ hodim.name }}</span>
              </summary>
              <ul class="list-group">
                <a class="list-group-item" :href="'tel:+998' + hodim.phone">
                  <span class="fa fa-phone" />
                  <span>+998 {{ format(hodim.phone) }}</span>
                </a>
                <li class="list-group-item">
                  <span class="fa fa-user-tag" />
                  <span v-if="hodim.role == 'admin'">Admin</span>
                  <span v-else-if="hodim.role == 'branch_admin'"
                    >Filial admin</span
                  >
                  <span v-else-if="hodim.role == 'cashier'">Kassir</span>
                  <span v-else-if="hodim.role == 'seller'">Sotuvchi</span>
                  <span v-else-if="hodim.role == 'worker'">Transport</span>
                  <span v-else-if="hodim.role == 'ustanovshik'"
                    >Ustanovshik</span
                  >
                  <span v-else-if="hodim.role == 'logistika'">Logistika</span>
                  <span v-else-if="hodim.role == 'warehouseman'">Omborchi</span>
                </li>
                <li class="list-group-item">
                  <span class="fa fa-coins" />
                  <span
                    :class="
                      hodim.balance > 0
                        ? 'text-success'
                        : hodim.balance < 0
                        ? 'text-danger'
                        : ''
                    "
                  >
                    {{
                      _.format(hodim.balance) +
                      " " +
                      (currency ? currency.currency : "")
                    }}
                  </span>
                </li>
              </ul>
            </details>
            <div class="row my-1 gap-1">
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-success"
                  @click="$refs.payToUser.start(hodim)"
                >
                  <span class="fa fa-coins" />
                </button>
              </div>
              <div class="col" v-if="role !== 'admin'">
                <router-link
                  class="btn btn-sm btn-block btn-outline-info"
                  :to="'/hodim/' + hodim.id"
                >
                  <span class="fa fa-info" />
                </router-link>
              </div>
              <div class="col">
                <router-link
                  class="btn btn-sm btn-block btn-outline-secondary"
                  :to="'/hodim-tarix/' + hodim.id"
                >
                  <span class="fa fa-history" />
                </router-link>
              </div>
              <div
                class="col"
                v-if="
                  role == 'cashier' &&
                  (hodim.role == 'worker' || hodim.role == 'ustanovshik')
                "
              >
                <button
                  class="btn btn-sm btn-block btn-outline-primary"
                  data-toggle="modal"
                  data-target="#pay"
                  @click="
                    this.editHodim = hodim;
                    this.editHodim.password = '';
                  "
                >
                  <span class="fa fa-coins" />
                </button>
              </div>
              <div class="col">
                <button
                  class="btn btn-sm btn-block btn-outline-warning"
                  data-toggle="modal"
                  data-target="#hodimEdit"
                  @click="
                    this.editHodim = hodim;
                    this.editHodim.password = '';
                  "
                >
                  <span class="far fa-edit" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12">
        <Pagination
          :page="hodimlar.current_page"
          :pages="hodimlar.pages"
          :limit="hodimlar.limit"
          @get="get"
        />
      </div>
    </div>
  </div>

  <div class="modal fade" id="hodimQoshish">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Hodim qo'shish</h4>
        </div>
        <form @submit.prevent="post(yangiHodim)">
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                Ism
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="yangiHodim.name"
                />
              </div>
              <div class="col-md-6">
                Telefon raqami
                <label class="input-group input-group-sm">
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
                    v-model="yangiHodim.phone"
                  />
                </label>
              </div>
              <div class="col-md-12">
                Kunlik ish haqqi
                <div class="input-group input-group-sm">
                  <input
                    class="form-control"
                    type="number"
                    step="any"
                    min="0"
                    required
                    v-model="yangiHodim.daily_money"
                  />
                  <div class="input-group-text">so'm</div>
                </div>
              </div>
              <div class="col-md-12" v-if="yangiHodim.role == 'logistika'">
                <div class="row">
                  <div class="col-6">
                    Kunlik buyurtma limit
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        class="form-control"
                        min="1"
                        v-model="yangiHodim.daily_limit"
                      />
                      <div class="input-group-text">dona</div>
                    </div>
                  </div>
                  <div class="col-6">
                    Kunlik buyurtma limit bajarilgandagi bonus
                    <div class="input-group input-group-sm">
                      <input
                        type="number"
                        class="form-control"
                        min="1"
                        v-model="yangiHodim.daily_limit_money"
                      />
                      <div class="input-group-text">so'm</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12">
                Vazifasi
                <select
                  class="form-control form-control-sm"
                  required
                  v-model="yangiHodim.role"
                >
                  <option hidden value="">role</option>
                  <option v-if="role == 'admin'" value="cashier">Kassir</option>
                  <option v-if="role == 'admin'" value="branch_admin">
                    Filial admin
                  </option>
                  <option v-if="role == 'admin'" value="logistika">
                    Logistika
                  </option>
                  <option v-if="role == 'admin'" value="warehouseman">
                    Omborchi
                  </option>
                  <option value="seller">Sotuvchi</option>
                  <option value="worker">Transport</option>
                  <option value="ustanovshik">Ustanovshik</option>
                </select>
              </div>
              <div
                class="col-md-12"
                v-if="yangiHodim.role == ('branch_admin' || 'seller')"
              >
                Filial
                <select
                  class="form-control form-control-sm"
                  required
                  v-model="yangiHodim.branch_id"
                >
                  <option v-for="item in branches" :key="item" :value="item.id">
                    {{ item.id }}
                  </option>
                </select>
              </div>
              <div class="col-md-12" v-if="yangiHodim.role == 'warehouseman'">
                Ombor
                <select
                  class="form-control form-control-sm"
                  required
                  v-model="yangiHodim.branch_id"
                >
                  <option
                    v-for="item in warehouses"
                    :key="item"
                    :value="item.id"
                  >
                    {{ item.id }}
                  </option>
                </select>
              </div>
              <div class="col-md-6">
                Foydalanuvchi nomi
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="foydalanuvchi nomi"
                  required
                  v-model="yangiHodim.username"
                />
              </div>
              <div class="col-md-6">
                Parol
                <input
                  class="form-control form-control-sm"
                  type="password"
                  placeholder="parol"
                  required
                  v-model="yangiHodim.password"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="hodimEdit">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ editHodim.name }} ma'lumotlarini tahrirlash</h4>
        </div>
        <form @submit.prevent="put(editHodim)">
          <div class="modal-body">
            <div class="row mb-2">
              <div class="col-md-6">
                Ism
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="ism"
                  required
                  v-model="editHodim.name"
                />
              </div>
              <div class="col-md-6">
                Telefon raqami
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
                    v-model="editHodim.phone"
                  />
                </div>
              </div>
              <div class="col-md-12">
                Kunlik ish haqqi
                <div class="input-group input-group-sm">
                  <input
                    class="form-control"
                    type="number"
                    step="any"
                    min="0"
                    required
                    v-model="editHodim.daily_money"
                  />
                  <div class="input-group-text">so'm</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                Status
                <select
                  class="form-control form-control-sm"
                  required
                  v-model="editHodim.status"
                >
                  <option selected disabled hidden value="">Status</option>
                  <option value="true">Faol</option>
                  <option value="false">Nofaol</option>
                </select>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                Foydalanuvchi nomi
                <input
                  class="form-control form-control-sm"
                  type="text"
                  placeholder="foydalanuvchi nomi"
                  required
                  v-model="editHodim.username"
                />
              </div>
              <div class="col-md-6">
                Parol
                <input
                  class="form-control form-control-sm"
                  type="password"
                  placeholder="parol"
                  v-model="editHodim.password"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-primary">
              <span class="far fa-circle-check" />
            </button>
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <span class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="pay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ editHodim.name }} dan pul olish</h4>
        </div>
        <form @submit.prevent="payToUser(paying)">
          <div class="modal-body">
            <div class="row gap-1 text-left">
              <div class="col-12">
                Kassa
                <select class="form-select" required v-model="paying.kassa_id">
                  <option v-for="item in cashiers" :key="item" :value="item.id">
                    {{ item.name }}
                  </option>
                </select>
              </div>
              <div class="col-12">
                Summa
                <div class="input-group">
                  <input
                    type="number"
                    step="any"
                    min="0"
                    class="form-control"
                    placeholder="summa"
                    required
                    v-model="paying.money"
                  />
                  <div class="input-group-append">
                    <div class="input-group-text">so'm</div>
                  </div>
                </div>
              </div>
              <div class="col-12">
                Izoh
                <textarea
                  type="textarea"
                  class="form-control"
                  placeholder="izoh"
                  v-model="paying.comment"
                ></textarea>
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

  <payToUser ref="payToUser" @end="get(0, 100)" />
</template>

<script>
import * as api from "@/components/Api/Api";
import Pagination from "@/components/Pagination/Pagination.vue";
import payToUser from "@/components/modal/payToUser.vue";
export default {
  name: "Hodimlar",
  components: { Pagination, payToUser },
  data() {
    return {
      _: Intl.NumberFormat(),
      role: localStorage.getItem("role"),
      branch_id: localStorage.getItem("branch_id"),
      search: "",
      branches: [],
      warehouses: [],
      hodimlar: { current_page: 0, pages: 1, limit: 25, data: [] },
      cashiers: [],
      yangiHodim: {
        id: 0,
        name: "",
        username: "",
        password: "",
        role: "",
        branch_id: 0,
        phone: null,
        daily_money: null,
        status: true,
        daily_limit: null,
        daily_limit_money: null,
      },
      editHodim: {},
      branch: null,
      currency: null,
      paying: {
        money: null,
        currency_id: 0,
        from_: null,
        comment: "",
        kassa_id: 0,
      },
    };
  },
  created() {
    this.get(0, 100);
    this.getBranches();
    this.getWarehouses();
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
    getBranches() {
      api.branches().then((res) => {
        this.branches = res.data;
      });
    },
    getWarehouses() {
      api.warehouses().then((res) => {
        this.warehouses = res.data;
      });
    },
    get(page, limit) {
      api.users(0, 0, [], page, limit).then((Response) => {
        this.hodimlar = Response.data;
      });
    },
    post(data) {
      data.daily_limit = data.daily_limit || 0;
      data.daily_limit_money = data.daily_limit_money || 0;
      api.createUser(data).then((Response) => {
        this.yangiHodim = {
          id: 0,
          name: "",
          username: "",
          password: "",
          role: "",
          branch_id: "",
          phone: null,
          status: true,
          daily_limit: null,
          daily_limit_money: null,
        };
        api.success(0).then(() => {
          this.get(0, 100);
        });
      });
    },
    put(data) {
      api.updateUser(data).then((Response) => {
        api.success(1).then(() => {
          this.get(0, 100);
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
  overflow-y: auto;
  max-height: 80vh;
}
</style>
