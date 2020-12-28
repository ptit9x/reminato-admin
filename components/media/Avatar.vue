<template>
  <div>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-card class="mb-4">
          <v-toolbar color="primary" dark flat dense cad>
            <v-toolbar-title class="subheading">
              Ảnh đại diện
            </v-toolbar-title>
            <v-spacer />
          </v-toolbar>
          <v-divider />
          <v-container fluid>
            <v-row align="center">
              <v-col cols="12">
                <a color="primary" dark v-bind="attrs" v-on="on">
                  <v-img
                    :src="getAvatar"
                    aspect-ratio="1.7"
                  />
                </a>
                <div>
                  <i>Click vào ảnh để thay đổi</i>
                </div>
                <div>
                  <a @click="removeImage()">Click để xóa ảnh đại diện</a>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
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
        <media-dialog />
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
    getAvatar () {
      return `${process.env.MEDIA_URL}/${this.$store.state.product.avatar || 'avatar-default.png'}`
    }
  },
  methods: {
    removeImage () {
      this.$store.commit('product/SET_AVATAR', null)
      this.$store.commit('SET_SELECTED_IMAGE', [])
    },
    handleSelectedImage () {
      this.dialog = false
      const selected = this.$store.state.selectedImages || []
      if (selected && selected.length > 0) {
        this.$store.commit('product/SET_AVATAR', selected[0])
      } else {
        this.$store.commit('product/SET_AVATAR', null)
      }
      this.$store.commit('SET_SELECTED_IMAGE', [])
    }
  }
}
</script>
