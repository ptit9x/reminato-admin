<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4 lg3>
        <v-card class="elevation-1 pa-3">
          <v-form ref="loginForm" @submit.prevent="doLogin">
            <v-card-text>
              <div class="layout column align-center">
                <h1 class="flex my-4 primary--text title-login">
                  Trang quản trị Cốc giấy
                </h1>
              </div>
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="E-mail"
                placeholder="Email"
                required
                name="email"
                prepend-icon="mdi-account"
              />
              <v-text-field
                v-model="password"
                :rules="passwordRules"
                label="Password"
                placeholder="Mật khẩu"
                name="password"
                prepend-icon="mdi-lock"
                type="password"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn type="submit" block color="primary">
                Đăng nhập
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'public',
  loading: true,
  middleware: 'notAuthenticated',
  data: () => ({
    email: '',
    emailRules: [
      v => !!v || 'Vui lòng nhập E-mail',
      v => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ'
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Vui lòng nhập mật khẩu',
      v => (v && v.length <= 10) || 'Mật khẩu phải dưới 10 kí tự'
    ]
  }),
  methods: {
    doLogin () {
      const valid = this.$refs.loginForm.validate()
      if (!valid) {
        this.$store.commit('SET_SNACKBAR', true)
        this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
        this.$store.commit('SET_NOTIFY_MESSAGE', 'Trường dữ liệu không hợp lệ')
        return false
      }
      const userInfo = {
        email: this.email,
        password: this.password
      }
      this.$store.dispatch('login', userInfo)
        .then(() => {
          this.$router.push({
            path: this.redirect || '/',
            query: this.otherQuery
          })
        })
        .catch((error) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    }
  }
}
</script>
