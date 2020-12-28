<template>
  <v-card class="elevation-0">
    <v-toolbar dense color="transparent">
      <v-toolbar-title>
        <h4>Thông báo</h4>
      </v-toolbar-title>
    </v-toolbar>
    <v-divider />
    <v-card-text class="pa-0">
      <v-list>
        <v-list-item-group>
          <template v-for="(item, index) in items">
            <v-subheader v-if="item.header" :key="item.header">
              {{ item.header }}
            </v-subheader>
            <v-divider v-else-if="item.divider" :key="index" />
            <v-list-item v-else :key="item.title" @click="handleClick">
              <v-list-item-avatar :color="item.color">
                <v-icon dark>
                  {{ item.icon }}
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-subtitle v-text="item.title" />
              </v-list-item-content>
              <v-list-item-action class="caption">
                {{ item.timeLabel }}
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>
      <v-divider />
      <v-btn block class="ma-0">
        Xem tất cả
      </v-btn>
      <v-divider />
    </v-card-text>
  </v-card>
</template>

<script>
import notes from '@/api/notification'
export default {
  data: () => ({
    items: notes
  }),
  methods: {
    handleClick: (e) => {
      // console.log(e)
    }
  }
}
</script>
