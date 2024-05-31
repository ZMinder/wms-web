import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import {createPinia} from 'pinia'
import router from "./router/router.ts";
import loadMenu from './utils/loadMenuUtil'

const app = createApp(App)
const pinia = createPinia();

app.use(pinia)
app.use(ElementPlus)
app.use(router)
app.mount('#app')