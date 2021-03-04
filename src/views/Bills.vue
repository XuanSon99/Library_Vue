<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      color="success"
      dark
      icon="mdi-calendar-text"
      title="Phiếu mượn"
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
                        <v-select
                          :items="readerList"
                          v-model="editedItem.reader"
                          label="Sinh viên"
                          item-text="name"
                          item-value="student_code"
                          return-object
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="docList"
                          v-model="editedItem.document"
                          label="Tài liệu"
                          item-text="name"
                          item-value="id"
                          return-object
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.lender"
                          label="Người cho mượn"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.borrow_time"
                          label="Ngày mượn"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.return_time"
                          label="Ngày trả"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="statusList"
                          v-model="editedItem.status"
                          label="Trạng thái"
                          item-text="name"
                          item-value="code"
                        ></v-select>
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
        text: "Mã phiếu",
        align: "start",
        sortable: false,
        value: "id",
      },
      { text: "Tên sách", value: "document.name" },
      { text: "Sinh viên", value: "reader.name" },
      { text: "MSV", value: "reader.student_code" },
      { text: "Người cho", value: "lender" },
      { text: "Ngày mượn", value: "borrow_time" },
      { text: "Ngày trả", value: "return_time" },
      { text: "Trạng thái", value: "statusName" },
      { text: "Hành động", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      reader: "",
      document: "",
      lender: "",
      borrow_time: "",
      return_time: "",
      status: "",
    },
    defaultItem: {
      reader: "",
      document: "",
      lender: "",
      borrow_time: "",
      return_time: "",
      status: "",
    },
    error: "",
    statusList: [
      {
        name: "Đã trả",
        code: "ok",
      },
      {
        name: "Chưa trả",
        code: "not",
      },
    ],
    readerList: [],
    docList: [],
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
    this.CallAPI("get", "readers", {}, (response) => {
      this.readerList = response.data;
    });
    this.CallAPI("get", "documents", {}, (response) => {
      this.docList = response.data;
    });
  },

  methods: {
    getList() {
      this.desserts = [];
      this.CallAPI("get", "bills", {}, (response) => {
        for (let item of response.data) {
          this.desserts.push({
            id: item.id,
            reader: item.reader,
            document: item.document,
            lender: item.lender,
            borrow_time: this.formatDate(item.borrow_time),
            return_time: this.formatDate(item.return_time),
            status: item.status,
            statusName: item.status == "ok" ? "Đã trả" : "Chưa trả",
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
        "bills/" + this.desserts[this.editedIndex].id,
        {},
        (response) => {
          this.$toast.success("Xóa thành công");
          this.getList();
        },
        (error) => {
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
      let data = {
        student_id: this.editedItem.reader.student_code,
        document_id: this.editedItem.document.id,
        lender: this.editedItem.lender,
        borrow_time: this.formatDate2(this.editedItem.borrow_time),
        return_time: this.formatDate2(this.editedItem.return_time),
        status: this.editedItem.status,
      };
      if (
        !data.student_id ||
        !data.document_id ||
        !data.lender ||
        !data.borrow_time ||
        !data.return_time ||
        !data.status
      ) {
        this.error = "Vui lòng nhập đủ thông tin";
        return;
      }
      if (this.editedIndex > -1) {
        this.CallAPI(
          "put",
          "bills/" + this.desserts[this.editedIndex].id,
          data,
          (response) => {
            this.$toast.success("Sửa thành công");
            this.getList();
            this.close();
          },
          (error) => {
            console.log(error.response.data);
          }
        );
      } else {
        this.CallAPI(
          "post",
          "bills",
          data,
          (response) => {
            this.$toast.success("Thêm thành công");
            this.getList();
            this.close();
          },
          (error) => {
            this.error = "Mã tác giả đã tồn tại";
          }
        );
      }
    },
  },
};
</script>
