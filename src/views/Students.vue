<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      color="success"
      dark
      icon="mdi-account-heart-outline"
      title="Sinh viên"
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
                      <v-col cols="12">
                        <v-select
                          :items="classList"
                          v-model="editedItem.class_id"
                          label="Lớp"
                          item-text="name"
                          item-value="id"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.address"
                          label="Địa chỉ"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="gender"
                          v-model="editedItem.gender"
                          label="Giới tính"
                          item-text="name"
                          item-value="value"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.birthday"
                          label="Ngày sinh"
                          placeholder="12/04/1999"
                        />
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
      { text: "Tên lớp", value: "classroom" },
      { text: "Địa chỉ", value: "address" },
      { text: "Giới tính", value: "sex" },
      { text: "Ngày sinh", value: "birthday" },
      { text: "Hành động", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      class_id: "",
      address: "",
      gender: "",
      birthday: "",
    },
    defaultItem: {
      name: "",
      class_id: "",
      address: "",
      gender: "",
      birthday: "",
    },
    error: "",
    gender: [
      { value: "male", name: "Nam" },
      { value: "female", name: "Nữ" },
    ],
    classList: [],
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
    this.CallAPI("get", "classrooms", {}, (response) => {
      this.classList = response.data;
    });
  },

  methods: {
    getUserList() {
      this.desserts = [];
      this.CallAPI("get", "students", {}, (response) => {
        for (let item of response.data) {
          this.desserts.push({
            id: item.id,
            name: item.name,
            class_id: item.class_id,
            classroom: item.classroom.name,
            address: item.address,
            gender: item.gender,
            birthday: this.formatDate(item.birthday),
            sex: item.gender == "female" ? "Nữ" : "Nam",
          });
        }
      });
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-GB");
    },

    formatDate2(date) {
      return date.split("/").reverse().join("-");
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
        "students/" + this.desserts[this.editedIndex].id,
        {},
        (response) => {
          this.$toast.success("Xóa thành công");
          this.getUserList();
        },
        (error) => {
          this.$toast.error("Lỗi: " + error.response.data);
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
      let data = {
        name: this.editedItem.name,
        class_id: this.editedItem.class_id,
        address: this.editedItem.address,
        gender: this.editedItem.gender,
        birthday: this.formatDate2(this.editedItem.birthday),
      };
      if (
        !this.editedItem.name ||
        !this.editedItem.class_id ||
        !this.editedItem.address ||
        !this.editedItem.gender ||
        !this.editedItem.birthday
      ) {
        this.error = "Vui lòng nhập đủ thông tin";
        return;
      }
      if (!this.validDate(this.editedItem.birthday)) {
        this.error = "Ngày sinh không đúng định dạng";
        return;
      }
      if (this.editedIndex > -1) {
        this.CallAPI(
          "put",
          "students/" + this.desserts[this.editedIndex].id,
          data,
          (response) => {
            this.$toast.success("Sửa thành công");
            this.getUserList();
            this.close();
          },
          (error) => {
            this.error = "Mã sinh viên đã tồn tại";
          }
        );
      } else {
        this.CallAPI(
          "post",
          "students",
          data,
          (response) => {
            this.$toast.success("Thêm thành công");
            this.getUserList();
            this.close();
          },
          (error) => {
            this.error = "Mã sinh viên đã tồn tại";
          }
        );
      }
    },
    validEmail(email) {
      const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return reg.test(email);
    },
    validPhone(phone) {
      const reg = /((09|03|07|08|05)+([0-9]{8})\b)/g;
      return reg.test(phone);
    },
    validDate(date) {
      const reg = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
      return reg.test(date);
    },
  },
};
</script>
