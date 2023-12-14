import { createApp } from "vue";
import App from "./App.vue";
import init from "./init";
import router from "./router";
import { createPinia } from "pinia";
import mountServerFunctions from "./mountServerFunctions";

//创建 App
const app = createApp(App);
//挂载 pinia
app.use(createPinia());
//挂载 Vue-router
app.use(router);
init(app);
app.mount("#app");
mountServerFunctions(app);