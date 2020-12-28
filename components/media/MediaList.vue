<template>
  <v-list dense class="transparent">
    <v-list-item
      v-for="(item, index) in files"
      :key="'list-file-' + index"
    >
      <v-list-item-avatar>
        <v-icon>mdi-image</v-icon>
      </v-list-item-avatar>
      <v-list-item-content>
        <div class="layout">
          <div class="flex">
            {{ item.name }}
          </div>
          <v-spacer />
          <v-btn icon @click="deleteItem(item)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
import { deleteMedia } from '@/api/media'

export default {
  props: {
    files: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data: () => ({
    size: 'lg',
    view: 'grid',
    selectedFile: {
      path: '/static/icon/empty_file.svg'
    },
    imageMime: ['image/jpeg', 'image/png', 'image/svg+xml']
  }),
  methods: {
    deleteItem (item) {
      const index = this.files.indexOf(item)
      confirm(`Bạn có chắc muốn xoá mẫu ${item.name}?`) &&
        deleteMedia(item.name)
          .then((v) => {
            this.$store.commit('SET_SNACKBAR', true)
            this.$store.commit('SET_SNACKBAR_COLOR', 'teal')
            this.$store.commit('SET_NOTIFY_MESSAGE', 'Xóa thành công')

            this.files.splice(index, 1)
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
