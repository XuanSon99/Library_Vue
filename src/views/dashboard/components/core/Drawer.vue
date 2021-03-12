<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :expand-on-hover="expandOnHover"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-break-point="960"
    app
    width="260"
    v-bind="$attrs"
  >
    <template v-slot:img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
    </template>

    <v-divider class="mb-1" />

    <v-list dense nav>
      <v-list-item>
        <v-list-item-avatar class="align-self-center" color="white" contain>
          <v-img
            src="https://scontent.fhph1-1.fna.fbcdn.net/v/t1.0-1/p200x200/119177624_2510064932634095_6895327298751161307_n.jpg?_nc_cat=104&ccb=3&_nc_sid=7206a8&_nc_ohc=dpQe1o1aD1sAX8RvfTp&_nc_ht=scontent.fhph1-1.fna&tp=6&oh=68f9c0300b1ee6eed69a2b1bac75cdfc&oe=6066F1EB"
          />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="display-1" v-text="profile.title" />
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav>
      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />

      <template v-for="(item, i) in computedItems">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item">
          <!--  -->
        </base-item-group>

        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>

      <!-- Style cascading bug  -->
      <!-- https://github.com/vuetifyjs/vuetify/pull/8574 -->
      <div />
    </v-list>

    <!-- <template v-slot:append>
      <base-item
        :item="{
          title: $t('upgrade'),
          icon: 'mdi-package-up',
          to: '/upgrade',
        }"
      />
    </template> -->
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapState } from "vuex";

export default {
  name: "DashboardCoreDrawer",

  props: {
    expandOnHover: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    items: [
      // {
      //   icon: 'mdi-view-dashboard',
      //   title: 'dashboard',
      //   to: '/',
      // },
      // {
      //   icon: 'mdi-account',
      //   title: 'user',
      //   to: '/pages/user',
      // },
      // {
      //   title: 'rtables',
      //   icon: 'mdi-clipboard-outline',
      //   to: '/tables/regular-tables',
      // },
      // {
      //   title: 'typography',
      //   icon: 'mdi-format-font',
      //   to: '/components/typography',
      // },
      // {
      //   title: 'icons',
      //   icon: 'mdi-chart-bubble',
      //   to: '/components/icons',
      // },
      // {
      //   title: 'google',
      //   icon: 'mdi-map-marker',
      //   to: '/maps/google-maps',
      // },
      // {
      //   title: 'notifications',
      //   icon: 'mdi-bell',
      //   to: '/components/notifications',
      // },
      {
        title: "Kết quả học tập",
        icon: "mdi-book-open-page-variant",
        to: "/scores",
      },
      {
        title: "Giáo viên",
        icon: "mdi-account-circle",
        to: "/teachers",
      },
      {
        title: "Học sinh",
        icon: "mdi-shield-home",
        to: "/students",
      },
      {
        title: "Lớp học",
        icon: "mdi-account-heart",
        to: "/classrooms",
      },
      {
        title: "Môn học",
        icon: "mdi-translate",
        to: "/subjects",
      },
      {
        title: "Khối",
        icon: "mdi-bookshelf",
        to: "/grade-level",
      },
      {
        title: "Loại điểm",
        icon: "mdi-book-account",
        to: "/type-mark",
      },
      {
        title: "Tài khoản",
        icon: "mdi-account-supervisor",
        to: "/users",
      },
    ],
  }),

  computed: {
    ...mapState(["barColor", "barImage"]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
    computedItems() {
      return this.items.map(this.mapItem);
    },
    profile() {
      return {
        avatar: true,
        title: this.$t("avatar"),
      };
    },
  },

  methods: {
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: this.$t(item.title),
      };
    },
  },
};
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  .v-list-group__header.v-list-item--active:before
    opacity: .24

    .v-list-item
      &__icon--text,
      &__icon:first-child
        justify-content: center
        text-align: center
        width: 20px

        +ltr()
        margin-right: 24px
        margin-left: 12px !important

        +rtl()
        margin-left: 24px
        margin-right: 12px !important

    .v-list--dense
      .v-list-item
        &__icon--text,
        &__icon:first-child
          margin-top: 10px

    .v-list-group--sub-group
      .v-list-item
        +ltr()
        padding-left: 8px

        +rtl()
        padding-right: 8px

      .v-list-group__header
        +ltr()
        padding-right: 0

        +rtl()
        padding-right: 0

        .v-list-item__icon--text
          margin-top: 19px
          order: 0

        .v-list-group__header__prepend-icon
          order: 2

          +ltr()
          margin-right: 8px

          +rtl()
          margin-left: 8px
</style>
