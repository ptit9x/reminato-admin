import axios from 'axios'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { ERROR_LOGIN_OTHER_DEVICE, ERROR_STATUS_USER_CHANGED } from '@/utils'

// create an axios instance
const service = axios.create({
  baseURL: process.env.API_URL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// response interceptor
service.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response.status === 403) {
      return Promise.reject(new Error('Bạn không có quyền thực hiện chức năng này'))
    }

    // do something with request error
    if (error.response.status === 401) {
      /*
    * When response code is 401, try to refresh the token.
    * Eject the interceptor so it doesn't loop in case
    * token refresh causes the 401 response
    */
      axios.interceptors.response.eject(service)
      return service({ url: '/refresh-token-manager', method: 'post' })
        .then((res) => {
          const { accessToken } = res.data
          setToken(accessToken)
          error.response.config.headers.authorization = `Bearer ${accessToken}`
          return axios(error.response.config)
        }).catch((error) => {
          removeToken()
          location.reload()
          return Promise.reject(error)
        })
    }

    if (error.response && error.response.config && error.response.config.responseType && error.response.config.responseType === 'blob') {
      return error.response.data.text().then((v) => {
        return Promise.reject(new Error(JSON.parse(v).message || 'Lỗi khi trả về dạng Blob'))
      })
    }

    const errorMessage = error.response && error.response.data && error.response.data.message ? error.response.data.message : error.message
    if ([ERROR_LOGIN_OTHER_DEVICE, ERROR_STATUS_USER_CHANGED].includes(errorMessage)) {
      removeToken()
      setTimeout(() => location.reload(), 2000)
      const mLogout = {
        [ERROR_LOGIN_OTHER_DEVICE]: 'Tài khoản đã được đăng nhập trên thiết bị khác, hệ thống sẽ tự đăng xuất',
        [ERROR_STATUS_USER_CHANGED]: 'Tài khoản đã dừng kích hoạt, hệ thống sẽ tự động đăng xuất'
      }
      return Promise.reject(new Error(mLogout[errorMessage]))
    }
    return Promise.reject(new Error(errorMessage || 'Có lỗi xảy ra'))
  }
)

export default service
