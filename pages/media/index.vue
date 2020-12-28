<template>
  <v-container grid-list-xl fluid>
    <v-layout row wrap>
      <v-flex>
        <v-card class="mb-4">
          <v-toolbar class="elevation-0 transparent media-toolbar">
            <v-btn-toggle>
              <v-btn @click="goto()">
                <v-icon color="primary">
                  mdi-cloud-upload
                </v-icon>
                &nbsp; Tải ảnh
              </v-btn>
              <v-btn @click="goto('lists')">
                <v-icon color="primary">
                  mdi-image-multiple
                </v-icon>
                &nbsp; Thư viện Ảnh
              </v-btn>
            </v-btn-toggle>
          </v-toolbar>
          <v-divider />
          <v-container fluid>
            <v-row align="center">
              <v-col cols="12" md="8">
                <v-form
                  ref="form"
                  v-model="valid"
                  dense
                  lazy-validation
                  @submit.prevent="save"
                >
                  <v-text-field
                    v-model="imageName"
                    label="Chọn ảnh upload"
                    prepend-icon="mdi-camera"
                    @click="pickFile"
                  />
                  <v-btn type="submit" :disabled="!valid" color="primary" class="mr-4">
                    Lưu Lại
                  </v-btn>
                </v-form>
              </v-col>
              <v-col cols="12" md="4">
                <input
                  ref="image"
                  type="file"
                  style="display: none"
                  accept="image/*"
                  @change="onFilePicked"
                >
                <img v-if="imageUrl" :src="imageUrl" height="150">
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { createMedia } from '@/api/media'
export default {
  layout: 'dashboard',
  data: () => ({
    valid: false,
    imageName: '',
    imageUrl: '',
    imageFile: ''
  }),
  created () {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Tải ảnh lên')
  },
  methods: {
    pickFile () {
      this.$refs.image.click()
    },
    onFilePicked (e) {
      const files = e.target.files
      if (files[0] !== undefined) {
        this.imageName = files[0].name
        if (this.imageName.lastIndexOf('.') <= 0) {
          return
        }
        const fr = new FileReader()
        fr.readAsDataURL(files[0])
        fr.addEventListener('load', () => {
          this.imageUrl = fr.result
          this.imageFile = files[0] // this is an image file that can be sent to server...
          this.valid = true
        })
      } else {
        this.imageName = ''
        this.imageFile = ''
        this.imageUrl = ''
        this.valid = false
      }
    },
    goto (slug) {
      if (slug) {
        this.$router.push({ path: `/media/${slug}` })
      } else {
        this.$router.push({ path: '/media' })
      }
    },
    async save () {
      if (!this.imageFile) {
        this.$store.commit('SET_SNACKBAR', true)
        this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
        this.$store.commit('SET_NOTIFY_MESSAGE', 'vui lòng chọn một ảnh')
        return false
      }
      try {
        const formData = new FormData()
        formData.append('file', this.imageFile)
        await createMedia(formData)
        this.$store.commit('SET_SNACKBAR', true)
        this.$store.commit('SET_SNACKBAR_COLOR', 'teal')
        this.$store.commit('SET_NOTIFY_MESSAGE', 'Lưu dữ liệu thành công')
        this.imageName = ''
        this.imageFile = ''
        this.imageUrl = ''
        this.valid = false
        return true
      } catch (error) {
        this.$store.commit('SET_SNACKBAR', true)
        this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
        this.$store.commit('SET_NOTIFY_MESSAGE', 'Có lỗi xảy ra')
        return false
      }
    }
  }
}
</script>
