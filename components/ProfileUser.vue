<template>
  <v-widget :title="getTitle()">
    <div v-if="user" slot="widget-content">
      <!-- <v-img :src="user.avatar || '/avatar-default.png'" height="300">
        <v-layout column class="media ma-0">
          <v-card-title>
            <v-btn dark icon @click="$router.go(-1)">
              <v-icon>chevron_left</v-icon>
            </v-btn>
            <v-spacer />
            <v-btn dark icon class="mr-3" @click="goAccountEdit()">
              <v-icon>edit</v-icon>
            </v-btn>
          </v-card-title>
          <v-spacer />
          <v-card-title dark class="pl-5 pt-5">
            <div class="display-1 pl-2 pt-2 pr-2 pb-2 black white--text">
              {{ `${user.firstName} ${user.lastName}` }}
            </div>
          </v-card-title>
        </v-layout>
      </v-img> -->
      <v-list two-line class="pa-0">
        <v-list-item>
          <v-list-item-action>
            <v-icon color="primary">
              mdi-account
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ getFullName() }}</v-list-item-title>
            <v-list-item-subtitle>Họ tên</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider inset />
        <v-list-item>
          <v-list-item-action>
            <v-icon color="primary">
              mdi-phone
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ user.mobile }}</v-list-item-title>
            <v-list-item-subtitle>Số điện thoại</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider inset />
        <v-list-item>
          <v-list-item-action>
            <v-icon color="primary">
              mdi-mail
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ user.email }}</v-list-item-title>
            <v-list-item-subtitle>Địa chỉ Email</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider inset />
        <v-list-item v-if="getAddress()">
          <v-list-item-action>
            <v-icon color="primary">
              mdi-map-marker
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ getAddress() }}</v-list-item-title>
            <v-list-item-subtitle>Địa chỉ</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="getAddress()" inset />
        <v-list-item v-if="user.deviceId">
          <v-list-item-action>
            <v-icon color="primary">
              mdi-cellphone
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ user.deviceId }}</v-list-item-title>
            <v-list-item-subtitle>Thiết bị đang sử dụng</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="user.deviceId" inset />
        <v-list-item v-if="user.roleName">
          <v-list-item-action>
            <v-icon color="primary">
              mdi-eye
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ user.roleName }}
            </v-list-item-title>
            <v-list-item-subtitle>Vai trò</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-widget>
</template>
<script>
import VWidget from '@/components/VWidget'
import {
  getAccessName,
  getAccessColor,
  getColorAccountStatus
} from '@/utils'

export default {
  components: {
    VWidget
  },
  props: {
    user: {
      type: Object,
      default () {
        return null
      }
    },
    isStore: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  methods: {
    getTitle () {
      return 'Thông tin tài khoản'
    },
    getFullName () {
      if (this.user && this.user.fullName) {
        return this.user.fullName
      }
      if (this.user && this.user.firstName && this.user.lastName) {
        return `${this.user.firstName} ${this.user.lastName}`
      }
      return null
    },
    getAddress () {
      if (this.user && this.user.street && this.user.state && this.user.city) {
        return `${this.user.street}, ${this.user.state}, ${this.user.city}`
      }
      return null
    },
    getAccessColor (roleCode) {
      return getAccessColor(roleCode)
    },
    getAccessName (roleCode) {
      return getAccessName(roleCode)
    },
    getStatusIcon (status) {
      const names = {
        INACTIVATED: 'mdi-close-box',
        ACTIVATED: 'mdi-check-circle',
        LOCKED: 'mdi-lock'
      }

      return names[status] || ''
    },
    goAccountEdit () {
      this.$router.push({ path: `/customer/${this.user.id}` })
    },
    getColorStatus (status) {
      return getColorAccountStatus(status)
    }
  }
}
</script>
