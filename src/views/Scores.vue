<template>
  <v-container id="regular-tables" fluid tag="section">
    <base-material-card
      color="success"
      dark
      icon="mdi-bookmark-plus"
      title="Kết quả học tập"
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
                          :items="studentList"
                          v-model="editedItem.student_id"
                          label="Học sinh"
                          item-text="name"
                          item-value="id"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="subjectList"
                          v-model="editedItem.subject_id"
                          label="Môn học"
                          item-text="name"
                          item-value="id"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="scoreList"
                          v-model="editedItem.type_score"
                          label="Loại điểm"
                          item-text="name"
                          item-value="id"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="teacherList"
                          v-model="editedItem.teacher_id"
                          label="Giáo viên"
                          item-text="name"
                          item-value="id"
                        ></v-select> </v-col
                      ><v-col cols="12">
                        <v-select
                          :items="classList"
                          v-model="editedItem.class_id"
                          label="Lớp học"
                          item-text="name"
                          item-value="id"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-select
                          :items="gradeList"
                          v-model="editedItem.grade_level"
                          label="Khối"
                          item-text="name"
                          item-value="id"
                        ></v-select>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field v-model="editedItem.score" label="Điểm" />
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
        text: "Học sinh",
        align: "start",
        sortable: false,
        value: "student.name",
      },
      { text: "Lớp", value: "classroom.name" },
      { text: "Giáo viên", value: "teacher.name" },
      { text: "Môn học", value: "subject.name" },
      { text: "Loại điểm", value: "typescore.name" },
      { text: "Khối", value: "gradelevel.name" },
      { text: "Điểm", value: "score" },
      { text: "Hành động", value: "actions", sortable: false },
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      student_id: "",
      teacher_id: "",
      subject_id: "",
      type_score: "",
      class_id: "",
      grade_level: "",
      score: "",
    },
    defaultItem: {
      student_id: "",
      teacher_id: "",
      subject_id: "",
      type_score: "",
      class_id: "",
      grade_level: "",
      score: "",
    },
    error: "",
    teacherList: [],
    studentList: [],
    subjectList: [],
    scoreList: [],
    classList: [],
    gradeList: [],
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
    this.CallAPI("get", "students", {}, (response) => {
      this.studentList = response.data;
    });
    this.CallAPI("get", "subjects", {}, (response) => {
      this.subjectList = response.data;
    });
    this.CallAPI("get", "type-mark", {}, (response) => {
      this.scoreList = response.data;
    });
    this.CallAPI("get", "classrooms", {}, (response) => {
      this.classList = response.data;
    });
    this.CallAPI("get", "grade-level", {}, (response) => {
      this.gradeList = response.data;
    });
  },

  methods: {
    getList() {
      this.desserts = [];
      this.CallAPI("get", "scores", {}, (response) => {
        this.desserts = response.data;
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
        "scores/" + this.desserts[this.editedIndex].id,
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
      if (
        !this.editedItem.student_id ||
        !this.editedItem.teacher_id ||
        !this.editedItem.subject_id ||
        !this.editedItem.type_score ||
        !this.editedItem.class_id ||
        !this.editedItem.grade_level ||
        !this.editedItem.score
      ) {
        this.error = "Vui lòng nhập đủ thông tin";
        return;
      }
      if (this.editedItem.score < 0 || this.editedItem.score > 10) {
        this.error = "Điểm không hợp lệ";
        return;
      }
      if (this.editedIndex > -1) {
        this.CallAPI(
          "put",
          "scores/" + this.desserts[this.editedIndex].id,
          this.editedItem,
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
          "scores",
          this.editedItem,
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
