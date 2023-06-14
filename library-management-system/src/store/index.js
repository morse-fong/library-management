import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import Books from './Books'
import User from './User'
import Admin from './Admin'
import Borrows from './Borrows'

Vue.use(Vuex)


export default new Vuex.Store({
    modules: {
        Books,
        User,
        Admin,
        Borrows
    },
    plugins: [
        createPersistedState({
            storage: window.sessionStorage,
            paths: ["Books", "User", "Admin", "Borrows", "Reserve"]
        })
    ]
})