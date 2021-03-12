<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      color="success"
      dark
      icon="mdi-bookshelf"
      title="Lớp học"
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
                          label="Tên lớp"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="teacherList"
                          v-model="editedItem.teacher_id"
                          label="Giáo viên"
                          item-text="name"
                          item-value="id"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.member"
                          label="Số lượng học sinh"
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
        text: "Tên lớp",
        align: "start",
        sortable: false,
        value: "name",
      },
      { text: "Giáo viên", value: "teacher.name" },
      { text: "Số lượng học sinh", value: "member" },
      { text: "Hành động", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      teacher_id: "",
      member: "",
    },
    defaultItem: {
      name: "",
      teacher_id: "",
      member: "",
    },
    show: false,
    error: "",
    teacherList: [],
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
    this.getList();
    this.CallAPI("get", "teachers", {}, (response) => {
      this.teacherList = response.data;
    });
  },

  methods: {
    getList() {
      this.desserts = [];
      this.CallAPI("get", "classrooms", {}, (response) => {
        this.desserts = response.data;
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
        "classrooms/" + this.desserts[this.editedIndex].id,
        {},
        (response) => {
          this.$toast.success("Xóa thành công");
          this.getList();
        },
        (error) => {
          this.$toast.error("Lỗi: " + error.response.data);
          console.log(error.response.data);
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
      if (
        !this.editedItem.name ||
        !this.editedItem.member ||
        !this.editedItem.teacher_id
      ) {
        this.error = "Vui lòng nhập đủ thông tin";
        return;
      }
      if (this.editedIndex > -1) {
        this.CallAPI(
          "put",
          "classrooms/" + this.desserts[this.editedIndex].id,
          this.editedItem,
          (response) => {
            this.$toast.success("Sửa thành công");
            this.getList();
            this.close();
          },
          (error) => {
            this.error = "Mã lĩnh vực đã tồn tại";
          }
        );
      } else {
        this.CallAPI(
          "post",
          "classrooms",
          this.editedItem,
          (response) => {
            this.$toast.success("Thêm thành công");
            this.getList();
            this.close();
          },
          (error) => {
            this.error = "Mã lĩnh vực đã tồn tại";
          }
        );
      }
    },
  },
};
</script>
