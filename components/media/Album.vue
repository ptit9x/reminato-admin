<template>
  <div>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-container fluid>
          <v-row align="center">
            <v-col v-for="(path, index) in getAlbums" :key="index" class="d-flex child-flex" cols="4">
              <v-card flat tile class="d-flex">
                <v-img
                  :src="path"
                  :lazy-src="path"
                  aspect-ratio="1"
                  class="grey lighten-2"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular indeterminate color="grey lighten-5" />
                    </v-row>
                  </template>
                </v-img>
              </v-card>
            </v-col>
            <v-col v-if="getAlbums.length < 6" class="d-flex child-flex" cols="4">
              <div class="text-center grey lighten-2 rounded">
                <v-avatar size="48" dark v-bind="attrs" v-on="on">
                  <v-icon>mdi-plus</v-icon>
                </v-avatar>
              </div>
            </v-col>
            <v-col cols="12">
              <div>
                <a @click="removeImage()">Click để xóa tất cả</a>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>Chọn ảnh</v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn dark text @click="handleSelectedImage">
              Chọn
            </v-btn>
          </v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <media-dialog :limit="6" />
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import MediaDialog from '@/components/media/MediaDialog'

export default {
  components: {
    MediaDialog
  },
  data () {
    return {
      dialog: false,
      notifications: false,
      sound: true,
      widgets: false,
      files: []
    }
  },
  computed: {
    getAlbums () {
      const lists = this.$store.state.product.galleries || []
      if (lists.length > 0) {
        return lists.map(v => `${process.env.MEDIA_URL}/${v || 'avatar-default.png'}`)
      }
      return []
    }
  },
  methods: {
    removeImage () {
      this.$store.commit('product/SET_ALBUM', null)
      this.$store.commit('SET_SELECTED_IMAGE', [])
    },
    handleSelectedImage () {
      this.dialog = false
      const selected = this.$store.state.selectedImages || []
      if (selected && selected.length > 0) {
        this.$store.commit('product/SET_ALBUM', selected)
      } else {
        this.$store.commit('product/SET_ALBUM', null)
      }
      this.$store.commit('SET_SELECTED_IMAGE', [])
    }
  }
}
</script>
