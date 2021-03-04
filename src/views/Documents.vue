<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      color="success"
      dark
      icon="mdi-bookmark-plus"
      title="Tài liệu"
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
                        <v-text-field v-model="editedItem.name" label="Tên" />
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="authorList"
                          v-model="editedItem.author"
                          label="Tác giả"
                          item-text="name"
                          item-value="id"
                          return-object
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="publisherList"
                          v-model="editedItem.publisher"
                          label="Nhà xuất bản"
                          item-text="name"
                          item-value="id"
                          return-object
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="languageList"
                          v-model="editedItem.language"
                          label="Ngôn ngữ"
                          item-text="name"
                          item-value="id"
                          return-object
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="fieldList"
                          v-model="editedItem.field"
                          label="Lĩnh vực"
                          item-text="name"
                          item-value="id"
                          return-object
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.price" label="Giá" />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.amount"
                          label="Số lượng"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.page_number"
                          label="Số trang"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.category"
                          label="Thể loại"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="editedItem.publishing_year"
                          label="Ngày xuất bản"
                        />
                      </v-col>
                      <!-- <v-col cols="12">
                        <v-select
                          :items="statusList"
                          v-model="editedItem.status"
                          label="Trạng thái"
                          item-text="name"
                          item-value="code"
                        ></v-select>
                      </v-col> -->
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
        text: "Tên",
        align: "start",
        sortable: false,
        value: "name",
      },
      // { text: "Mã", value: "id" },
      { text: "Tác giả", value: "author.name" },
      { text: "Ngôn ngữ", value: "language.name" },
      { text: "NXB", value: "publisher.name" },
      { text: "Lĩnh vực", value: "field.name" },
      { text: "Giá", value: "price" },
      { text: "Số lượng", value: "amount" },
      { text: "Số trang", value: "page_number" },
      { text: "Thể loại", value: "category" },
      { text: "Phát hành", value: "publishing_year" },
      { text: "Hành động", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: "",
      author: "",
      language: "",
      publisher: "",
      field: "",
      publishing_year: "",
      price: "",
      page_number: "",
      category: "",
      amount: "",
    },
    defaultItem: {
      name: "",
      author: "",
      language: "",
      publisher: "",
      field: "",
      publishing_year: "",
      price: "",
      page_number: "",
      category: "",
      amount: "",
    },
    error: "",
    authorList: [],
    languageList: [],
    fieldList: [],
    publisherList: [],
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
    this.CallAPI("get", "authors", {}, (response) => {
      this.authorList = response.data;
    });
    this.CallAPI("get", "fields", {}, (response) => {
      this.fieldList = response.data;
    });
    this.CallAPI("get", "publishers", {}, (response) => {
      this.publisherList = response.data;
    });
    this.CallAPI("get", "languages", {}, (response) => {
      this.languageList = response.data;
    });
  },

  methods: {
    getList() {
      this.desserts = [];
      this.CallAPI("get", "documents", {}, (response) => {
        this.desserts = response.data
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
        "documents/" + this.desserts[this.editedIndex].id,
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
        name: this.editedItem.name,
        author_id: this.editedItem.author.id,
        language_id: this.editedItem.language.id,
        publisher_id: this.editedItem.publisher.id,
        field_id: this.editedItem.field.id,
        publishing_year: this.formatDate2(this.editedItem.publishing_year),
        price: Number(this.editedItem.price),
        page_number: Number(this.editedItem.page_number),
        category: this.editedItem.category,
        amount: this.editedItem.amount,
      };
      if (!this.editedItem.name) {
        this.error = "Vui lòng nhập đủ thông tin";
        return;
      }
      if (this.editedIndex > -1) {
        this.CallAPI(
          "put",
          "documents/" + this.desserts[this.editedIndex].id,
          data,
          (response) => {
            this.$toast.success("Sửa thành công");
            this.getList();
            this.close();
          },
          (error) => {
            this.error = "Lỗi: " + error.response.data;
          }
        );
      } else {
        this.CallAPI(
          "post",
          "documents",
          data,
          (response) => {
            this.$toast.success("Thêm thành công");
            this.getList();
            this.close();
          },
          (error) => {
            this.error = "Lỗi: " + error.response.data;
          }
        );
      }
    },
  },
};
</script>
