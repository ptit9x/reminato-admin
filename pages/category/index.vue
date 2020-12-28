<template>
  <div>
    <v-card class="mb-2" outlined>
      <v-card-text>
        <v-form ref="form" @submit.prevent="getDataList">
          <v-row>
            <v-col class="d-flex" cols="12" sm="6" dense>
              <v-text-field v-model="title" label="Tên danh mục tin tức" dense />
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
          <v-toolbar-title>Danh sách chuyên mục</v-toolbar-title>
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
      <template v-slot:item.id="{ item }">
        {{ getIndex(item) }}
      </template>
      <template v-slot:item.createdAt="{ item }">
        {{ formatDateTime(item.createdAt) }}
      </template>
      <template v-slot:item.updatedAt="{ item }">
        {{ formatDateTime(item.updatedAt) }}
      </template>
      <template v-slot:item.price="{ item }">
        {{ formatPrice(item.price) }}
      </template>
      <template v-slot:item.capacity="{ item }">
        {{ formatPrice(item.capacity) }}
      </template>
      <template v-slot:item.actions="{ item }">
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
import { getListCategory, deleteCategory } from '@/api/category'
import {
  ACCESS_ALL,
  ACCESS_PRODUCT,
  formatDateTime,
  formatPrice
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
      title: null,
      selected: [],
      headers: [
        { text: '#', value: 'id' },
        {
          text: 'Tên',
          align: 'start',
          sortable: false,
          value: 'title'
        },
        { text: 'Đường dẫn', value: 'slug' },
        { text: 'Mô tả', value: 'description' },
        { text: 'Ngày tạo', sortable: false, value: 'createdAt' },
        { text: 'Cập nhật', sortable: false, value: 'updatedAt' },
        { text: 'Hành động', sortable: false, value: 'actions' }
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
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Danh sách chuyên mục')
  },
  methods: {
    getDataList () {
      this.loading = true
      const { page, itemsPerPage } = this.options
      const params = {
        page,
        limit: itemsPerPage,
        type: 'POST'
      }
      if (this.title) {
        params.title = this.title.trim()
      }
      return getListCategory(params)
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
      if (item) {
        this.$router.push({ path: `/category/${item.id}` })
      } else {
        this.$router.push({ path: '/category/add' })
      }
    },
    formatPrice (amount) {
      return formatPrice(amount)
    },
    havePermission () {
      const permission = this.$store.state.permission
      return [ACCESS_ALL, ACCESS_PRODUCT].includes(permission)
    },
    deleteItem (item) {
      const index = this.lists.indexOf(item)
      confirm(`Bạn có chắc muốn xoá ${item.title}?`) &&
        deleteCategory(item.id).then((v) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'teal')
          this.$store.commit('SET_NOTIFY_MESSAGE', 'Xóa thành công')

          this.lists.splice(index, 1)
        }).catch((error) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    }
  }
}
</script>
