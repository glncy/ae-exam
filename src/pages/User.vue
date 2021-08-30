<template>
  <q-page>
    <div
      class="flex flex-center align-items-center spinner-container"
      v-if="loading || photos.loading"
    >
      <div class="row">
        <div class="col-12">
          <center><q-spinner color="primary" size="3em" /></center>
        </div>
        <div class="col-12 q-pt-md"><center>Loading...</center></div>
      </div>
    </div>
    <div class="row" v-else>
      <div class="col-12">
        <div class="row">
          <div
            class="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-xs-6 link"
            v-for="(album, index) in albums"
            :key="`album-${index}`"
          >
            <q-img
              :src="albumRandomPhoto(album.id).thumbnailUrl"
              @click="openAlbum(album.id)"
            >
              <div
                class="flex items-center absolute-bottom text-container-height"
              >
                <p style="font-size: 14px">
                  {{ album.title }}
                </p>
              </div>
            </q-img>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserAlbums",
  data() {
    return {
      userId: parseInt(this.$route.params.id),
      albumName: null,
      loadingCreate: false,
      successCreated: false,
    };
  },
  created() {
    this.$store.dispatch("albums/fetchAlbumByUserId", this.userId);
    this.$store.dispatch("users/fetchUsers");
    this.$store.dispatch("photos/fetchPhotos");
  },
  methods: {
    openAlbum(id) {
      this.$router.push({ path: `/album/${id}` });
    },
  },
  computed: {
    ...mapState({
      albums: (state) => state.albums.data,
      loading: (state) => state.albums.loading,
      photos: (state) => state.photos,
    }),
    ...mapGetters({
      user: "users/getUser",
      albumRandomPhoto: "photos/getRandomAlbumCoverPhoto",
    }),
  },
});
</script>
