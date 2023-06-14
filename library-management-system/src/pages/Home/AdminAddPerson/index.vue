<template>
  <el-form ref="form" label-width="100%" label-position="top" size="small">
    <el-form-item label="用户名" label-width="80px">
      <el-col :span="16">
        <el-input  v-model="username"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="电话号码" label-width="80px">
      <el-col :span="16">
        <el-input v-model="phone"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="邮箱" label-width="80px">
      <el-col :span="16">
        <el-input v-model="email"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item  label="密码" label-width="80px">
      <el-col :span="16">
        <el-input v-model="password"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item >
      <el-col :span="2" >
        <el-button type="primary" @click="sendRegisterMsg">立即添加</el-button>
      </el-col>
    </el-form-item>

  </el-form>
</template>

<script>
import {mapState} from "vuex";
import {addPerson, register} from '@/api'
import qs from 'qs'

export default {
  name: 'AdminAddPerson',

  data() {
    return {
      username: '',
      email: '',
      phone: '',
      password: ''
    }
  },
  computed: {
    ...mapState({
      booksList(state) {
        return state.Books.booksList;
      }

    })
  },
  methods: {
    querySearch(queryString, cb) {
      cb(this.booksList);
    },
    //
    handleSelect(item) {
      // console.log(item);
      this.position = item.position
    },
    sendRegisterMsg() {
      let {username, email, phone, password}=this
      let data = {username, email, phone, password}
      if (!username) {
        this.$message({
          showClose: true,
          message: '用户名不能为空！',
          type: 'error',
        });
        return;
      } else if (!phone) {
        this.$message({
          showClose: true,
          message: '手机号不能为空！',
          type: 'error',
        });
        return;
      } else if (!email) {
        this.$message({
          showClose: true,
          message: '邮箱不能为空！',
          type: 'error',
        });
        return;
      } else if (!password) {
        this.$message({
          showClose: true,
          message: '密码不能为空！',
          type: 'error',
        });
        return;
      }

      addPerson(qs.stringify(data)).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.registerloading = false
          this.$message({
            showClose: true,
            message: '添加用户成功！',
            type: 'success',
          });
          this.username = ''
          this.phone = ''
          this.password = ''
        } else {
          this.registerloading = false
          this.username = ''
          this.phone = ''
          this.password = ''
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
      }, err => {
        console.log(err.message);
        this.registerloading = false
        this.$message({
          showClose: true,
          message: '添加用户失败！',
          type: 'error',
        });
        this.username = ''
        this.phone = ''
        this.password = ''
      })
    },
  }

};
</script>

<style lang="less" scoped>
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }

    .highlighted .addr {
      color: #ddd;
    }
  }
}
</style>