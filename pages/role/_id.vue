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
                    <v-text-field v-model="name" :rules="nameRules" label="Tên vai trò" required />
                  </v-col>
                  <v-col class="d-flex" cols="12" sm="6">
                    <v-select
                      v-model="accesses"
                      :items="getAccessItems"
                      :rules="[v => !!v || 'Vui lòng chọn 1 quyền']"
                      label="Quyền"
                      required
                      chips
                      multiple
                      clearable
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
import { ACCESS_ALL, getAccessItems } from '@/utils'
import { createRole, getRole, updateRole } from '@/api/role'

export default {
  data: () => ({
    isEdit: false,
    valid: true,
    name: '',
    nameRules: [v => !!v || 'Vui lòng nhập Họ Tên'],
    accesses: []
  }),
  computed: {
    getAccessItems () {
      return getAccessItems()
    }
  },
  created () {
    const id = this.$route.params && this.$route.params.id
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Thêm Vai trò & Quyền')
    this.isEdit = id && id !== 'add'
    if (this.isEdit) {
      this.$store.commit('SET_PAGE_HEADER_TITLE', 'Thay đổi Vai trò & Quyền')
      this.fetchData(id)
    }
  },
  methods: {
    fetchData (id) {
      getRole(id)
        .then((res) => {
          const role = res.data
          this.name = role.name
          this.accesses = role.access.split(',')
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
      const roleInfo = {
        name: this.name,
        access: this.accesses.includes(ACCESS_ALL) ? ACCESS_ALL : this.accesses.join(',')
      }

      const id = this.$route.params && this.$route.params.id
      const saverole = () => this.isEdit ? updateRole(id, roleInfo) : createRole(roleInfo)
      return saverole()
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
    }
  }
}
</script>
