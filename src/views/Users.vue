<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      color="success"
      dark
      icon="mdi-account-circle"
      title="Tài khoản"
      class="px-5 py-3"
    >
      <!-- update: sort-desc -->
      <v-data-table
        :headers="headers"
        :items="desserts"
        class="elevation-1"
        :search="search"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            />
            <v-spacer />
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Thêm mới
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.name"
                          label="Họ và tên"
                        />
                      </v-col>
                      <v-col cols="12" v-if="editedIndex == -1">
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email"
                        />
                      </v-col>
                      <v-col cols="12" v-else>
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email"
                          readonly
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show ? 'text' : 'password'"
                          name="input-10-2"
                          label="Mật khẩu"
                          class="input-group--focused"
                          @click:append="show = !show"
                          v-model="editedItem.password"
                          v-if="editedIndex == -1"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="show ? 'text' : 'password'"
                          name="input-10-2"
                          label="Nhập lại mật khẩu"
                          class="input-group--focused"
                          @click:append="show = !show"
                          v-model="editedItem.password_confirmation"
                          v-if="editedIndex == -1"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-alert type="warning" dense border="left" v-if="error">
                      {{ error }}
                    </v-alert>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue darken-1" text @click="close"> Hủy </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Lưu </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="headline">
                  Bạn có chắc chắn muốn xóa?
                </v-card-title>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="blue darken-1" text @click="closeDelete">
                    Hủy
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                    Xóa
                  </v-btn>
                  <v-spacer />
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </base-material-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        text: "Họ và tên",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Email", value: "email" },
      { text: "Ngày tạo", value: "created_at" },
      { text: "Hành động", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    defaultItem: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    show: false,
    error: "",
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Thêm mới" : "Sửa";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.getUserList();
  },

  methods: {
    getUserList() {
      this.desserts = [];
      this.CallAPI("get", "users", {}, (response) => {
        for (let item of response.data) {
          this.desserts.push({
            id: item.id,
            name: item.name,
            email: item.email,
            created_at: this.formatDate(item.created_at),
          });
        }
      });
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-GB");
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.closeDelete();
      this.CallAPI(
        "delete",
        "users/" + this.desserts[this.editedIndex].id,
        {},
        (response) => {
          this.$toast.success("Xóa thành công");
          this.getUserList();
        },
        (error) => {
          this.$toast.error("Không thể xóa Admin");
        }
      );
    },

    close() {
      this.error = "";
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        if (!this.editedItem.name) {
          this.error = "Tên không được để trống";
          return;
        }
        let data = {
          name: this.editedItem.name,
        };
        this.CallAPI(
          "put",
          "users/" + this.desserts[this.editedIndex].id,
          data,
          (response) => {
            this.$toast.success("Sửa thành công");
            this.getUserList();
            this.close();
          },
          (error) => {
            console.log(error.response.data);
          }
        );
      } else {
        if (
          !this.editedItem.name ||
          !this.editedItem.email ||
          !this.editedItem.password ||
          !this.editedItem.password_confirmation
        ) {
          this.error = "Vui lòng nhập đủ thông tin";
          return;
        }
        if (!this.validEmail(this.editedItem.email)) {
          this.error = "Email không đúng định dạng";
          return;
        }
        if (this.editedItem.password != this.editedItem.password_confirmation) {
          this.error = "Nhập lại mật khẩu không đúng";
          return;
        }
        this.CallAPI(
          "post",
          "users",
          this.editedItem,
          (response) => {
            this.$toast.success("Thêm thành công");
            this.getUserList();
            this.close();
          },
          (error) => {
            this.error = "Email đã tồn tại";
          }
        );
      }
    },
    validEmail(email) {
      const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return reg.test(email);
    },
    validPhone: function (phone) {
      const reg = /((09|03|07|08|05)+([0-9]{8})\b)/g;
      return reg.test(phone);
    },
  },
};
</script>
