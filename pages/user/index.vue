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
              <v-btn color="primary" type="submit" dark>
                Tìm kiếm
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-data-table
      :headers="headers"
      :items="lists"
      :options.sync="options"
      :server-items-length="totalUsers"
      :loading="loading"
      :loading-text="loadingText"
      :footer-props="footerProps"
      :no-data-text="noDataText"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Danh sách khách hàng</v-toolbar-title>
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
            <span>Thêm khách hàng</span>
          </v-tooltip>
        </v-toolbar>
      </template>
      <template v-slot:item.firstName="{ item }">
        {{ item.firstName }} {{ item.lastName }}
      </template>
      <template v-slot:item.address="{ item }">
        {{ getAddress(item) }}
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="getColorStatus(item.status)" dark>
          {{ getStatusName(item.status) }}
        </v-chip>
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
      <template v-slot:item.status="{ item }">
        <v-icon :color="getColorStatus(item.status)" dark>
          {{ getIconStatus(item.status) }}
        </v-icon>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon v-if="havePermission()" small class="mr-2" @click="goto(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { getListUser } from '@/api/user'
import {
  ACCOUNT_INACTIVE,
  ACCOUNT_ACTIVE,
  ACCESS_ALL,
  getStatusAccountName,
  getIconStatus,
  getColorAccountStatus,
  formatDateTime
} from '@/utils'

export default {
  data () {
    return {
      totalUsers: 0,
      lists: [],
      loading: true,
      loadingText: 'Đang tải... Vui lòng chờ',
      options: {},
      footerProps: {
        'items-per-page-text': 'Số dòng trên 1 trang',
        'items-per-page-options': [20, 50, 100]
      },
      noDataText: 'Không có dữ liệu',
      headers: [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: 'id'
        },
        { text: 'Khách hàng', sortable: false, value: 'firstName', width: 100 },
        { text: 'Email', sortable: false, value: 'email' },
        { text: 'Số điện thoại', sortable: false, value: 'mobile' },
        { text: 'Địa chỉ', sortable: false, value: 'address', width: 190 },
        { text: 'Ngày tạo', sortable: false, value: 'createdAt' },
        { text: 'Cập nhật', sortable: false, value: 'updatedAt' },
        { text: 'Trạng thái', sortable: false, value: 'status' },
        { text: 'Hành động', sortable: false, value: 'actions' }
      ],
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
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Danh sách khách hàng')
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
      return getListUser(params)
        .then((res) => {
          const { data, totalCount } = res.data
          this.loading = false
          this.lists = data || []
          this.totalUsers = totalCount
        })
        .catch((error) => {
          this.lists = []
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
    getAddress ({ street, state, city }) {
      if (street || state || city) {
        return [street, state, city].join(' - ')
      }
      return ''
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
        this.$router.push({ path: `/user/${item.id}` })
      } else {
        this.$router.push({ path: '/user/add' })
      }
    },
    havePermission () {
      const permission = this.$store.state.permission
      return [ACCESS_ALL].includes(permission)
    },
    getIconStatus (status) {
      return getIconStatus(status)
    }
  }
}
</script>
