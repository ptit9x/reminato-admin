<template>
  <div>
    <v-card class="mb-2" outlined>
      <v-card-text>
        <v-form ref="form" @submit.prevent="getDataList">
          <v-row>
            <v-col class="d-flex" cols="12" sm="6" dense>
              <v-text-field v-model="email" label="E-mail" dense />
            </v-col>
            <v-col class="d-flex" cols="12" sm="6">
              <v-text-field v-model="mobile" label="Số điện thoại" dense />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="d-flex" cols="12" sm="6">
              <v-select
                v-model="status"
                :items="statusItems"
                label="Trạng thái"
                dense
                clearable
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="text-center" dense>
              <v-btn type="submit" color="primary" dark>
                Tìm kiếm
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-data-table
      :headers="getHeaders()"
      :items="lists"
      :options.sync="options"
      :server-items-length="totalstaffs"
      :loading="loading"
      :loading-text="loadingText"
      :footer-props="footerProps"
      :no-data-text="noDataText"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Danh sách nhân viên</v-toolbar-title>
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
            <span>Thêm nhân viên mới</span>
          </v-tooltip>
        </v-toolbar>
      </template>
      <template v-slot:item.status="{ item }">
        <v-icon :color="getColorStatus(item.status)" dark>
          {{ getIconStatus(item.status) }}
        </v-icon>
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
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { getListStaff } from '@/api/staff'
import {
  ACCESS_ALL,
  ACCOUNT_ACTIVE,
  ACCOUNT_INACTIVE,
  getStatusAccountName,
  getColorAccountStatus,
  formatDateTime,
  getIconStatus
} from '@/utils'

export default {
  data () {
    return {
      totalstaffs: 0,
      lists: [],
      loading: true,
      loadingText: 'Đang tải... Vui lòng chờ',
      options: {},
      footerProps: {
        'items-per-page-text': 'Số dòng trên 1 trang',
        'items-per-page-options': [20, 50, 100]
      },
      noDataText: 'Không có dữ liệu',
      email: null,
      mobile: null,
      status: null,
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
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Quản lý nhân viên')
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
      return getListStaff(params)
        .then((res) => {
          if (res) {
            const { data, totalCount } = res.data
            this.loading = false
            this.lists = data || []
            this.totalstaffs = totalCount
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
    getColorStatus (status) {
      return getColorAccountStatus(status)
    },
    getIndex (item) {
      const index = this.lists.map(v => v.id).indexOf(item.id)
      const { page, itemsPerPage } = this.options
      return index + 1 + (page - 1) * itemsPerPage
    },
    formatDateTime (datetime) {
      return formatDateTime(datetime)
    },
    goto (item) {
      if (item) {
        this.$router.push({ path: `/staff/${item.id}` })
      } else {
        this.$router.push({ path: '/staff/add' })
      }
    },
    havePermission () {
      const permission = this.$store.state.permission
      return [ACCESS_ALL].includes(permission)
    },
    getHeaders () {
      const headingHeaders = [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: 'id'
        },
        { text: 'Họ Tên', sortable: false, value: 'fullName' },
        { text: 'Email', sortable: false, value: 'email' },
        { text: 'Số điện thoại', sortable: false, value: 'mobile' },
        { text: 'Địa chỉ', sortable: false, value: 'address' },
        { text: 'Vai trò', sortable: false, value: 'roleName' },
        { text: 'Ngày tạo', sortable: false, value: 'createdAt' },
        { text: 'Cập nhật', sortable: false, value: 'updatedAt' },
        { text: 'Trạng thái', sortable: false, value: 'status' },
        { text: 'Hành động', sortable: false, value: 'actions' }
      ]
      if (!this.havePermission()) {
        headingHeaders.pop()
      }
      return headingHeaders
    },
    getIconStatus (status) {
      return getIconStatus(status)
    }
  }
}
</script>
