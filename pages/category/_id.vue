<template>
  <v-container grid-list-xl fluid>
    <v-layout row wrap>
      <v-flex lg9 md8>
        <v-card class="mb-4">
          <v-toolbar color="primary" dark flat dense cad>
            <v-toolbar-title class="subheading">
              {{ getTitle() }}
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-divider />
          <v-card-text class>
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit.prevent="save"
            >
              <v-container fluid>
                <v-row align="center">
                  <v-col cols="12">
                    <v-text-field v-model="title" label="Tiêu đề" :rules="titleRules" placeholder="Nhập tiêu đề" />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea v-model="description" label="Mô tả chuyên mục" :rules="descriptionRules" />
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
      <v-flex lg3 md4>
        <v-card class="mb-4">
          <v-toolbar color="primary" dark flat dense cad>
            <v-toolbar-title class="subheading">
              Tài liệu
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-divider />
          <v-container fluid>
            <v-row align="center">
              <v-col cols="12">
                <v-text-field
                  v-model="slug"
                  label="Đường dẫn"
                  placeholder="Nhập đường dẫn"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card>
        <avatar />
      </v-flex>
      <v-layout />
    </v-layout>
  </v-container>
</template>
<script>
import { getAccessItems, TYPE_POST } from '@/utils'
import { createCategory, getCategory, updateCategory } from '@/api/category'
import Avatar from '@/components/media/Avatar'

export default {
  components: {
    Avatar
  },
  data: () => ({
    isEdit: false,
    valid: true,
    title: null,
    titleRules: [v => !!v || 'Vui lòng nhập tiêu đề'],
    slug: null,
    description: null,
    descriptionRules: [v => !!v || 'Vui lòng nhập mô tả']
  }),
  computed: {
    getAccessItems () {
      return getAccessItems()
    }
  },
  created () {
    const id = this.$route.params && this.$route.params.id
    this.isEdit = id && id !== 'add'
    if (this.isEdit) {
      this.$store.commit('SET_PAGE_HEADER_TITLE', 'Thay đổi chuyên mục')
      this.fetchData(id)
    } else {
      this.$store.commit('SET_PAGE_HEADER_TITLE', 'Thêm chuyên mục')
      this.$store.commit('product/SET_AVATAR', null)
    }
  },
  methods: {
    fetchData (id) {
      getCategory(id)
        .then((res) => {
          this.title = res.data.title
          this.slug = res.data.slug
          this.description = res.data.description
          this.$store.commit('product/SET_AVATAR', res.data.avatar)
        })
        .catch((error) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    },
    getTitle () {
      return this.isEdit ? 'Cập nhật chuyên mục' : 'Thêm chuyên mục'
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
        type: TYPE_POST,
        avatar: this.$store.state.product.avatar
      }

      const id = this.$route.params && this.$route.params.id
      const saverole = () =>
        this.isEdit ? updateCategory(id, params) : createCategory(params)
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
