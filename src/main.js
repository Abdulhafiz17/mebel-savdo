import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./libraries/qrcodejs/jquery.min.js";
import "./libraries/qrcodejs/qrcode.js";

createApp(App).use(router).use(store).mount("#app");
