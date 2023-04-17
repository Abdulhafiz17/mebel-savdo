import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import util from "./util/util";
import "./libraries/qrcodejs/jquery.min.js";
import "./libraries/qrcodejs/qrcode.js";

const app = createApp(App);

app.config.globalProperties.$util = util;

app.use(router).use(store).mount("#app");
