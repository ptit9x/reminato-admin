<template>
  <v-container grid-list-xl fluid>
    <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="save">
      <v-layout row wrap>
        <v-flex md6>
          <v-card class="mb-12">
            <v-toolbar color="primary" dark flat dense cad>
              <v-toolbar-title class="subheading">
                Cấu hình hệ thống
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-divider />
            <v-card-text class>
              <v-container fluid>
                <v-row align="center">
                  <v-col cols="12">
                    <v-text-field
                      v-model="title"
                      label="Tiêu đề website"
                      :rules="titleRules"
                      placeholder="Nhập tiêu đề"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="description"
                      label="Mô tả trang"
                      :rules="descriptionRules"
                      placeholder="Trong một vài từ, giải thích về trang này viết về gì."
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
          <v-card class="mb-12">
            <v-toolbar color="primary" dark flat dense cad>
              <v-toolbar-title class="subheading">
                Cài đặt trang chủ
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-divider />
            <v-card-text class>
              <v-container fluid>
                <v-row align="center">
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="homeCategories"
                      :items="categories"
                      :loading="isLoading"
                      no-data-text="Không tìm thấy kết quả"
                      hide-no-data
                      hide-selected
                      item-text="title"
                      item-value="id"
                      label="Danh mục sản phẩm sẽ hiển thị"
                      placeholder="Chọn ít nhất 1 danh mục sản phẩm"
                      required
                      chips
                      multiple
                      clearable
                      return-object
                    />
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="homeProductsByCategory"
                      :items="categories"
                      :loading="isLoading"
                      no-data-text="Không tìm thấy kết quả"
                      hide-no-data
                      hide-selected
                      item-text="title"
                      item-value="id"
                      label="Sản phẩm sẽ hiển thị theo danh mục"
                      placeholder="Chọn ít nhất 1 danh mục sản phẩm"
                      required
                      chips
                      multiple
                      clearable
                      return-object
                    />
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="homeGroupCategories"
                      :items="categories"
                      :loading="isLoading"
                      no-data-text="Không tìm thấy kết quả"
                      hide-no-data
                      hide-selected
                      item-text="title"
                      item-value="id"
                      label="Lĩnh vực ứng dụng"
                      placeholder="Chọn ít nhất 1 danh mục sản phẩm"
                      required
                      chips
                      multiple
                      clearable
                      return-object
                    />
                  </v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="homeFeature"
                      :items="categories"
                      :loading="isLoading"
                      no-data-text="Không tìm thấy kết quả"
                      hide-no-data
                      hide-selected
                      item-text="title"
                      item-value="id"
                      label="Sản phẩm nổi bật"
                      placeholder="Chọn 1 danh mục sản phẩm"
                      required
                      chips
                      clearable
                      return-object
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="manufacturing"
                      label="Quy trình sản xuất"
                      :rules="[v => !!v || 'Vui lòng nhập tiêu đề quy trình sản xuất']"
                      placeholder="Nhập tiêu đề quy trình sản xuất"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="manufacturingDescription"
                      label="Mô tả quy trình sản xuất"
                      :rules="[v => !!v || 'Vui lòng nhập mô tả quy trình sản xuất']"
                      placeholder="Nhập mô tả quy trình sản xuất"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-card outlined>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title class="headline">
                            Danh sách ảnh sản xuất
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <album limit="6" />
                    </v-card>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-btn
                      type="submit"
                      color="primary"
                      class="mr-4"
                    >
                      Lưu Lại
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
        <v-flex md6>
          <v-card class="mb-12">
            <v-toolbar color="primary" dark flat dense cad>
              <v-toolbar-title class="subheading">
                Câu hỏi thường gặp
              </v-toolbar-title>
              <v-spacer />
            </v-toolbar>
            <v-divider />
            <v-card-text class>
              <v-container fluid>
                <v-row
                  v-for="(v, i) in frequentlyQuestions"
                  :key="i"
                  align="center"
                >
                  <v-col cols="12">
                    <v-btn
                      fab
                      dark
                      small
                      color="error"
                      @click="deleteQuestion(i)"
                    >
                      <v-icon dark>
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="v.question"
                      :label="'Câu hỏi ' + (i+1)"
                      :rules="[v => !!v || 'Vui lòng nhập câu hỏi']"
                      placeholder="Nhập câu hỏi"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="v.answer"
                      :label="'Câu trả lời ' + (i+1)"
                      :rules="[v => !!v || 'Vui lòng nhập câu trả lời']"
                      placeholder="Nhập câu trả lời"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-btn class="mx-2" fab dark color="indigo" @click="addQuestion()">
                    <v-icon dark>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>
