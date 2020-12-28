<template>
  <v-container fluid fill-height>
    <v-layout>
      <div>
        <h2 class="my-3 headline ">
          {{ pageNotFound }}
        </h2>
        <div>
          <v-btn color="primary" @click="goHome">
            Quay về trang chủ
          </v-btn>
        </div>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pageNotFound: '404 - Không tìm thấy kết quả',
      otherError: 'Có lỗi xảy ra'
    }
  },
  methods: {
    goHome () {
      this.$router.push({ path: '/' })
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
