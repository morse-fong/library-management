<template>
  <el-form ref="form" label-width="100%" label-position="top" size="large">
    <el-form-item label="用户名" >
      <el-col :span="12">
<!--        <el-input ></el-input>-->
        <el-input
            type="text"
            v-model="id"
            validate-event
        >
        </el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="密码">
      <el-col :span="12">
        <el-input v-model="password"  minlength="1"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-col :span="6">
        <el-button type="primary" @click="addAdmin">立即添加</el-button>
      </el-col>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapState} from "vuex";
import {addAdmins} from '@/api'
import qs from 'qs'

export default {
  name: 'AdminAddPerson',

  data() {
    return {
      id: '',
      password: '',
    }
  },
  computed: {
    ...mapState({
      adminList(state) {
        return state.Admin.adminList;
      }
    })
  },
  methods: {
    querySearch(queryString, cb) {
      cb(this.adminList);
    },
    handleSelect(item) {
      // console.log(item);
      this.position = item.position
    },
    addAdmin() {
      let {id, password} = this
      let infoObj = {id, password}
      addAdmins(qs.stringify(infoObj)).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'success',
          });
          this.id = ''
          this.password = ''
          this.$store.dispatch('initReaderList')
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'error',
          });
        }
      }, err => {
        console.log(err.message);
      })
    }
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