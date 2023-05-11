<template>
  <button v-show="false" data-toggle="modal" data-target="#gallery"></button>
  <div class="modal fade" id="gallery">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Buyurtma galereyasi</h4>
        </div>
        <div class="modal-body">
          <form
            class="row gap-1 text-left"
            @submit.prevent="uploadPhoto()"
            v-if="['worker', 'ustanovshik'].includes(role)"
          >
            <div class="col-12">
              <input type="file" class="form-control" required file />
            </div>
            <div class="col-12">
              <textarea
                cols="30"
                rows="2"
                class="form-control"
                placeholder="izoh"
                v-model="comment"
              ></textarea>
            </div>
            <div class="col-12 text-right">
              <button class="btn btn-outline-success">
                <i class="fa fa-plus"></i>
              </button>
            </div>
          </form>
          <div
            class="responsive mt-1"
            :style="{
              'max-height': ['worker', 'ustanovshik'].includes(role)
                ? '40vh'
                : '60vh',
            }"
          >
            <div class="row">
              <div class="col-4 item" v-for="item in files" :key="item">
                <button
                  class="btn btn-sm btn-danger delete"
                  @click="removePhoto(item.id)"
                  v-if="['worker', 'ustanovshik'].includes(role)"
                >
                  <i class="fa fa-trash"></i>
                </button>
                <img
                  :src="image + item.logo"
                  :alt="item.logo"
                  data-toggle="modal"
                  data-target="#full-view"
                  @click="full_image = item"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark" />
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="full-view">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5>{{ full_image?.comment }}</h5>
        </div>
        <div class="modal-body" style="height: 70vh">
          <img
            v-if="full_image"
            class="full-view"
            :src="image + full_image?.logo"
            :alt="full_image?.logo"
          />
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-danger" data-dismiss="modal">
            <i class="far fa-circle-xmark"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as api from "@/components/Api/Api.js";
export default {
  name: "orderGallery",
  data() {
    return {
      role: localStorage["role"],
      image: api.url_to_files,
      order_id: 0,
      status: "",
      files: [],
      full_image: null,
      comment: "",
    };
  },
  computed: {
    toggle_button() {
      return document.querySelector(`[data-target="#gallery"]`);
    },
    input() {
      return document.querySelector("[file]");
    },
  },
  methods: {
    start(order_id, status) {
      this.order_id = order_id;
      this.status = status;
      this.files = [];

      this.getFiles();
      this.toggle_button.click();
    },
    getFiles() {
      api.orderPhotos(this.order_id, this.status).then((res) => {
        this.files = res.data;
      });
    },
    uploadPhoto() {
      let file = this.input.files[0];
      let data = new FormData();
      data.append("file", file);
      data.append("comment", this.comment || " ");
      api.uploadOrderPhoto(this.order_id, this.status, data).then(() => {
        api.success().then(() => {
          this.input.value = null;
          this.comment = "";
          this.getFiles();
        });
      });
    },
    removePhoto(id) {
      api.removeOrderPhoto(id, this.status).then(() => {
        api.success().then(() => {
          this.getFiles();
        });
      });
    },
  },
};
</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: 0.2s all;
}

img.full-view {
  object-fit: contain;
}

.item {
  position: relative;
}

.delete {
  position: absolute;
  top: 5%;
  right: 10%;
}
</style>
