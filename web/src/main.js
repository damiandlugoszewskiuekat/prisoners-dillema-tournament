import { createApp } from 'vue';
import vClickOutside from 'click-outside-vue3';
import App from './App.vue';
import router from './router';
// eslint-disable-next-line import/no-absolute-path
import '/src/style/style.scss';
import '@vuepic/vue-datepicker/dist/main.css';
import 'vue-select/dist/vue-select.css';

const app = createApp(App);

app.use(router);
app.use(vClickOutside);
app.mount('#app');
