<template>
  <div>
    <el-input
        v-model="searchKeyword"
        placeholder="输入关键字进行搜索"
        @keyup.enter.native="searchadmin"
        style="margin-bottom: 10px;"
        @blur="clear"
    >
    </el-input>

    <el-table
        :data="flag == 0 ? adminList : filteredAdminList"
        style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="密码">
              <span>{{ props.row.password }}</span>&nbsp;
              <el-button @click="changeAdminPassword(props.row)"
                         type="text" style="float: right" size="mini"
                         icon="el-icon-edit">修改
              </el-button>
            </el-form-item>

          </el-form>
        </template>
      </el-table-column>
      <!-- ...已有的表格列... -->
      <el-table-column prop="id" label="用户名" sortable width=220>
      </el-table-column>
      <el-table-column prop="password" sortable label="密码(已加密）" width=220>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <!--           删除按钮 -->
          <el-popconfirm
              title="确认删除该人员吗？"
              @confirm="delAdmin(scope.$index, scope.row)"
          >
            <el-button size="mini" style="margin-right: 5px" type="primary" plain slot="reference">
              删除人员
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import {changeAdminInfo, delAdmin, searchAdmin} from '@/api'
import qs from 'qs'
// import {editPerson} from '../EditPerson'
export default {
  name: 'AdminManageAdmin',
  computed: {
    ...mapState({
      adminList(state) {
        // console.log(state.Admin.adminList);
        return state.Admin.adminList;
      }

    })
  },
  data() {
    return {
      flag:0,
      searchKeyword: '',
      filteredAdminList: [],
      id: '',
      password: '',
    }
  },
  methods: {
    clear(){
      this.flag=0, this.filteredAdminList=[];
    },
    changeAdminPassword(row) {
      console.log(row);
      var id = row.id;
      var password = row.password;
      this.$prompt("请输入密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: row.password,
        inputValidator: value => {if (value=="")return false;return true;},
      })
          .then(({value}) => {
            this.$message({
              type: "success",
              message: "你修改的密码是: " + value,
            });
            // 修改的信息
            password = value;
            var infoObj = {id, password};
            changeAdminInfo(qs.stringify(infoObj)).then(
                (err) => {
                  console.log(err);
                },
                (res) => {
                  console.log(res);
                  console.log(22);
                  this.$store.dispatch("AdminList");

                },

            );
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "取消输入",
            });
          });
    },


    delAdmin(index, row) {
      console.log(index, row);
      let infoObj = {id: row.id}

      delAdmin(qs.stringify(infoObj)).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.$message({
            showClose: true,
            message: "删除人员成功！",
            type: "success",
          });
        }
        // 删除后，你可能想要刷新人员列表
        this.$store.dispatch('AdminList');
        // this.filteredAdminList = this.adminList;
      });
    },

    searchadmin(e) {
      this.loading = true;
      console.log(this.searchKeyword)
      searchAdmin(qs.stringify({data: this.searchKeyword})).then(
          (res) => {
            this.loading = false;
            e.target.blur();
            this.flag = 1;
            this.filteredAdminList = res.data;
            console.log(res);
            if (res.status == 0) {
              this.$message({
                showClose: true,
                message: "未找到相关用户！",
                type: "error",
              });
            }
          },
          (err) => {
            this.loading = false;
            console.log(err.message);
          }
      );
    },

  },
  mounted() {
    this.$store.dispatch('AdminList');
    this.filteredAdminList = this.adminList; // 初始化筛选后的数据为全部数据
  },
};

</script>

<style lang="less" scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>