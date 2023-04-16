<template>
  <button v-show="false" data-toggle="modal" data-target="#gallery"></button>
  <div class="modal fade" id="gallery">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="">
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button class="btn btn-outline-danger" data-dismiss="modal">
              <i class="far fa-circle-xmark" />
            </button>
          </div>
        </form>
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
      files: [],
    };
  },
  methods: {
    start(order_id) {
      this.files = [];

      this.getFiles(order_id);
    },
    getFiles(id) {
      api.orderPhotos(id).then((res) => {
        this.files = res.data;
        console.log(res.data);
      });
    },
  },
};
</script>
