<template>
  <h3><span class="fa fa-signature" /> Nomenklatura</h3>
  <div class="row">
    <div class="col-md-4">
      <button
        class="btn btn-sm btn-block btn-outline-success"
        data-toggle="modal"
        data-target="#add-example"
      >
        Nomenklatura qo'shish
      </button>
    </div>
    <div class="col-md-4 mb-1">
      <div class="input-group input-group-sm">
        <input
          type="search"
          class="form-control form-control-sm"
          placeholder="qidiruv"
          v-model="search"
          @keyup="getExamples(0, 25)"
        />
        <div class="input-group-text">
          <i class="fa fa-search"></i>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="dropdown">
        <button
          id="customerDropdown"
          class="btn btn-sm btn-block btn-outline-primary dropdown-toggle"
          data-toggle="dropdown"
          @click="getCategories()"
        >
          {{ category?.name || "Kategoriya" }}
        </button>
        <div class="dropdown-menu w-100 p-1" aria-labelledby="customerDropdown">
          <ul
            class="list-group p-1 responsive"
            style="max-height: 25vh"
            @scroll="scrollCategories($event)"
          >
            <li
              class="list-group-item p-2"
              @click="
                category = null;
                getExamples(0, 25);
              "
            >
              Hammasi
            </li>
            <li
              class="list-group-item p-2"
              v-for="item in categories.data"
              :key="item"
              @click="
                category = item;
                getExamples(0, 25);
              "
            >
              {{ item.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <hr />

  <div class="responsive" style="max-height: 80vh">
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Kategoriya</th>
          <th>Kodi</th>
          <th>Artikul</th>
          <th>Nomi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in examples.data" :key="item">
          <td>{{ item.Categories.name }}</td>
          <td>{{ item.Product_examples.code }}</td>
          <td>{{ item.Product_examples.articul }}</td>
          <td>{{ item.Product_examples.name }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4">
            <Pagination
              :page="examples.current_page"
              :pages="examples.pages"
              :limit="examples.limit"
              @get="getExamples"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

  <div class="modal fade" id="add-example">
    <div class="modal-dialog">
      <form class="modal-content" @submit.prevent="postExample()">
        <div class="modal-header">
          <h4>Nomenklatura qo'shish</h4>
        </div>
        <div class="modal-body">
          <div class="row gap-1 text-left">
            <div class="col-12">
              Kategoriya
              <div class="dropdown">
                <button
                  type="button"
                  id="customerDropdown"
                  class="btn btn-block btn-outline-primary dropdown-toggle"
                  data-toggle="dropdown"
                  @click="getCategories()"
                >
                  {{ category_1?.name || "Kategoriya" }}
                </button>
                <div
                  class="dropdown-menu w-100 p-1"
                  aria-labelledby="customerDropdown"
                >
                  <ul
                    class="list-group p-1 responsive"
                    style="max-height: 25vh"
                    @scroll="scrollCategories($event)"
                  >
                    <li
                      class="list-group-item p-2"
                      v-for="item in categories.data"
                      :key="item"
                      @click="category_1 = item"
                    >
                      {{ item.name }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12">
              Nomi
              <input
                type="text"
                class="form-control"
                required
                v-model="example.name"
              />
            </div>
            <div class="col-12">
              Artikul
              <input
                type="text"
                class="form-control"
                required
                v-model="example.articul"
              />
            </div>
            <div class="col-12">
              Kodi
              <input
                type="text"
                class="form-control"
                required
                v-model="example.code"
              />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-outline-primary" :disabled="!category_1">
            <i class="far fa-circle-check"></i>
          </button>
          <button
            class="btn btn-outline-danger"
            data-dismiss="modal"
            close-example-modal
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
import Pagination from "@/components/Pagination/Pagination.vue";
export default {
  name: "nomenklatura",
  components: { Pagination },
  data() {
    return {
      categories: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      category: null,
      category_1: null,
      search: "",
      examples: {
        current_page: 0,
        pages: 1,
        limit: 25,
        data: [],
      },
      example: {
        category_id: 0,
        name: "",
        articul: "",
        code: "",
      },
    };
  },
  created() {
    this.getCategories();
    this.getExamples(0, 25);
  },
  methods: {
    getCategories() {
      api.categories(0, 0, 25).then((res) => {
        this.categories = res.data;
      });
    },
    scrollCategories(event) {
      const element = event.target;
      if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
        if (this.categories.current_page < this.categories.pages) {
          api
            .categories(0, this.categories.current_page + 1, 25)
            .then((res) => {
              this.categories.current_page = res.data.current_page;
              this.categories.pages = res.data.pages;
              this.categories.data = this.categories.data.concat(res.data.data);
            });
        }
      }
    },
    getExamples(page, limit) {
      const category_id = this.category?.id || 0;
      api.productExamples(this.search, category_id, page, limit).then((res) => {
        this.examples = res.data;
      });
    },
    postExample() {
      this.example.category_id = this.category_1.id;
      api.addProductExample(this.example).then(() => {
        api.success("close-example-modal").then(() => {
          this.example = {
            category_id: 0,
            name: "",
            articul: "",
            code: "",
          };
          this.category_1 = null;
          this.getExamples(0, 25);
        });
      });
    },
  },
};
</script>

<style scope>
p {
  margin: 0;
  width: 100%;
  font-size: small;
}
</style>
