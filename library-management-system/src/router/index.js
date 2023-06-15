import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import LoginRegister from '@/pages/LoginRegister'
import Home from '@/pages/Home'
import Introduce from '@/pages/Home/Introduce'
import SearchBooks from '@/pages/Home/SearchBooks'
import AdminBorrows from '@/pages/Home/AdminBorrows'
import AdminPerson from '@/pages/Home/AdminPerson'
import AdminAddBooks from '@/pages/Home/AdminAddBooks'
import ReaderBorrows from '@/pages/Home/ReaderBorrows'
import AdminAddPerson from "@/pages/Home/AdminAddPerson";
import AdminAddAdmin from "@/pages/Home/AdminAddAdmin";
import AdminManageAdmin from "@/pages/Home/AdminManageAdmin";

export default new VueRouter({
  routes: [
    {
      path: '*',
      redirect: '/LoginRegister'
    },
    {
      path: '/LoginRegister',
      component: LoginRegister
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '/',
          component: Introduce
        },
        {
          // 主页介绍
          path: 'introduce',
          component: Introduce
        },
        {
          // 书籍查询
          path: 'search',
          component: SearchBooks
        },
        // 管理员
        {
          // 人员管理
          path: 'person',
          component: AdminPerson
        },
        {
          // 人员管理
          path: 'adminmanageadmin',
          component: AdminManageAdmin
        },
        {
          // 管理员管理借阅记录
          path: 'adminborrows',
          component: AdminBorrows
        },
        {
          // 管理员添加图书
          path: 'adminaddbooks',
          component: AdminAddBooks
        },
        {
          // 管理员添加用户
          path: 'adminaddperson',
          component: AdminAddPerson
        },
        {
          // 管理员添加管理员
          path: 'adminaddadmin',
          component: AdminAddAdmin
        },
        // 读者
        {
          // 读者借阅记录
          path: 'readerborrows',
          component: ReaderBorrows
        },
        // {
        //   // 编辑人员
        //   path: 'editpersonreaderId', // 添加动态参数 ':readerId'
        //   component: EditPerson
        // }
      ]
    }
  ]
})
