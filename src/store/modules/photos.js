import { api } from "boot/axios";

const getters = {
  getRandomAlbumCoverPhoto: (state) => (albumId) => {
    let photos = state.data.filter((photo) => photo.albumId === albumId);
    return photos[0];
  },
};

const mutations = {
  SET_PHOTOS(state, photos) {
    state.data = photos;
  },
  TOGGLE_LOADING(state) {
    state.loading = !state.loading;
  },
  TOGGLE_CREATE_DIALOG(state) {
    state.createDialog = !state.createDialog;
  },
  DELETE_PHOTO(state, id) {
    let index = state.data.findIndex((photo) => photo.id === id);
    state.data.splice(index, 1);
  },
  CREATE_PHOTO(state, data) {
    let newId = (Math.random() + 1).toString(36).substring(7);
    state.data.unshift({
      id: newId,
      thumbnailUrl: data.image,
      title: data.title,
      albumId: data.albumId,
    });
  },
  UPDATE_PHOTO(state, data) {
    let index = state.data.findIndex((photo) => photo.id === data.id);
    state.data[index].title = data.title;
    state.data[index].thumbnailUrl = data.image;
  },
};

const actions = {
  fetchPhotos({ commit }) {
    commit("TOGGLE_LOADING");
    api
      .get("/photos")
      .then((response) => {
        commit("SET_PHOTOS", response.data);
        commit("TOGGLE_LOADING");
      })
      .catch((error) => {
        console.log(error);
        commit("TOGGLE_LOADING");
      });
  },
  fetchPhotosByAlbumId({ commit }, albumId) {
    commit("TOGGLE_LOADING");
    api
      .get(`/albums/${albumId}/photos`)
      .then((response) => {
        commit("SET_PHOTOS", response.data);
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
  createDialog: false,
};

export default {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
};
