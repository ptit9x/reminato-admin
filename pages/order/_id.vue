<template>
  <v-container grid-list-xl fluid>
    <v-layout row wrap>
      <v-flex lg6 md6>
        <v-widget title="Thông tin khách hàng">
          <div slot="widget-content">
            <v-list two-line class="pa-0">
              <v-list-item>
                <v-list-item-action>
                  <v-icon color="primary">
                    mdi-account
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ fullName }}</v-list-item-title>
                  <v-list-item-subtitle>Họ tên</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset />
              <v-list-item>
                <v-list-item-action>
                  <v-icon color="primary">
                    mdi-phone
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ order.mobile }}</v-list-item-title>
                  <v-list-item-subtitle>Số điện thoại</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset />
              <v-list-item>
                <v-list-item-action>
                  <v-icon color="primary">
                    mdi-mail
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ order.email }}</v-list-item-title>
                  <v-list-item-subtitle>Địa chỉ Email</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset />
              <v-list-item v-if="createTimeFormarted">
                <v-list-item-action>
                  <v-icon color="primary">
                    mdi-update
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ createTimeFormarted }}</v-list-item-title>
                  <v-list-item-subtitle>Ngày tạo</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset />
              <v-list-item v-if="updateTimeFormarted">
                <v-list-item-action>
                  <v-icon color="primary">
                    mdi-update
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ updateTimeFormarted }}</v-list-item-title>
                  <v-list-item-subtitle>Cập nhật</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-widget>
      </v-flex>
      <v-flex lg6 md6>
        <v-widget title="Giao hàng">
          <div slot="widget-content">
            <v-list two-line class="pa-0">
              <v-list-item v-if="address">
                <v-list-item-action>
                  <v-icon color="primary">
                    mdi-map-marker
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ address }}</v-list-item-title>
                  <v-list-item-subtitle>Địa chỉ</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="address" inset />
              <v-list-item v-if="order.note">
                <v-list-item-action>
                  <v-icon color="primary">
                    mdi-note
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{ order.note }}</v-list-item-title>
                  <v-list-item-subtitle>Ghi chú của khách hàng</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset />
              <v-list-item v-if="order.status" @click="dialog = true">
                <v-list-item-action>
                  <v-icon color="primary">
                    mdi-pencil
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-chip :color="colorStatus" dark>
                      {{ nameStatus }}
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle>Trạng thái</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider inset />
              <v-list-item v-if="order.status">
                <v-list-item-action>
                  <v-icon color="primary">
                    mdi-cash
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ formatNumber(order.totalPrice) }} (VNĐ)
                  </v-list-item-title>
                  <v-list-item-subtitle>Thành tiền - chi tiết giá từng sản phẩm xem tại bên dưới</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-widget>
      </v-flex>
      <v-flex lg12>
        <v-widget title="Sản phẩm" class="mt-3">
          <div slot="widget-content">
            <div>
              <template>
                <v-data-table
                  :headers="headers"
                  :items="products"
                  no-data-text="Không tìm thấy sản phẩm nào trong đơn hàng này"
                  hide-default-footer
                >
                  <template v-slot:item.id="{ item }">
                    {{ getIndex(item) }}
                  </template>
                  <template v-slot:item.singlePrice="{ item }">
                    {{ formatNumber(item.price) }}
                  </template>
                  <template v-slot:item.quantity="{ item }">
                    {{ formatNumber(item.quantity) }}
                  </template>
                  <template v-slot:item.price="{ item }">
                    {{ formatNumber(item.price * item.quantity) }}
                  </template>
                  <template v-slot:item.image="{ item }">
                    <v-img :src="formatImage(item.image)" aspect-ratio="1" />
                  </template>
                </v-data-table>
              </template>
            </div>
          </div>
        </v-widget>
      </v-flex>
    </v-layout>
    <v-dialog
      v-model="dialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Thay đổi trạng thái</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                cols="12"
                sm="12"
              >
                <v-select
                  v-model="statusEdited"
                  :items="statusItems"
                  label="Trạng thái"
                  dense
                  required
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="darken-1"
            text
            @click="dialog = false"
          >
            Đóng lại
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="save"
          >
            Lưu lại
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import {
  STATUS_PENDING,
  STATUS_APPROVED,
  STATUS_CANCELED,
  STATUS_FAIL,
  getColorOrderStatus,
  getStatusOrderName,
  formatDateTime,
  formatPrice
} from '@/utils'
import { getOrder, updateStatusOrder } from '@/api/order'
import VWidget from '@/components/VWidget'

export default {
  components: {
    VWidget
  },
  data: () => ({
    valid: true,
    order: {},
    status: null,
    statusEdited: null,
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
    ],
    headers: [
      {
        text: '#',
        align: 'start',
        sortable: false,
        value: 'id'
      },
      { text: 'Mã sản phẩm', sortable: false, value: 'sku' },
      { text: 'Tên sản phẩm', sortable: false, value: 'title' },
      { text: 'Ảnh', sortable: false, width: 80, value: 'image' },
      { text: 'Sản phẩm/Block', sortable: false, value: 'numberBlock' },
      { text: 'Block/Thùng', sortable: false, value: 'blockPerBox' },
      { text: 'Dung tích (oz)', sortable: false, value: 'capacity' },
      { text: 'Xuất xứ', sortable: false, value: 'origin' },
      { text: 'Lớp giấy', sortable: false, value: 'paperLayer' },
      { text: 'Độ tráng phủ (PE)', sortable: false, value: 'pe' },
      { text: 'Hình dáng', sortable: false, value: 'shape' },
      { text: 'Đơn giá (VNĐ)', sortable: false, value: 'singlePrice' },
      { text: 'Số lượng', sortable: false, value: 'quantity' },
      { text: 'Giá (VNĐ)', sortable: false, value: 'price' }
    ],
    products: [],
    dialog: false
  }),
  computed: {
    fullName () {
      return this.order.firstName && this.order.lastName ? `${this.order.firstName} ${this.order.lastName}` : ''
    },
    address () {
      if (this.order.street && this.order.state && this.order.city) {
        return `${this.order.street}, ${this.order.state}, ${this.order.city}`
      }
      return null
    },
    createTimeFormarted () {
      if (this.order.createdAt) {
        return formatDateTime(this.order.createdAt)
      }
      return null
    },
    updateTimeFormarted () {
      if (this.order.updatedAt) {
        return formatDateTime(this.order.updatedAt)
      }
      return null
    },
    colorStatus () {
      return getColorOrderStatus(this.status)
    },
    nameStatus () {
      return getStatusOrderName(this.status)
    }
  },
  created () {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Chi tiết đơn hàng')
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },
  methods: {
    fetchData (id) {
      getOrder(id)
        .then((res) => {
          this.order = res.data
          this.status = res.data.status
          this.statusEdited = res.data.status
          this.products = res.data.products || []
        })
        .catch((error) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    },
    getIndex (item) {
      const index = this.products.map(v => v.id).indexOf(item.id)
      return index + 1
    },
    formatNumber (amount) {
      return formatPrice(amount)
    },
    formatImage (image) {
      return `${process.env.MEDIA_URL}/${image || 'avatar-default.png'}`
    },
    save () {
      const params = {
        status: this.statusEdited
      }

      const id = this.$route.params && this.$route.params.id
      return updateStatusOrder(id, params)
        .then(() => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'teal')
          this.$store.commit('SET_NOTIFY_MESSAGE', 'Lưu dữ liệu thành công')
          this.dialog = false
          this.status = this.statusEdited
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
