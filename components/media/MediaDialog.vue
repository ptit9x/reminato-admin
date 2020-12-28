<template>
  <v-container fluid>
    <v-form ref="form" lazy-validation @submit.prevent="save">
      <v-flex
        lg6
        sm6
        xs12
      >
        <v-text-field
          v-model="fileName"
          :rules="fileNameRules"
          label="Nhập tên ảnh để tìm kiếm"
          required
          append-icon="mdi-magnify"
          @click:append="save"
        />
      </v-flex>
    </v-form>
    <v-layout wrap class="x-grid-lg">
      <v-flex
        v-for="(item, index) in files"
        :key="index"
        lg2
        sm6
        xs12
        class="pa-2"
      >
        <a class="d-flex" @click="seletedImage(item)">
          <v-card tile :color="getColorSelected(item.name)">
            <img
              style="height: 150px; width: 100%"
              :src="getPath(item)"
              :lazy-src="getPath(item)"
              alt=""
            >
            <v-divider />
            <v-card-title>
              {{ item.name }}
            </v-card-title>
          </v-card>
        </a>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { getListMedia } from '@/api/media'

export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      valid: true,
      fileName: null,
      fileNameRules: [v => !!v || 'Vui lòng nhập tên ảnh'],
      files: [],
      selected: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const params = this.fileName ? { filename: this.fileName } : {}
      getListMedia(params)
        .then((res) => {
          this.selected = null
          this.files = res.data
        })
        .catch((error) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    },
    getPath (file) {
      return `${process.env.MEDIA_URL}/${file.name}`
    },
    seletedImage (file) {
      const images = this.selected ? this.selected.split(',') : []
      const index = images.indexOf(file.name)
      if (index <= -1) {
        if (images.length < this.limit) {
          images.push(file.name)
        }
      } else {
        images.splice(index, 1)
      }
      this.selected = images.join(',')
      this.$store.commit('SET_SELECTED_IMAGE', images)
    },
    getColorSelected (filename) {
      const images = this.selected ? this.selected.split(',') : []
      return (images.includes(filename)) ? 'indigo lighten-4' : '#FFF'
    },
    save () {
      const valid = this.$refs.form.validate()
      if (!valid) {
        this.$store.commit('SET_SNACKBAR', true)
        this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
        this.$store.commit('SET_NOTIFY_MESSAGE', 'Trường dữ liệu không hợp lệ')
        return false
      }
      this.fetchData()
    }
  }
}
</script>
