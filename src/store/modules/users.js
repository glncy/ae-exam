import { api } from "boot/axios";

const getters = {
  getUser: (state) => (id) => {
    return state.data.find(user => user.id === id);
  }
};

const mutations = {
  SET_USERS(state, users) {
    state.data = users;
  },
  TOGGLE_LOADING(state) {
    state.loading = !state.loading;
  },
};

const actions = {
  fetchUsers({ commit }) {
    commit("TOGGLE_LOADING");
    api
      .get("/users")
      .then((response) => {
        commit("SET_USERS", response.data);
        commit("TOGGLE_LOADING");
      })
      .catch((error) => {
        console.log(error);
        commit("TOGGLE_LOADING");
      });
  },
};

const state = {
  data: [],
  loading: false,
};

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
};
