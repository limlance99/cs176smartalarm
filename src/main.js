import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Ionic from '@ionic/vue';
import '@ionic/core/css/ionic.bundle.css';
import './registerServiceWorker';
import "./assets/index.scss";
// import VueScrollPicker from "vue-scroll-picker"

// Vue.use(VueScrollPicker)

// import SmoothPicker from 'vue-smooth-picker'
// import 'vue-smooth-picker/dist/css/style.css'
// Vue.use(SmoothPicker)
Vue.use(Ionic);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
