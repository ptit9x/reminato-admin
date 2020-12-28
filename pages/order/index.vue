<template>
  <div>
    <v-card class="mb-2" outlined>
      <v-card-text>
        <v-form ref="form" @submit.prevent="getDataList">
          <v-row>
            <v-col class="d-flex" cols="12" sm="6" dense>
              <v-text-field v-model="id" label="Mã đơn hàng" dense />
            </v-col>
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
            <v-col dense>
              <v-btn type="submit" color="primary" dark>
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
      :server-items-length="totalRecords"
      :loading="loading"
      :loading-text="loadingText"
      :footer-props="footerProps"
      :no-data-text="noDataText"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Danh sách đơn hàng</v-toolbar-title>
          <v-divider class="mx-4" inset vertical />
          <v-spacer />
        </v-toolbar>
      </template>
      <template v-slot:item.index="{ item }">
        {{ getIndex(item) }}
      </template>
      <template v-slot:item.createdAt="{ item }">
        {{ formatDateTime(item.createdAt) }}
      </template>
      <template v-slot:item.updatedAt="{ item }">
        {{ formatDateTime(item.updatedAt) }}
      </template>
      <template v-slot:item.firstName="{ item }">
        {{ getFullName(item) }}
      </template>
      <template v-slot:item.totalPrice="{ item }">
        {{ formatPrice(item.totalPrice) }}
      </template>
      <template v-slot:item.status="{ item }">
        <v-chip :color="getColorStatus(item.status)" dark>
          {{ getStatusName(item.status) }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="goto(item)">
          mdi-eye
        </v-icon>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import { getListOrder } from '@/api/order'
import {
  ACCESS_ALL,
  ACCESS_PRODUCT,
  STATUS_PENDING,
  STATUS_APPROVED,
  STATUS_CANCELED,
  STATUS_FAIL,
  formatDateTime,
  formatPrice,
  getColorOrderStatus,
  getStatusOrderName
} from '@/utils'

export default {
  data () {
    return {
      totalRecords: 0,
      lists: [],
      loading: true,
      loadingText: 'Đang tải... Vui lòng chờ',
      options: {},
      footerProps: {
        'items-per-page-text': 'Số dòng trên 1 trang',
        'items-per-page-options': [20, 50, 100]
      },
      noDataText: 'Không có dữ liệu',
      singleSelect: false,
      id: null,
      selected: [],
      headers: [
        { text: '#', value: 'index' },
        { text: 'Mã đơn hàng', value: 'id' },
        {
          text: 'Họ tên',
          align: 'start',
          sortable: false,
          value: 'firstName'
        },
        { text: 'email', value: 'email' },
        { text: 'Số điện thoại', value: 'mobile' },
        { text: 'Ghi chú', value: 'note' },
        { text: 'Thành tiền (VNĐ)', value: 'totalPrice' },
        { text: 'Trạng thái', value: 'status' },
        { text: 'Ngày tạo', sortable: false, value: 'createdAt' },
        { text: 'Cập nhật', sortable: false, value: 'updatedAt' },
        { text: 'Hành động', sortable: false, value: 'actions' }
      ],
      status: null,
      statusItems: [
        {
          value: STATUS_PENDING,
          text: getStatusOrderName(STATUS_PENDING)
        },
        {
          value: STATUS_APPROVED,
          text: getStatusOrderName(STATUS_APPROVED)
        },
        {
          value: STATUS_CANCELED,
          text: getStatusOrderName(STATUS_CANCELED)
        },
        {
          value: STATUS_FAIL,
          text: getStatusOrderName(STATUS_FAIL)
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
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Danh sách đơn hàng')
  },
  methods: {
    getDataList () {
      this.loading = true
      const { page, itemsPerPage } = this.options
      const params = {
        page,
        limit: itemsPerPage
      }
      if (this.id) {
        params.id = this.id.trim()
      }
      if (this.status) {
        params.status = this.status
      }
      return getListOrder(params)
        .then((res) => {
          if (res) {
            const { data, totalCount } = res.data
            this.loading = false
            this.lists = data || []
            this.totalRecords = totalCount
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
      this.$router.push({ path: `/order/${item.id}` })
    },
    formatPrice (amount) {
      return formatPrice(amount)
    },
    havePermission () {
      const permission = this.$store.state.permission
      return [ACCESS_ALL, ACCESS_PRODUCT].includes(permission)
    },
    getColorStatus (status) {
      return getColorOrderStatus(status)
    },
    getStatusName (status) {
      return getStatusOrderName(status)
    },
    getFullName (item) {
      return `${item.firstName} ${item.lastName}`
    }
  }
}
</script>
