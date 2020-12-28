export const state = () => ({
  avatar: null,
  galleries: null
})

export const mutations = {
  SET_AVATAR (state, avatar) {
    state.avatar = avatar
  },
  SET_ALBUM (state, galleries) {
    state.galleries = galleries
  }
}
