<template>
  <div>
    <v-data-table
      :headers="getHeaders()"
      :items="lists"
      :options.sync="options"
      :server-items-length="totalRoles"
      :loading="loading"
      :loading-text="loadingText"
      :footer-props="footerProps"
      :no-data-text="noDataText"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Danh sách Vai trò và Quyền</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-spacer />
          <v-tooltip v-if="havePermission()" bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
                @click="goto(null)"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Thêm mới</span>
          </v-tooltip>
        </v-toolbar>
      </template>
      <template v-slot:item.access="{ item }">
        <template v-for="(v, i) in getAccesses(item.access)">
          <v-chip :key="i" class="ma-1" :color="getAccessColor(v)" dark>
            {{ formatAccessName(v) }}
          </v-chip>
        </template>
      </template>
      <template v-slot:item.id="{ item }">
        {{ getIndex(item) }}
      </template>
      <template v-slot:item.createdAt="{ item }">
        {{ formatDateTime(item.createdAt) }}
      </template>
      <template v-slot:item.updatedAt="{ item }">
        {{ formatDateTime(item.updatedAt) }}
      </template>
      <template v-if="havePermission()" v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="goto(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { getListRole, deleteRole } from '@/api/role'
import {
  ACCESS_ALL,
  ACCESS_ROLE,
  formatDateTime,
  getAccessName,
  getAccessColor
} from '@/utils'

export default {
  data () {
    return {
      totalRoles: 0,
      lists: [],
      loading: true,
      loadingText: 'Đang tải... Vui lòng chờ',
      options: {},
      footerProps: {
        'items-per-page-text': 'Số dòng trên 1 trang',
        'items-per-page-options': [20, 50, 100]
      },
      noDataText: 'Không có dữ liệu',
      access: null
    }
  },
  watch: {
    options: {
      handler () {
        this.getDataList()
      },
      deep: true
    }
  },
  created () {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Vai trò & Quyền')
  },
  methods: {
    getDataList () {
      this.loading = true
      const { page, itemsPerPage } = this.options
      const params = {
        page,
        limit: itemsPerPage
      }
      if (this.email) {
        params.email = this.email.trim()
      }
      if (this.mobile) {
        params.mobile = this.mobile.trim()
      }
      if (this.status) {
        params.status = this.status
      }
      return getListRole(params)
        .then((res) => {
          if (res) {
            const { data, totalCount } = res.data
            this.loading = false
            this.lists = data || []
            this.totalRoles = totalCount
          }
        })
        .catch((error) => {
          this.lists = []
          this.loading = false
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    },
    getIndex (item) {
      const index = this.lists.map(v => v.id).indexOf(item.id)
      const { page, itemsPerPage } = this.options
      return (index + 1) + (page - 1) * itemsPerPage
    },
    formatDateTime (datetime) {
      return formatDateTime(datetime)
    },
    goto (item) {
      if (item) {
        this.$router.push({ path: `/role/${item.id}` })
      } else {
        this.$router.push({ path: '/role/add' })
      }
    },
    deleteItem (item) {
      const index = this.lists.indexOf(item)
      confirm(`Bạn có chắc muốn xoá ${item.name}?`) &&
        deleteRole(item.id).then((v) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'teal')
          this.$store.commit('SET_NOTIFY_MESSAGE', 'Xóa thành công')

          this.lists.splice(index, 1)
        }).catch((error) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    },
    havePermission () {
      const permission = this.$store.state.permission
      return [ACCESS_ALL, ACCESS_ROLE].includes(permission)
    },
    getHeaders () {
      const headingHeaders = [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: 'id'
        },
        { text: 'Tên', sortable: false, value: 'name' },
        { text: 'Quyền truy cập', sortable: false, value: 'access' },
        { text: 'Ngày tạo', sortable: false, value: 'createdAt' },
        { text: 'Cập nhật', sortable: false, value: 'updatedAt' },
        { text: 'Hành động', sortable: false, value: 'actions' }
      ]

      return headingHeaders
    },
    getAccesses (access) {
      return access.split(',')
    },
    getAccessColor (accessKey) {
      return getAccessColor(accessKey)
    },
    formatAccessName (accessKey) {
      return getAccessName(accessKey)
    }
  }
}
</script>
