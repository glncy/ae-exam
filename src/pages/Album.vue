<template>
  <q-page>
    <div
      class="flex flex-center align-items-center spinner-container"
      v-if="photos.loading"
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
            class="col-xl-3 col-lg-3 col-md-3 col-sm-4 col-xs-6"
            v-for="(photo, index) in photos.data"
            :key="`photo-${index}`"
          >
            <q-img :src="photo.thumbnailUrl">
              <div class="flex items-center absolute-bottom">
                <div class="row">
                  <div class="col-12">{{ photo.title }}</div>
                  <div class="col-12">
                    <q-btn
                      color="primary"
                      round
                      icon="edit"
                      @click="showUpdatePhoto(photo)"
                    />
                    <q-btn
                      color="red"
                      round
                      icon="delete"
                      @click="confirmDelete(photo)"
                    />
                  </div>
                </div>
              </div>
            </q-img>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Dialog -->
    <q-dialog
      v-model="deleteDialog"
      v-if="album(this.albumId)"
      noBackdropDismiss
    >
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">Delete Album</div>
          <div class="text-subtitle1">
            Do you want to delete
            <strong>{{ album(this.albumId).title }}</strong
            >? Action cannot be undo.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="red"
            flat
            label="Yes, I want to proceed."
            @click="deleteAlbum"
          />
          <q-btn
            color="primary"
            label="No, Thanks"
            @click="$store.commit('albums/TOGGLE_DELETE_DIALOG')"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="deletePhotoDialog" v-if="photo" noBackdropDismiss>
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="text-h6">Delete Photo</div>
          <div class="text-subtitle1">
            Do you want to delete
            <strong>{{ photo.title }}</strong
            >? Action cannot be undo.
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            color="red"
            flat
            label="Yes, I want to proceed."
            @click="deletePhoto"
          />
          <q-btn
            color="primary"
            label="No, Thanks"
            @click="deletePhotoDialog = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Loading Delete -->
    <q-dialog v-model="loadingDelete" noBackdropDismiss>
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <center><q-spinner color="primary" size="3em" /></center>
            </div>
            <div class="col-12 q-pt-md">
              <center>{{ loadingMessage }}...</center>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Successfully Deleted -->
    <q-dialog v-model="successDeleted" noBackdropDismiss>
      <q-card class="q-dialog-plugin">
        <q-card-section>
          <div class="row">
            <div class="col-12">
              <center><q-spinner color="primary" size="3em" /></center>
            </div>
            <div class="col-12 q-pt-md">
              <center><strong>Successfully Deleted!</strong></center>
            </div>
            <div class="col-12"><center>Redirecting to Albums...</center></div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Create Dialog -->
    <q-dialog v-model="createPhotoDialog" noBackdropDismiss>
      <q-card class="q-dialog-plugin">
        <q-form @submit="createPhoto">
          <q-card-section>
            <div class="text-h6">Add Photo</div>
            <q-input
              filled
              v-model="photoTitle"
              label="Photo Title"
              class="q-pt-md"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'This field is required',
              ]"
            />
            <q-file
              class="q-pt-sm"
              outlined
              v-model="photoAttachment"
              lazy-rules
              :rules="[(val) => val || 'This field is required']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <div v-if="image64">
              <span class="q-pt-sm">Preview Image</span>
              <q-img :src="image64" />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" label="Add Photo" type="submit" />
            <q-btn
              color="red"
              flat
              label="Cancel"
              @click="$store.commit('photos/TOGGLE_CREATE_DIALOG')"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Update -->
    <q-dialog v-model="updatePhotoDialog" noBackdropDismiss>
      <q-card class="q-dialog-plugin">
        <q-form @submit="updatePhoto">
          <q-card-section>
            <div class="text-h6">Update Photo</div>
            <q-input
              filled
              v-model="photoTitle"
              label="Photo Title"
              class="q-pt-md"
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'This field is required',
              ]"
            />
            <q-file class="q-pt-sm" outlined v-model="photoAttachment">
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
            <div v-if="image64">
              <span class="q-pt-sm"
                >Current Image (Attach Image if you want to Update)</span
              >
              <q-img :src="image64" />
            </div>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" label="Update Photo" type="submit" />
            <q-btn
              color="red"
              flat
              label="Cancel"
              @click="updatePhotoDialog = false"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Fab -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="$store.commit('photos/TOGGLE_CREATE_DIALOG')"/>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { defineComponent } from "vue";
import { api } from "boot/axios";

