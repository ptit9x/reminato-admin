<template>
  <v-container grid-list-xl fluid>
    <v-layout row wrap>
      <v-flex lg12>
        <v-card class="mb-4">
          <v-toolbar color="primary" dark flat dense cad>
            <v-toolbar-title class="subheading">
              {{ getTitle() }}
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-divider />
          <v-card-text class>
            <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
              <v-container fluid>
                <v-row align="center">
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-text-field v-model="fullName" :rules="fullNameRules" label="Họ Tên" required />
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
                      v-model="address"
                      :rules="addressRules"
                      label="Địa chỉ"
                      required
                    />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-select
                      v-model="roleId"
                      :items="roles"
                      :rules="[v => !!v || 'Vui lòng chọn 1 vai trò']"
                      label="Vai trò"
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
                    <v-btn type="submit" :disabled="!valid" color="primary" class="mr-4">
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
import { createStaff, getStaff, updateStaff } from '@/api/staff'
import { getListRole } from '@/api/role'

export default {
  data: () => ({
    isEdit: false,
    valid: true,
    fullName: '',
    fullNameRules: [v => !!v || 'Vui lòng nhập Họ Tên'],
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
    address: '',
    addressRules: [v => !!v || 'Vui lòng nhập địa chỉ'],
    roleId: null,
    roles: [],
    status: ACCOUNT_ACTIVE,
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
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Thêm nhân viên')
    if (this.isEdit) {
      this.$store.commit('SET_PAGE_HEADER_TITLE', 'Thay đổi thông tin nhân viên')
      this.fetchData(id)
    }
    this.getListRole()
  },
  methods: {
    fetchData (id) {
      getStaff(id)
        .then((res) => {
          const staff = res.data
          this.email = staff.email
          this.fullName = staff.fullName
          this.mobile = staff.mobile
          this.address = staff.address
          this.roleId = staff.roleId
          this.status = staff.status
        })
        .catch((error) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    },
    getTitle () {
      return this.isEdit ? 'Cập nhật nhân viên' : 'Thêm nhân viên'
    },
    save () {
      const valid = this.$refs.form.validate()
      if (!valid) {
        this.$store.commit('SET_SNACKBAR', true)
        this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
        this.$store.commit('SET_NOTIFY_MESSAGE', 'Trường dữ liệu không hợp lệ')
        return false
      }
      const staffInfo = {
        email: this.email,
        fullName: this.fullName,
        mobile: this.mobile,
        address: this.address,
        avatar: null,
        roleId: this.roleId,
        status: this.status
      }
      if (!this.isEdit) {
        staffInfo.password = this.password
      }

      const id = this.$route.params && this.$route.params.id
      const savestaff = () => this.isEdit ? updateStaff(id, staffInfo) : createStaff(staffInfo)
      return savestaff()
        .then(() => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'teal')
          this.$store.commit('SET_NOTIFY_MESSAGE', 'Lưu dữ liệu thành công')
          if (!this.isEdit) {
            this.$refs.form.reset()
          }
          this.$router.go(-1)
        })
        .catch((error) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    },
    getListRole () {
      const params = {
        page: 1,
        limit: 30
      }
      return getListRole(params).then((roles) => {
        this.roles = roles.data.data.map(v => ({ value: v.id, text: v.name }))
      })
    }
  }
}
</script>
