const SET_TERMINALINFO = 'SET_TERMINALINFO'
const app = {
  state: {
    terminalinfo: []
  },
  mutations: {
    [SET_TERMINALINFO]: (state, data) => {
      state.terminalinfo = data
    }
  },
  actions: {
    setTerminalInfo: ({ commit }, data) => {
      commit('SET_TERMINALINFO', data)
    }
  }
}
export default app
