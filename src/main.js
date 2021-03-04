// =========================================================
// * Vuetify Material Dashboard - v2.1.0
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vuetify-material-dashboard
// * Copyright 2019 Creative Tim (https://www.creative-tim.com)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import axios from 'axios'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
});

Vue.config.productionTip = false


Vue.prototype.$urlAPI = 'http://127.0.0.1:8000/api/'

Vue.prototype.$config = {
  headers: {
    // "token": "Bearer" + localStorage.getItem("token"),
    "Authorization": "Bearer " + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiMWIwMzY5N2U0YWJjMmYzMmM3ZTc5ZDYyOWU0OWZkMTNhYjRkMGZmNmIyZGExNzA5MzJlM2U0ZDU5OGUzOGQzNGY1OTUyYzFhNWE1ODc1MDYiLCJpYXQiOiIxNjEzNzkyODI2LjExNTkxNSIsIm5iZiI6IjE2MTM3OTI4MjYuMTE1OTIwIiwiZXhwIjoiMTY0NTMyODgyNS45MzU4NTgiLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.e0t1rSrumAz09eGxF8bZTz-0uzPZMxWun97sIuctJrz-8gaSH7hAbNMk8PN7nvc_8ZNz0i4AjzC2dBPl5s4nve1AJKky_5AlEBPXIOeGk5uIttx4rnJ6bd5C1N7STF0QSlVUMc4dHWfL7MovBlAld_HCPnn3yX9Nwr8QSCvqZ3k6845ckOx4vsSCK_2SQQhmyDqlmyh0dpgBmKHsQaHwqvmiwqLec7lNKj2O7paVE-cWncOWDtRbiYK-4Mat-Rq4zpFPJCNFwYPlqKk6nE968IaxN5dxMzjGrxRhcEY-lrB2UGtSchXV0-Ppc5jococn5rqFHT9rz4OaqYIggGYWg5e5RVqD7Q378ZoC05I4PESlyf-7Zq8XTveB46JwOjzE0rW8LiK5vvF4_xlmo6nqGhOnWeOw-JytIF1zBg426feVC0F08RgPKySZmbDgI8U7Db-bvdVPIb8UknGS2MYxtesLph1pte6qcOj4XHQ0-wFE8ncmfRA-AYxqyHCeQarqIwJaHMOJHXj5wr_FB-ilBUjQ6IIdJKzwaRrSDJUi2XCjcrLjN54LxRLryfY6PajA3OxpwsupwfHH8T0YOpRJeUvAiUyVmw0O0Urn0QxqIp3Vr0igvVLkdTolR_3TU4-gfewxyqZ444ganEkl7Jp1KPK9_bWiI0Vy_UaepF45_HQ',
  },
};

Vue.prototype.CallAPI = function (method, url, data, callResponse, callError) {
  switch (method) {
    case "post":
      axios.post(this.$urlAPI + url, data, this.$config).then((response) => {
        if (response.data.statusCode === 401) {
          sessionStorage.clear();
          location.reload();
        }
        callResponse(response)
      })
        .catch((error) => {
          callError(error)
        })
      break;
    case "get":
      axios.get(this.$urlAPI + url, this.$config)
        .then((response) => {
          if (response.data.statusCode === 401) {
            sessionStorage.clear();
            location.reload();
          }
          callResponse(response)
        })
        .catch((error) => {
          callError(error)
        })
      break;
    case "put":
      axios.put(this.$urlAPI + url, data, this.$config)
        .then((response) => {
          if (response.data.statusCode === 401) {
            sessionStorage.clear();
            location.reload();
          }
          callResponse(response)
        })
        .catch((error) => {
          callError(error)
        })
      break;
    case "delete":
      axios.delete(this.$urlAPI + url, this.$config)
        .then((response) => {
          if (response.data.statusCode === 401) {
            sessionStorage.clear();
            location.reload();
          }
          callResponse(response)
        })
        .catch((error) => {
          callError(error)
        })
      break;
  }
}

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
