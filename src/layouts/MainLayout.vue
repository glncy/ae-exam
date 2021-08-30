<template>
  <q-layout view="lHh Lpr lFf" class="background">
    <q-header class="text-primary" style="background: rgba(255, 255, 255, 0.8)">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title v-if="$route.meta && $route.meta.name === `indexPage`">
          <strong>Albums</strong>
        </q-toolbar-title>
        <q-toolbar-title
          v-else-if="
            $route.meta &&
            $route.meta.name === `albumPage` &&
            album(parseInt($route.params.id))
          "
        >
          <strong>Album: {{ album(parseInt($route.params.id)).title }}</strong>
        </q-toolbar-title>
        <q-toolbar-title
          v-else-if="
            $route.meta &&
            $route.meta.name === `userAlbums` &&
            user(parseInt($route.params.id))
          "
        >
          Albums of <strong>{{ user(parseInt($route.params.id)).name }}</strong>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above class="bg-grey-1 sidenav">
      <div class="flex flex-center flex-height q-px-md">
        <div
          class="row text-center"
          v-if="$route.meta && $route.meta.name === `indexPage`"
        >
          <div class="col-12">
            <span class="text-h3"><strong>Albums</strong></span>
          </div>
          <div class="col-12">
            <hr />
          </div>
          <div class="col-12 text-body1">
            Welcome and Free to Browse available Albums
          </div>
          <div class="col-12 q-pt-lg">
            <q-btn
              unelevated
              rounded
              color="primary"
              label="Create Album"
              icon="add"
              @click="$store.commit('albums/TOGGLE_CREATE_DIALOG')"
            />
          </div>
        </div>
        <div
          class="row text-center"
          v-else-if="
            $route.meta &&
            $route.meta.name === `albumPage` &&
            album(parseInt($route.params.id))
          "
        >
          <div class="col-12">
            <q-btn
              unelevated
              rounded
              flat
              color="primary"
              label="Go Back"
              icon="arrow_back"
              @click="$router.back()"
            />
          </div>
          <div class="col-12 q-pt-md" v-if="!editAlbum">
            <span class="text-h5"
              ><strong>{{ album(parseInt($route.params.id)).title }}</strong>
              <q-icon
                name="edit"
                class="text-h6"
                style="opacity: 0.5"
                @click="openEdit"
            /></span>
          </div>
          <div class="col-12 q-pt-md" v-else>
            <q-form @submit="updateEdit">
              <div class="row items-center">
                <div class="col-12">
                  <q-input
                    filled
                    v-model="albumName"
                    class="q-pt-md"
                    lazy-rules
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'This field is required',
                    ]"
                  />
                </div>
                <div class="col-6">
                  <q-btn
                    unelevated
                    rounded
                    color="green"
                    icon="done"
                    type="submit"
                  />
                </div>
                <div class="col-6">
                  <q-btn
                    unelevated
                    rounded
                    color="red"
                    icon="close"
                    @click="cancelEdit"
                  />
                </div>
              </div>
            </q-form>
          </div>
          <div class="col-12" v-if="albumUpdating">
            <span>Updating Album...</span>
          </div>
          <div class="col-12">
            <hr />
          </div>
          <div
            class="col-12 text-body1"
            v-if="user(album(parseInt($route.params.id)).userId)"
          >
            By
            <strong
              class="link"
              @click="openUser(album(parseInt($route.params.id)).userId)"
              ><u>{{
                user(album(parseInt($route.params.id)).userId).name
              }}</u></strong
            >
          </div>
          <div class="col-12 q-pt-lg">
            <q-btn
              unelevated
              rounded
              color="primary"
              label="Add Photo"
              icon="add"
              @click="$store.commit('photos/TOGGLE_CREATE_DIALOG')"
            />
          </div>
          <div class="col-12 q-pt-md">
            <q-btn
              unelevated
              rounded
              flat
              color="red"
              label="Delete Album"
              @click="$store.commit('albums/TOGGLE_DELETE_DIALOG')"
            />
          </div>
        </div>
        <!-- User Albums -->
        <div
          class="row text-center"
          v-else-if="
            $route.meta &&
            $route.meta.name === `userAlbums` &&
            user(parseInt($route.params.id))
          "
        >
          <div class="col-12">
            <q-btn
              unelevated
              rounded
              flat
              color="primary"
              label="Go Back"
              icon="arrow_back"
              @click="$router.back()"
            />
          </div>
          <div class="col-12 text-body1 q-pt-md">Albums of</div>
          <div class="col-12 text-h4">
            <strong>{{ user(parseInt($route.params.id)).name }}</strong>
          </div>
          <div class="col-12">
            <hr />
          </div>
          <div class="col-12 text-body1">
            @{{ user(parseInt($route.params.id)).username }}
          </div>
          <div class="col-12 text-body1">
            {{ user(parseInt($route.params.id)).email }} /
            {{ user(parseInt($route.params.id)).website }}
          </div>
          <div class="col-12">
            <hr />
          </div>
          <div class="col-12 text-body1">
            Company: {{ user(parseInt($route.params.id)).company.name }}
          </div>
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",
  data() {
    return {
      editAlbum: false,
      albumName: null,
    };
  },
  setup() {
    const leftDrawerOpen = ref(false);
    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  computed: {
    ...mapState({
      albumUpdating: (state) => state.albums.updating,
    }),
    ...mapGetters({
      album: "albums/getAlbum",
      user: "users/getUser",
    }),
  },
  methods: {
    openEdit() {
      this.albumName = this.album(parseInt(this.$route.params.id)).title;
      this.editAlbum = true;
    },
    cancelEdit() {
      this.albumName = this.album(parseInt(this.$route.params.id)).title;
      this.editAlbum = false;
    },
    updateEdit() {
      this.$store.dispatch("albums/updateAlbum", {
        id: parseInt(this.$route.params.id),
        albumName: this.albumName,
      });
      this.editAlbum = false;
    },
    openUser(id) {
      this.$router.push({ path: `/user/${id}` });
    },
  },
});
</script>

<style lang="scss" scoped>
.sidenav {
  width: 300px !important;
}

.flex-height {
  height: 100vh;
}
</style>
