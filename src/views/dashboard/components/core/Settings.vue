<template>
  <div id="settings-wrapper">
    <v-card
      id="settings"
      class="py-2 px-4"
      color="rgba(0, 0, 0, .3)"
      dark
      flat
      link
      min-width="100"
      style="position: fixed; top: 115px; right: -35px; border-radius: 8px;"
    >
      <v-icon large>
        mdi-cog-outline
      </v-icon>
    </v-card>

    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      activator="#settings"
      bottom
      content-class="v-settings"
      left
      nudge-left="8"
      offset-x
      origin="top right"
      transition="scale-transition"
    >
      <v-card
        class="text-center mb-0"
        width="300"
      >
        <v-card-text>
          <strong class="mb-3 d-inline-block">SIDEBAR FILTERS</strong>

          <v-item-group v-model="color">
            <v-item
              v-for="color in colors"
              :key="color"
              :value="color"
            >
              <template v-slot="{ active, toggle }">
                <v-avatar
                  :class="active && 'v-settings__item--active'"
                  :color="color"
                  class="v-settings__item"
                  size="25"
                  @click="toggle"
                />
              </template>
            </v-item>
          </v-item-group>

          <v-divider class="my-4 secondary" />

          <v-row
            align="center"
            no-gutters
          >
            <v-col cols="auto">
              Dark Mode
            </v-col>

            <v-spacer />

            <v-col cols="auto">
              <v-switch
                v-model="$vuetify.theme.dark"
                class="ma-0 pa-0"
                color="secondary"
                hide-details
              />
            </v-col>
          </v-row>

          <v-divider class="my-4 secondary" />

          <v-row
            align="center"
            no-gutters
          >
            <v-col cols="auto">
              Sidebar Image
            </v-col>

            <v-spacer />

            <v-col cols="auto">
              <v-switch
                v-model="showImg"
                class="ma-0 pa-0"
                color="secondary"
                hide-details
              />
            </v-col>
          </v-row>

          <v-divider class="my-4 secondary" />

          <strong class="mb-3 d-inline-block">IMAGES</strong>

          <v-item-group
            v-model="image"
            class="d-flex justify-space-between mb-3"
          >
            <v-item
              v-for="image in images"
              :key="image"
              :value="image"
              class="mx-1"
            >
              <template v-slot="{ active, toggle }">
                <v-sheet
                  :class="active && 'v-settings__item--active'"
                  class="d-inline-block v-settings__item"
                  @click="toggle"
                >
                  <v-img
                    :src="image"
                    height="100"
                    width="50"
                  />
                </v-sheet>
              </template>
            </v-item>
          </v-item-group>

          <v-btn
            block
            class="mb-3"
            color="success"
            href="https://www.creative-tim.com/product/vuetify-material-dashboard"
            default
            rel="noopener"
            target="_blank"
          >
            Free Download
          </v-btn>

          <v-btn
            block
            class="mb-3"
            color="grey darken-1"
            dark
            href="https://vuetifyjs.com/components/api-explorer"
            default
            rel="noopener"
            target="_blank"
          >
            Documentation
          </v-btn>

          <div class="my-12" />

          <div>
            <strong class="mb-3 d-inline-block">THANK YOU FOR SHARING!</strong>
          </div>

          <v-btn
            class="ma-1"
            color="#55acee"
            dark
            default
            rounded
          >
            <v-icon>mdi-twitter</v-icon>
            - 45
          </v-btn>

          <v-btn
            class="ma-1"
            color="#3b5998"
            dark
            default
            rounded
          >
            <v-icon>mdi-facebook</v-icon>
            - 50
          </v-btn>
        </v-card-text>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
  // Mixins
  import Proxyable from 'vuetify/lib/mixins/proxyable'
  import { mapMutations, mapState } from 'vuex'

  export default {
    name: 'DashboardCoreSettings',

    mixins: [Proxyable],

    data: () => ({
      color: '#E91E63',
      colors: [
        '#9C27b0',
        '#00CAE3',
        '#4CAF50',
        '#ff9800',
        '#E91E63',
        '#FF5252',
      ],
      image: 'https://scontent.fhph1-1.fna.fbcdn.net/v/t1.0-9/71202321_2232037127103545_4144310576379592704_n.jpg?_nc_cat=100&ccb=3&_nc_sid=174925&_nc_ohc=Yo7BwOPEu98AX_Ffp9_&_nc_ht=scontent.fhph1-1.fna&oh=c525f88ab2a1c88b238b2b5b481b0115&oe=60693032',
      images: [
        'https://scontent.fhph1-1.fna.fbcdn.net/v/t1.0-9/71202321_2232037127103545_4144310576379592704_n.jpg?_nc_cat=100&ccb=3&_nc_sid=174925&_nc_ohc=Yo7BwOPEu98AX_Ffp9_&_nc_ht=scontent.fhph1-1.fna&oh=c525f88ab2a1c88b238b2b5b481b0115&oe=60693032',
        'https://scontent.fhph1-2.fna.fbcdn.net/v/t1.0-9/147504762_2619215448385709_8520249369063680691_o.jpg?_nc_cat=106&ccb=3&_nc_sid=8bfeb9&_nc_ohc=391AqraXB40AX8XNgTX&_nc_ht=scontent.fhph1-2.fna&oh=b77f38a8ab39b7262cf7393b9323f366&oe=606954BB',
        'https://scontent.fhph1-2.fna.fbcdn.net/v/t1.0-9/22309013_1725797644394165_6794979021050569552_n.jpg?_nc_cat=103&ccb=3&_nc_sid=19026a&_nc_ohc=4IrqAI25cboAX8LPLDS&_nc_ht=scontent.fhph1-2.fna&oh=c4a5a7e4f5c32ad8ce21ebbe4a818a34&oe=60671B4E',
        '/images/tuyenthui.jpg',
      ],
      menu: false,
      saveImage: '',
      showImg: true,
    }),

    computed: {
      ...mapState(['barImage']),
    },

    watch: {
      color (val) {
        this.$vuetify.theme.themes[this.isDark ? 'dark' : 'light'].primary = val
      },
      showImg (val) {
        if (!val) {
          this.saveImage = this.barImage
          this.setBarImage('')
        } else if (this.saveImage) {
          this.setBarImage(this.saveImage)
          this.saveImage = ''
        } else {
          this.setBarImage(val)
        }
      },
      image (val) {
        this.setBarImage(val)
      },
    },

    methods: {
      ...mapMutations({
        setBarImage: 'SET_BAR_IMAGE',
      }),
    },
  }
</script>

<style lang="sass">
  .v-settings
    .v-item-group > *
      cursor: pointer

    &__item
      border-width: 3px
      border-style: solid
      border-color: transparent !important

      &--active
        border-color: #00cae3 !important
</style>
