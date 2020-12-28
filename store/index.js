import { login, getInfo } from '@/api/staff'
import { getToken, setToken, removeToken } from '@/utils/auth'

export const state = () => ({
  token: getToken(),
  fullName: '',
  avatar: '',
  permission: '',
  snackbar: false,
  snackbarColor: 'red darken-4',
  notifyMessage: null,
  pageHeaderTitle: '',
  selectedImages: []
})

export const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, fullName) => {
    state.fullName = fullName
  },
  SET_PERMISSION: (state, permission) => {
    state.permission = permission
  },
  SET_SNACKBAR: (state, snackbar) => {
    state.snackbar = snackbar
  },
  SET_SNACKBAR_COLOR: (state, color) => {
    state.snackbarColor = color
  },
  SET_NOTIFY_MESSAGE: (state, mes) => {
    state.notifyMessage = mes
  },
  SET_PAGE_HEADER_TITLE: (state, title) => {
    state.pageHeaderTitle = title
  },
  SET_SELECTED_IMAGE: (state, images) => {
    state.selectedImages = images
  }
}

export const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { email, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ email: email.trim(), password }).then(({ data }) => {
        commit('SET_TOKEN', data.accessToken) // save to store
        setToken(data.accessToken) // save to cookie
        resolve()
      }).catch((error) => {
        reject(error)
      })
    })
  },
  // user logout
  logout ({ commit }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_NAME', '')
      commit('SET_PERMISSION', '')
      removeToken()
      resolve()
    })
  },
  // get user info
  getInfo ({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(({ data }) => {
        if (!data) {
          reject(new Error('Có lỗi xảy ra, vui lòng đăng nhập lại.'))
        }

        const { fullName, access } = data

        commit('SET_NAME', fullName)
        commit('SET_PERMISSION', access)
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}
