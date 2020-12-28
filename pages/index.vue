<template>
  <div id="dashboard">
    <v-alert
      icon="mdi-shield-lock-outline"
      text
      color="primary"
      type="info"
    >
      Chào mừng <span class="font-weight-black">{{ this.$store.state.fullName }}</span> đến với trang quản trị Cốc giấy
    </v-alert>
  </div>
</template>

<script>
export default {
  created () {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Bảng điều khiển')
  }
}
</script>
