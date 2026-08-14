import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueViewer from "v-viewer";
import i18n from "./i18n";
import { createPinia } from "pinia";
import Toast from "vue3-toastify";

// Styles
import "./index.css";
import "./styles/fonts.scss";
import "vue3-toastify/dist/index.css";
import "element-plus/dist/index.css";
import "viewerjs/dist/viewer.css";
import { registerPermissionDirective } from "./directives/permission";

const options = {
  autoClose: 1000, // Auto close in 3 seconds
  closeOnClick: true,
};

// Directives
const pinia = createPinia();

const app = createApp(App);

registerPermissionDirective(app);
app.use(router);
app.use(pinia);
app.use(VueViewer);
app.use(i18n);
app.use(Toast, options);

app.mount("#app");
