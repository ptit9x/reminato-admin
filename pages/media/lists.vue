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
            <v-spacer />
            <v-btn-toggle v-model="view">
              <v-btn value="list">
                <v-icon color="primary">
                  mdi-view-list
                </v-icon>
              </v-btn>
              <v-btn value="grid">
                <v-icon color="primary">
                  mdi-view-module
                </v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-toolbar>
          <v-divider />
          <div class="layout media-layout">
            <div class="media-content flex transparent">
              <div v-if="view ==='grid'">
                <media-grid :files="files" />
              </div>
              <div v-else>
                <media-list :files="files" />
              </div>
            </div>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { getListMedia } from '@/api/media'
import MediaGrid from '@/components/media/MediaGrid'
import MediaList from '@/components/media/MediaList'

export default {
  layout: 'dashboard',
  components: {
    MediaGrid,
    MediaList
  },
  data: () => ({
    size: 'lg',
    view: 'grid',
    selectedFile: {
      path: '/static/icon/empty_file.svg'
    },
    files: []
  }),
  created () {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Thư viện')
    this.fetchData()
  },
  methods: {
    fetchData () {
      getListMedia({})
        .then((res) => {
          this.files = res.data
        })
        .catch((error) => {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    },
    goto (slug) {
      if (slug) {
        this.$router.push({ path: `/media/${slug}` })
      } else {
        this.$router.push({ path: '/media' })
      }
    }
  }
}
</script>