export default defineComponent({
  name: "AlbumPage",
  data() {
    return {
      albumId: parseInt(this.$route.params.id),
      loadingDelete: false,
      successDeleted: false,
      loadingMessage: null,
      photo: null,
      deletePhotoDialog: false,
      photoTitle: null,
      photoAttachment: null,
      image64: null,
      updatePhotoDialog: false,
    };
  },
  emits: ["ok", "hide"],
  created() {
    this.$store.dispatch("albums/fetchAlbums");
    this.$store.dispatch("users/fetchUsers");
    this.$store.dispatch("photos/fetchPhotosByAlbumId", this.albumId);
  },
  methods: {
    deleteAlbum() {
      this.loadingMessage = "Deleting Album";
      this.$store.commit("albums/TOGGLE_DELETE_DIALOG");
      this.loadingDelete = true;
      api
        .delete(`/albums/${this.albumId}`)
        .then((response) => {
          this.loadingDelete = false;
          this.successDeleted = true;
          setTimeout(
            function () {
              this.$router.replace({ path: `/` });
            }.bind(this),
            3000
          );
        })
        .catch((error) => {
          this.$store.commit("albums/TOGGLE_DELETE_DIALOG");
          this.loadingDelete = false;
          console.log(error);
        });
    },
    confirmDelete(photo) {
      this.photo = photo;
      this.deletePhotoDialog = true;
    },
    deletePhoto() {
      this.deletePhotoDialog = false;
      this.loadingMessage = "Deleting Photo";
      this.loadingDelete = true;
      api
        .delete(`/photos/${this.photo.id}`)
        .then((response) => {
          this.loadingDelete = false;
          // TO FAKE DELETE
          this.$store.commit("photos/DELETE_PHOTO", this.photo.id);
        })
        .catch((error) => {
          this.loadingDelete = false;
          console.log(error);
        });
    },
    createPhoto() {
      this.$store.commit("photos/TOGGLE_CREATE_DIALOG");
      this.loadingMessage = "Creating Photo";
      this.loadingDelete = true;
      api
        .post(`/albums/${this.albumId}/photos`, {
          title: this.photoTitle,
          image: this.image64,
        })
        .then((response) => {
          this.loadingDelete = false;
          // TO FAKE CREATE
          this.$store.commit("photos/CREATE_PHOTO", {
            albumId: this.albumId,
            title: this.photoTitle,
            image: this.image64,
          });
          this.photoTitle = null;
          this.image64 = null;
          this.photoAttachment = null;
        })
        .catch((error) => {
          this.loadingDelete = false;
          console.log(error);
        });
    },
    showUpdatePhoto(photo) {
      this.photo = photo;
      this.updatePhotoDialog = true;
      this.photoTitle = photo.title;
      this.image64 = photo.thumbnailUrl;
      this.photoAttachment = null;
    },
    updatePhoto() {
      this.updatePhotoDialog = false;
      this.loadingMessage = "Updating Photo";
      this.loadingDelete = true;
      if (!isNaN(this.photo.id)) {
        api
          .put(`/photos/${this.photo.id}`, {
            title: this.photoTitle,
            image: this.image64,
          })
          .then((response) => {
            this.loadingDelete = false;
            // TO FAKE UPDATE
            this.$store.commit("photos/UPDATE_PHOTO", {
              id: this.photo.id,
              title: this.photoTitle,
              image: this.image64,
            });
            this.photoTitle = null;
            this.image64 = null;
            this.photoAttachment = null;
            this.photo = null;
          })
          .catch((error) => {
            this.loadingDelete = false;
            console.log(error);
          });
      } else {
        this.loadingDelete = false;
        // TO FAKE UPDATE
        this.$store.commit("photos/UPDATE_PHOTO", {
          id: this.photo.id,
          title: this.photoTitle,
          image: this.image64,
        });
        this.photoTitle = null;
        this.image64 = null;
        this.photoAttachment = null;
        this.photo = null;
      }
    },
  },
  computed: {
    ...mapState({
      photos: (state) => state.photos,
      deleteDialog: (state) => state.albums.deleteDialog,
      createPhotoDialog: (state) => state.photos.createDialog,
    }),
    ...mapGetters({
      album: "albums/getAlbum",
      user: "users/getUser",
    }),
  },
  watch: {
    photoAttachment(data) {
      if (data) {
        const reader = new FileReader();
        reader.readAsDataURL(data);
        reader.onload = () => {
          this.image64 = reader.result;
        };
      }
    },
  },
});
</script>
