<template>
  <v-container fluid>
    <v-layout wrap class="x-grid-lg">
      <v-flex
        v-for="(item, index) in folders"
        :key="'folder' + index"
        lg3
        sm6
        xs12
        class="pa-2"
      >
        <v-card tile>
          <v-img height="150px">
            <v-icon size="135" class="mx-auto" color="primary">
              mdi-folder
            </v-icon>
          </v-img>
          <v-divider />
          <v-card-title>
            {{ item.name }}
          </v-card-title>
        </v-card>
      </v-flex>
      <v-flex
        v-for="(item, index) in files"
        :key="index"
        lg2
        sm6
        xs12
        class="pa-2"
      >
        <v-card tile>
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
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
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
    folders: []
  }),
  methods: {
    getPath (file) {
      return `${process.env.MEDIA_URL}/${file.name}`
    }
  }
}
</script>
