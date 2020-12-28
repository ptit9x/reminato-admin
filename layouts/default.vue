<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-toolbar color="primary darken-1">
        <img src="../static/bg_icon.png" height="35" alt="App">
      </v-toolbar>
      <v-list dense expand>
        <template v-for="(item, i) in getMenu">
          <!--group with subitems-->
          <v-list-group
            v-if="item.items"
            :key="item.name"
            :group="item.group"
            :prepend-icon="item.icon"
            no-action="no-action"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <template v-for="(subItem, iItem) in item.items">
              <!--sub group-->
              <v-list-group v-if="subItem.items" :key="subItem.name" :group="subItem.group" sub-group="sub-group">
                <v-list-item slot="activator" ripple="ripple">
                  <v-list-item-content>
                    <v-list-item-title>{{ subItem.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  v-for="(grand, index) in subItem.children"
                  :key="index"
                  :to="grand.href? grand.href : null"
                  ripple="ripple"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ grand.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
              <!--child item-->
              <v-list-item
                v-else
                :key="iItem"
                :to="subItem.href? subItem.href : null"
                :disabled="subItem.disabled"
                :target="subItem.target"
                ripple="ripple"
              >
                <v-list-item-content>
                  <v-list-item-title><span>{{ subItem.title }}</span></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action v-if="subItem.action">
                  <v-icon :class="[subItem.actionClass || 'success--text']">
                    {{ subItem.action }}
                  </v-icon>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-list-group>
          <v-subheader v-else-if="item.header" :key="i">
            {{ item.header }}
          </v-subheader>
          <v-divider v-else-if="item.divider" :key="i" />
          <!--top-level link-->
          <v-list-item
            v-else
            :key="item.name"
            :to="item.href ? item.href : null"
            ripple="ripple"
            :disabled="item.disabled"
            :target="item.target"
            rel="noopener"
          >
            <v-list-item-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action v-if="item.subAction">
              <v-icon class="success--text">
                {{ item.subAction }}
              </v-icon>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="primary" dark>
      <v-app-bar-nav-icon color="white" @click.stop="drawer = !drawer" />
      <v-toolbar-title>Trang quản trị</v-toolbar-title>
      <v-spacer />
      <v-menu
        offset-y
        origin="center center"
        :nudge-right="140"
        :nudge-bottom="14"
        transition="scale-transition"
      >
        <!-- <template v-slot:activator="{ on, attrs }">
          <v-btn slot="activator" icon v-bind="attrs" v-on="on">
            <v-badge color="red" overlap>
              <span slot="badge">3</span>
              <v-icon color="white" medium>
                mdi-bell
              </v-icon>
            </v-badge>
          </v-btn>
        </template> -->
        <!-- <notification-list /> -->
      </v-menu>
      <v-menu
        offset-y
        origin="center center"
        :nudge-right="140"
        :nudge-bottom="14"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn slot="activator" icon v-bind="attrs" v-on="on">
            <v-avatar color="primary lighten-1" size="30">
              <span class="white--text">{{ getName }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="(item,index) in accountMenus"
            :key="index"
            :to="!item.href ? { name: item.name } : null"
            :href="item.href"
            ripple="ripple"
            :disabled="item.disabled"
            :target="item.target"
            rel="noopener"
            @click="item.click"
          >
            <v-list-item-action v-if="item.icon">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
        <v-menu>
          <v-btn icon @click.stop="rightDrawer = !rightDrawer">
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-menu>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-snackbar v-model="snackbar" :color="this.$store.state.snackbarColor" :timeout="2000">
        {{ this.$store.state.notifyMessage }}
        <v-btn text @click="closeSnackBar()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-snackbar>
      <page-header />
      <v-container fluid>
        <nuxt />
      </v-container>
      <v-footer height="auto" class="white pa-3 app--footer">
        <span class="caption">Uwash &copy; 2020</span>
        <v-spacer />
        <v-icon color="pink" small>
          mdi-heart
        </v-icon>
      </v-footer>
    </v-main>
  </v-app>
</template>

<script>
import PageHeader from '@/components/PageHeader'
// import NotificationList from '@/components/lists/NotificationList'
import menus from '@/api/menu'
import { ACCESS_ALL } from '@/utils'

export default {
  components: {
    PageHeader
  },
  data () {
    return {
      clipped: false,
      drawer: true,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      accountMenus: [
        {
          icon: 'mdi-account',
          name: 'profile',
          title: 'Tài khoản',
          click: (e) => {
            // console.log('')
          }
        },
        {
          icon: 'mdi-logout',
          href: '#',
          title: 'Thoát',
          click: this.logout
        }
      ]
    }
  },
  middleware: 'authenticated',
  computed: {
    getName () {
      const name = this.$store.state.fullName || 'B'
      return name.charAt(0).toUpperCase() || ''
    },
    getMenu () {
      const permission = this.$store.state.permission
      const accesses = permission.split(',')
      // console.log(accesses)
      if (accesses.includes(ACCESS_ALL)) {
        return menus
      }
      return menus.filter((menu) => {
        if (!menu.permissions) {
          return true
        }
        return menu.permissions.some(v => accesses.includes(v))
      })
    },
    snackbar: {
      get () {
        return this.$store.state.snackbar
      },
      set (value) {
        this.$store.commit('SET_SNACKBAR', value)
      }
    }
  },
  methods: {
    closeSnackBar () {
      this.$store.commit('SET_SNACKBAR', false)
    },
    logout () {
      return this.$store.dispatch('logout').then(() => {
        this.$router.push('/login')
      })
    }
  }
}
</script>