<script>
import { TYPE_PRODUCT, getAccessItems } from '@/utils'
import { getSetting, updateSetting } from '@/api/setting'
import { getListCategory } from '@/api/category'
import Album from '@/components/media/Album'

export default {
  components: {
    Album
  },
  data: () => ({
    valid: true,
    title: null,
    titleRules: [v => !!v || 'Vui lòng nhập tiêu đề'],
    email: null,
    emailRules: [
      v => !!v || 'Vui lòng nhập E-mail',
      v => /.+@.+\..+/.test(v) || 'E-mail không hợp lệ'
    ],
    description: null,
    descriptionRules: [v => !!v || 'Vui lòng nhập mô tả'],
    isLoading: false,
    categories: [],
    homeCategories: null,
    homeProductsByCategory: null,
    homeGroupCategories: null,
    homeFeature: null,
    frequentlyQuestions: [
      {
        question: null,
        answer: null
      }
    ],
    manufacturing: null,
    manufacturingDescription: null
  }),
  computed: {
    getAccessItems () {
      return getAccessItems()
    }
  },
  created () {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Cài đặt trang')
    this.fetchData()
  },
  methods: {
    addQuestion () {
      this.frequentlyQuestions.push({
        question: null,
        answer: null
      })
    },
    deleteQuestion (index) {
      this.frequentlyQuestions.splice(index, 1)
    },
    fetchData () {
      getListCategory({ page: 1, limit: 100, type: TYPE_PRODUCT })
        .then((listCategories) => {
          this.categories =
            listCategories.data.data.length > 0
              ? listCategories.data.data.map(v => ({
                id: v.id,
                title: v.title
              }))
              : []
        })
        .then(() => getSetting())
        .then((res) => {
          this.title = res.data.title
          this.description = res.data.description
          this.homeCategories = res.data.categoriesInHome
            ? res.data.categoriesInHome.map(v => ({ id: v.id, title: v.title }))
            : []
          this.homeProductsByCategory = res.data.categoriesProductsInHome
            ? res.data.categoriesProductsInHome.map(v => ({
              id: v.id,
              title: v.title
            }))
            : []
          this.homeGroupCategories = res.data.homeGroupCategories
            ? res.data.homeGroupCategories.map(v => ({
              id: v.id,
              title: v.title
            }))
            : []
          this.homeFeature = res.data.homeFeature
            ? { id: res.data.homeFeature.id, title: res.data.homeFeature.title }
            : null
          if (res.data.frequentlyQuestions) {
            this.frequentlyQuestions = res.data.frequentlyQuestions
          }
          this.manufacturing = res.data.manufacturing
          this.manufacturingDescription = res.data.manufacturingDescription
          this.$store.commit('product/SET_ALBUM', res.data.albums && res.data.albums.length > 0 ? res.data.albums : null)
        })
        .catch((error) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
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
      const params = {
        title: this.title,
        description: this.description,
        homeCategories:
          this.homeCategories.length > 0
            ? this.homeCategories.map(v => v.id)
            : null,
        homeProductsByCategory:
          this.homeProductsByCategory.length > 0
            ? this.homeProductsByCategory.map(v => v.id)
            : null,
        homeGroupCategories:
          this.homeGroupCategories.length > 0
            ? this.homeGroupCategories.map(v => v.id)
            : null,
        homeFeature:
          this.homeFeature && this.homeFeature.id ? this.homeFeature.id : null,
        frequentlyQuestions: this.frequentlyQuestions,
        manufacturing: this.manufacturing,
        manufacturingDescription: this.manufacturingDescription,
        albums: this.$store.state.product.galleries ? this.$store.state.product.galleries : []
      }

      return updateSetting(params)
        .then(() => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'teal')
          this.$store.commit('SET_NOTIFY_MESSAGE', 'Lưu dữ liệu thành công')
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
