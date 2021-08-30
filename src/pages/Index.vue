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
                  {{ album.title }}<br />
                  <strong
                    ><u>{{ user(album.userId).name }}</u></strong
                  >
                </p>
              </div>
            </q-img>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Dialog -->
    <q-dialog v-model="createDialog" noBackdropDismiss>
      <q-card class="q-dialog-plugin">
        <q-form @submit="createAlbum">
          <q-card-section>
            <div class="text-h6">Create Album</div>
            <q-input
              filled
              v-model="albumName"
              label="Album Name"
              class="q-pt-md"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'This field is required',
              ]"
            />
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" label="Create Album" type="submit" />
            <q-btn
              color="red"
              flat
              label="Cancel"
              @click="$store.commit('albums/TOGGLE_CREATE_DIALOG')"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Create Loading -->
    <q-dialog v-model="loadingCreate" noBackdropDismiss>
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="row">
            <div class="col-12"><center><q-spinner color="primary" size="3em" /></center></div>
            <div class="col-12 q-pt-md"><center>Creating Album...</center></div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Successfully Created -->
    <q-dialog v-model="successCreated" noBackdropDismiss>
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="row">
            <div class="col-12"><center><q-spinner color="primary" size="3em" /></center></div>
            <div class="col-12 q-pt-md"><center><strong>Successfully Created!</strong></center></div>
            <div class="col-12"><center>Redirecting to {{ albumName }}...</center></div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Fab -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="$store.commit('albums/TOGGLE_CREATE_DIALOG')"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { defineComponent } from "vue";
import { api } from "boot/axios";

export default defineComponent({
  name: "PageIndex",
  data() {
    return {
      albumName: null,
      loadingCreate: false,
      successCreated: false
    };
  },
  created() {
    this.$store.dispatch("albums/fetchAlbums");
    this.$store.dispatch("users/fetchUsers");
    this.$store.dispatch("photos/fetchPhotos");
  },
  methods: {
    openAlbum(id) {
      this.$router.push({ path: `/album/${id}` });
    },
    createAlbum() {
      this.$store.commit('albums/TOGGLE_CREATE_DIALOG');
      this.loadingCreate = true;
      api.post(`/albums`, { title: this.albumName }).then((response) => {
        this.loadingCreate = false;
        this.successCreated = true;
        setTimeout(function (){
          // Just Faking the Data
          this.$router.push({ path: `/album/100` });
        }.bind(this), 3000);
      }).catch((error) => {
        this.$store.commit('albums/TOGGLE_CREATE_DIALOG');
        this.loadingCreate = false;
        console.log(error);
      })
    },
  },
  computed: {
    ...mapState({
      albums: (state) => state.albums.data,
      loading: (state) => state.albums.loading,
      createDialog: (state) => state.albums.createDialog,
      photos: (state) => state.photos,
    }),
    ...mapGetters({
      user: "users/getUser",
      albumRandomPhoto: "photos/getRandomAlbumCoverPhoto",
    }),
  },
});
</script>
