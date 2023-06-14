import {initAdminList} from '@/api'
const state = {
    adminList:[],
}

const actions = {
    // initAdminList({commit}){
    //     initAdminList().then(res=>{
    //         console.log(res);
    //         if(res.status == 200)
    //             commit('INITBOOKSLIST',res.data)
    //     },err=>console.log(err.message))
    // }
    AdminList({commit}){
        console.log(111);
        initAdminList().then(res=>{
            console.log(res);
            if(res.status == 200)
                commit('INITADMINSLIST',res.data)
        },err=>console.log(err.message))
    }
}

const mutations = {
  
    // INITADMINSLIST(state,data){
    //     data = data || []
    //     state.adminList = data.filter(item=>{
    //         return item.status == 1
    //     })
    // }
    // INITADMINLIST(state,data){
    //
    // }
    INITADMINSLIST(state,data){
        console.log(0);
        state.adminList = data
    },
}

const getters = {

}

export default {
    state,
    actions,
    mutations,
    getters
}