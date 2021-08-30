import { api } from "boot/axios";

const getters = {
  getAlbum: (state) => (id) => {
    return state.data.find((album) => album.id === id);
  },
};

const mutations = {
  SET_ALBUMS(state, albums) {
    state.data = albums;
  },
  TOGGLE_LOADING(state) {
    state.loading = !state.loading;
  },
  TOGGLE_DELETE_DIALOG(state) {
    state.deleteDialog = !state.deleteDialog;
  },
  TOGGLE_CREATE_DIALOG(state) {
    state.createDialog = !state.createDialog;
  },
  TOGGLE_UPDATING(state) {
    state.updating = !state.updating;
  },
  UPDATE_ALBUM(state, data) {
    // To Fake Update
    let index = state.data.findIndex((album) => album.id === data.id);
    state.data[index].title = data.albumName;
  },
};

const actions = {
  fetchAlbums({ commit }) {
    commit("TOGGLE_LOADING");
    api
      .get("/albums")
      .then((response) => {
        commit("SET_ALBUMS", response.data);
        commit("TOGGLE_LOADING");
      })
      .catch((error) => {
        console.log(error);
        commit("TOGGLE_LOADING");
      });
  },
  fetchAlbumByUserId({ commit }, userId) {
    commit("TOGGLE_LOADING");
    api
      .get(`/albums?userId=${userId}`)
      .then((response) => {
        commit("SET_ALBUMS", response.data);
        commit("TOGGLE_LOADING");
      })
      .catch((error) => {
        console.log(error);
        commit("TOGGLE_LOADING");
      });
  },
  updateAlbum({ commit }, data) {
    commit("TOGGLE_UPDATING");
    api
      .put(`/albums/${data.id}`, { title: data.albumName })
      .then((response) => {
        commit("UPDATE_ALBUM", data);
        commit("TOGGLE_UPDATING");
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

const state = {
  data: [],
  loading: false,
  updating: false,
  deleteDialog: false,
  createDialog: false,
};

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
};
