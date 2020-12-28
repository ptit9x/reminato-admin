<template>
  <div id="page-detail-staff">
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex xl6 md4>
          <profile-user :user="staff" />
        </v-flex>
        <v-flex xl6 md8>
          <v-tabs
            background-color="primary"
            dark
          >
            <v-tab>
              <v-icon left>
                mdi-account
              </v-icon>
              Cập nhật tài khoản
            </v-tab>
            <v-tab>
              <v-icon left>
                mdi-lock
              </v-icon>
              Đổi mật khẩu
            </v-tab>

            <v-tab-item>
              <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
                <v-container fluid>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="6">
                      <v-text-field v-model="fullName" :rules="fullNameRules" label="Họ" required />
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="6">
                      <v-text-field v-model="email" :rules="emailRules" label="E-mail" required disabled />
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="6">
                      <v-text-field
                        v-model="mobile"
                        :rules="mobileRules"
                        label="Số điện thoại"
                        required
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
            </v-tab-item>
            <v-tab-item>
              <v-form ref="formUpdatePassword" v-model="validChangePassword" lazy-validation @submit.prevent="savePassword">
                <v-container fluid>
                  <v-row align="center">
                    <v-col class="d-flex" cols="12" sm="6">
                      <v-text-field
                        v-model="oldPassword"
                        :append-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showOldPassword ? 'text' : 'password'"
                        :rules="oldPasswordRules"
                        label="Mật khẩu cũ"
                        autocomplete="new-password"
                        required
                        @click:append="showOldPassword = !showOldPassword"
                      />
                    </v-col>
                    <v-col class="d-flex" cols="12" sm="6">
                      <v-text-field
                        v-model="newPassword"
                        :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showNewPassword ? 'text' : 'password'"
                        :rules="newPasswordRules"
                        label="Mật khẩu mới"
                        autocomplete="new-password"
                        required
                        @click:append="showNewPassword = !showNewPassword"
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
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import ProfileUser from '@/components/ProfileUser'
import { getInfo, updateProfile, updatePassword } from '@/api/staff'
import {
  getStatusAccountName,
  getColorAccountStatus
} from '@/utils'

export default {
  components: {
    ProfileUser
  },
  data: () => ({
    loading: false,
    staff: null,
    valid: true,
    fullName: '',
    fullNameRules: [v => !!v || 'Vui lòng nhập Họ'],
    email: '',
    emailRules: [
      v => !!v || 'Vui lòng nhập E-mail',
      v => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ'
    ],
    mobile: '',
    mobileRules: [v => !!v || 'Vui lòng nhập số điện thoại'],
    address: '',
    addressRules: [v => !!v || 'Vui lòng nhập địa chỉ'],
    validChangePassword: true,
    oldPassword: '',
    showOldPassword: false,
    oldPasswordRules: [v => !!v || 'Vui lòng nhập mật khẩu cũ'],
    newPassword: '',
    showNewPassword: false,
    newPasswordRules: [v => !!v || 'Vui lòng nhập mật khẩu mới']
  }),
  created () {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Hồ sơ của bạn')
    this.fetchData()
  },
  methods: {
    fetchData () {
      getInfo()
        .then((res) => {
          const staff = res.data
          this.staff = staff

          this.email = staff.email
          this.fullName = staff.fullName
          this.mobile = staff.mobile
          this.address = staff.address
          this.roleName = staff.roleName
        })
        .catch((error) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    },
    getColorStatus (status) {
      return getColorAccountStatus(status)
    },
    getStatusName (status) {
      return getStatusAccountName(status)
    },
    getStatusIcon (status) {
      const names = {
        INACTIVATED: 'mdi-close-box',
        ACTIVATED: 'mdi-check-circle'
      }

      return names[status] || ''
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
        roleCode: this.roleCode,
        status: this.status
      }
      this.loading = true
      return updateProfile(staffInfo)
        .then(({ data }) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'teal')
          this.$store.commit('SET_NOTIFY_MESSAGE', 'Cập nhật thông tin thành công')

          this.$store.commit('SET_NAME', this.fullName)
          this.staff.fullName = this.fullName
          this.staff.email = this.email
          this.staff.mobile = this.mobile
          this.staff.address = this.address
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    },
    savePassword () {
      const valid = this.$refs.formUpdatePassword.validate()
      if (!valid) {
        this.$store.commit('SET_SNACKBAR', true)
        this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
        this.$store.commit('SET_NOTIFY_MESSAGE', 'Trường dữ liệu không hợp lệ')
        return false
      }
      this.$store.commit('SET_NOTIFY_MESSAGE', null)
      const staffInfo = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      }

      return updatePassword(staffInfo)
        .then(({ data }) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'teal')
          this.$store.commit('SET_NOTIFY_MESSAGE', 'Đổi mật khẩu thành công, vui lòng đăng nhập lại!')

          this.$store.commit('SET_TOKEN', '')
          this.$store.commit('SET_REFRESH_TOKEN', '')
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
