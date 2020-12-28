<template>
  <v-container grid-list-xl fluid>
    <v-layout row wrap>
      <v-flex lg12>
        <v-card class="mb-4">
          <v-toolbar color="primary" dark flat dense cad>
            <v-toolbar-title class="subheading">
              Thông tin khách hàng
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-divider />
          <v-card-text>
            <v-form v-if="!isEdit || (isEdit && email)" ref="form" v-model="valid" lazy-validation @submit.prevent="save">
              <v-container fluid>
                <v-row align="center">
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field v-model="firstName" :rules="firstNameRules" label="Họ" required />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field v-model="lastName" :rules="lastNameRules" label="Tên" required />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      v-model="email"
                      :rules="emailRules"
                      label="E-mail"
                      autocomplete="new-password"
                      required
                      :disabled="isEdit"
                    />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      v-model="mobile"
                      :rules="mobileRules"
                      label="Số điện thoại"
                      required
                    />
                  </v-col>
                  <v-col v-if="!isEdit" class="d-flex" cols="12" sm="6">
                    <v-text-field
                      v-model="password"
                      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="showPassword ? 'text' : 'password'"
                      :rules="passwordRules"
                      label="Mật khẩu"
                      autocomplete="new-password"
                      required
                      @click:append="showPassword = !showPassword"
                    />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      v-model="street"
                      :rules="streetRules"
                      label="Địa chỉ đường"
                      required
                    />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field v-model="state" :rules="stateRules" label="Quận/Huyện" required />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      v-model="city"
                      :rules="cityRules"
                      label="Tỉnh/Thành phố"
                      required
                    />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field
                      v-model="postcode"
                      :rules="postcodeRules"
                      label="Postcode"
                      required
                    />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-select
                      v-model="status"
                      :items="statusItems"
                      :rules="[v => !!v || 'Vui lòng chọn 1 trạng thái']"
                      label="Trạng thái tài khoản"
                      required
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn type="submit" :disabled="!valid" :loading="loading" color="primary" class="mr-4">
                      Lưu Lại
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-layout />
    </v-layout>
  </v-container>
</template>
<script>
import {
  ACCOUNT_ACTIVE,
  ACCOUNT_INACTIVE,
  getStatusAccountName
} from '@/utils'
import { createUser, getUser, updateUser } from '@/api/user'

export default {
  data: () => ({
    loading: false,
    isEdit: false,
    valid: true,
    firstName: '',
    firstNameRules: [v => !!v || 'Vui lòng nhập Họ'],
    lastName: '',
    lastNameRules: [v => !!v || 'Vui lòng nhập Tên'],
    email: '',
    emailRules: [
      v => !!v || 'Vui lòng nhập E-mail',
      v => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ'
    ],
    password: '',
    showPassword: false,
    passwordRules: [v => !!v || 'Vui lòng nhập mật khẩu'],
    mobile: '',
    mobileRules: [v => !!v || 'Vui lòng nhập số điện thoại'],
    street: '',
    streetRules: [v => !!v || 'Vui lòng nhập địa chỉ đường'],
    state: '',
    stateRules: [v => !!v || 'Vui lòng nhập Quận/Huyện'],
    city: '',
    cityRules: [v => !!v || 'Vui lòng nhập Tỉnh/Thành Phố'],
    postcode: '',
    postcodeRules: [v => !!v || 'Vui lòng nhập Postcode'],
    status: ACCOUNT_INACTIVE,
    statusItems: [
      {
        value: ACCOUNT_INACTIVE,
        text: getStatusAccountName(ACCOUNT_INACTIVE)
      },
      {
        value: ACCOUNT_ACTIVE,
        text: getStatusAccountName(ACCOUNT_ACTIVE)
      }
    ]
  }),
  created () {
    const id = this.$route.params && this.$route.params.id
    this.isEdit = id && id !== 'add'
    if (this.isEdit) {
      this.$store.commit('SET_PAGE_HEADER_TITLE', 'Thay đổi thông tin khách hàng')
      this.fetchData(id)
    } else {
      this.$store.commit('SET_PAGE_HEADER_TITLE', 'Thêm khách hàng')
    }
  },
  methods: {
    fetchData (id) {
      getUser(id)
        .then((res) => {
          const user = res.data
          this.email = user.email
          this.firstName = user.firstName
          this.lastName = user.lastName
          this.mobile = user.mobile
          this.street = user.street
          this.state = user.state
          this.city = user.city
          this.postcode = user.postcode
          this.status = user.status
        })
        .catch(() => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', `Không tìm thấy kết quả với id = ${id}`)
        })
    },
    save () {
      const valid = this.$refs.form.validate()
      if (!valid) {
        this.$store.commit('SET_SNACKBAR', true)
        this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
        this.$store.commit('SET_NOTIFY_MESSAGE', 'Trường dữ liệu không hợp lệ')
        return false
      }
      this.$store.commit('SET_NOTIFY_MESSAGE', null)
      const userInfo = {
        firstName: this.firstName.trim(),
        lastName: this.lastName.trim(),
        mobile: this.mobile.trim(),
        street: this.street.trim(),
        state: this.state.trim(),
        city: this.city.trim(),
        postcode: this.postcode.trim(),
        avatar: null,
        referrerId: null,
        status: this.status
      }
      if (!this.isEdit) {
        userInfo.email = this.email
        userInfo.password = this.password
      }
      this.loading = true
      const id = this.$route.params && this.$route.params.id
      const saveUser = () =>
        this.isEdit ? updateUser(id, userInfo) : createUser(userInfo)
      return saveUser()
        .then(({ data }) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'teal')
          this.$store.commit('SET_NOTIFY_MESSAGE', 'Lưu dữ liệu thành công')
          if (!this.isEdit) {
            this.$refs.form.reset()
          }
          this.$router.go(-1)
        })
        .catch((error) => {
          this.loading = false
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    }
  }
}
</script>
