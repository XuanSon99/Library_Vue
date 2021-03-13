<template>
  <div class="login">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        v-model="email"
        :rules="emailRules"
        label="Email"
        required
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        type="password"
        required
      ></v-text-field>
      <v-btn :disabled="!valid" color="success" class="mr-4" @click="login">
        Login
      </v-btn>
    </v-form>
  </div>
</template>
<script>
export default {
  data: () => ({
    valid: true,
    email: "",
    password: "",
    emailRules: [
      (v) => !!v || "Email is required",
      (v) => /.+@.+\..+/.test(v) || "Email must be valid",
    ],
    passwordRules: [(v) => !!v || "Password is required"],
  }),

  methods: {
    login() {
      this.$refs.form.validate();
      this.CallAPI(
        "post",
        "auth/login",
        {
          email: this.email,
          password: this.password,
        },
        (reponse) => {
          localStorage.setItem("token", reponse.data.access_token);
          this.$router.push("/scores");
        },
        (error) => {
          this.$toast.error("Tài khoản hoặc mật khẩu không đúng");
        }
      );
    },
  },
};
</script>
<style>
.login {
  background: url("https://edulinks.vn/wp-content/uploads/2019/06/canada-33723235-1468496086-ImageGalleryLightboxLarge.jpg")
    center;
  background-size: cover;
  width: 100vw;
  height: 100vh;
  padding: 25vh 0;
}
.login form {
  width: 400px;
  margin: 0 auto;
  padding: 50px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  box-shadow: 5px 5px 15px 5px #000;
}
</style>