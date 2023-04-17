<template>
  <button
    v-show="false"
    data-toggle="modal"
    data-target="#cashier"
    cashier-modal-button
  ></button>
  <div class="modal fade" id="cashier">
    <div class="modal-dialog">
      <form
        class="modal-content"
        @submit.prevent="method == 'post' ? postCashier() : putCashier()"
      >
        <div class="modal-header">
          <h4>{{ method == "post" ? "Qo'shish" : "Tahrirlash" }}</h4>
        </div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              Nomi
              <input
                type="text"
                class="form-control"
                required
                v-model="data.name"
              />
            </div>
            <div class="col-12">
              Izoh
              <input
                type="text"
                class="form-control"
                required
                v-model="data.comment"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary">
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-cashier-modal
          >
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api.js";
export default {
  name: "cashierModal",
  data() {
    return {
      method: "post" || "put",
      data: {
        name: "",
        comment: "",
      },
    };
  },
  methods: {
    start(method, data) {
      this.method = method;
      if (this.method == "post") {
        this.data = {
          name: "",
          comment: "",
        };
      } else {
        this.data.id = data.id;
        this.data.name = data.name;
        this.data.comment = data.comment;
      }
      document.querySelector(`[cashier-modal-button]`).click();
    },
    postCashier() {
      api.createKassa(this.data).then(() => {
        api.success("close-cashier-modal").then(() => {
          this.$parent.getCashiers();
        });
      });
    },
    putCashier() {
      api.updateKassa(this.data).then(() => {
        api.success("close-cashier-modal").then(() => {
          this.$parent.getCashiers();
        });
      });
    },
  },
};
</script>
