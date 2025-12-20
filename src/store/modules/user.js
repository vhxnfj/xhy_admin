import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    username: '',
    group_id: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USER_NAME: (state, username) => {
    state.username = username
  },
  SET_USER_GROUP: (state, data) => {
    state.group_id = data
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, captcha, time, google_code } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password, captcha, time, google_code }).then(response => {
        const { data } = response;
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  updateInfo({ commit, state }, userInfo) {
    commit('SET_NAME', userInfo.name)
    commit('SET_AVATAR', userInfo.avatar)
    commit('SET_USER_NAME', userInfo.username)
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('登陆超时，请重新登陆!')
        }

        const { name, avatar, username, group_id } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_USER_NAME', username)
        commit('SET_USER_GROUP', group_id)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

