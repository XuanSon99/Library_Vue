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
    "Authorization": "Bearer " + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZjIzN2Y0NzQzNzBkYjY3ZTRjZWJlNWU4MTc1OTQ3NDRhY2Q5Njk0MWM5ZGM1NzMyMDIyMTI3NDc3MGJjNzNjYTk4ODY0Nzk2M2ZhMjJlM2MiLCJpYXQiOjE2MTQ5MzQ0OTAsIm5iZiI6MTYxNDkzNDQ5MCwiZXhwIjoxNjQ2NDcwNDkwLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.ijLH7JIOeZrKwe4_VJvCz3WglrFKzmfqyxJ2LEzJOtFtWJ2zRu7Af4L28xYrRXBLgu_DVv8EsIo5DEkz_nbLWEK9mQrSxKlNuna0u3d1wJ419KyLckS2QADDwIr6RV9dIbdmVjx8MUC4OX4z9XWRoctpbM0nhO0VTqrNp_XTUFVvw0_nQ6pNPfkim1tiJJaqHrTKgecQu7JU0zkTIAlg7dWEepeaddH-7eFf_bxH7pH9ddhO2OMKfx0DOpmFflHYNFH3UkOEY5d5SwCqWBobxmOS2TP_-QeT9oHVd6KJlZluoHJExeFocSihUbxTJooSXcJWrVjyEFFGYw99Qo72ZL55RpRmOGil5IT6sJ9RXOxervsH6XMKooRL7fTmVVeILRChdpNe9sXlaW1TW7elbleC6Py7ZTnf6uhsymweDce2Sjsr9ix9kZiEbc_xnGCyYlSZyHbQaSTUkChJnHmcFrlWOJlIrLqiDVC88wPDydeqC0px962TN0sySBCUh7_HRI9pW50FMl-EAr2XO11sfgSqGq9svNz5dhLTuSt_2dtuIiv51rLPzrwYDM2Q6-vKy6w28c8vP_sr05vuv2Zk5Awp_-7ZqNULa3IFc_JU9GqYoEtyzszXG8xj_JSvOSqs-HGMTheMZorTGrEQWfV70mZesVBXdcQh4lHzcZMhnXk',
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
