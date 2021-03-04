<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      color="success"
      dark
      icon="mdi-account-heart-outline"
      title="Độc giả"
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
                        <v-text-field
                          v-model="editedItem.student_code"
                          label="Mã sinh viên"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.email"
                          label="Email"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.phone"
                          label="Số điện thoại"
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
      { text: "Mã SV", value: "student_code" },
      { text: "Email", value: "email" },
      { text: "SĐT", value: "phone" },
      { text: "Giới tính", value: "sex" },
      { text: "Ngày sinh", value: "birthday" },
      { text: "Hành động", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      email: "",
      student_code: "",
      phone: "",
      gender: "",
      birthday: "",
    },
    defaultItem: {
      name: "",
      email: "",
      student_code: "",
      phone: "",
      gender: "",
      birthday: "",
    },
    error: "",
    gender: [
      { value: "male", name: "Nam" },
      { value: "female", name: "Nữ" },
    ],
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
      this.CallAPI("get", "readers", {}, (response) => {
        console.log(response.data);
        for (let item of response.data) {
          this.desserts.push({
            id: item.id,
            name: item.name,
            email: item.email,
            student_code: item.student_code,
            phone: item.phone,
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
        "readers/" + this.desserts[this.editedIndex].id,
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
        email: this.editedItem.email,
        student_code: this.editedItem.student_code,
        phone: this.editedItem.phone,
        gender: this.editedItem.gender,
        birthday: this.formatDate2(this.editedItem.birthday),
      };
      if (
        !this.editedItem.name ||
        !this.editedItem.email ||
        !this.editedItem.phone ||
        !this.editedItem.student_code ||
        !this.editedItem.phone ||
        !this.editedItem.birthday
      ) {
        this.error = "Vui lòng nhập đủ thông tin";
        return;
      }
      if (!this.validEmail(this.editedItem.email)) {
        this.error = "Email không đúng định dạng";
        return;
      }
      if (!this.validPhone(this.editedItem.phone)) {
        this.error = "Số điện thoại không đúng";
        return;
      }
      if (!this.validDate(this.editedItem.birthday)) {
        this.error = "Ngày sinh không đúng định dạng";
        return;
      }
      if (this.editedIndex > -1) {
        this.CallAPI(
          "put",
          "readers/" + this.desserts[this.editedIndex].id,
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
          "readers",
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
