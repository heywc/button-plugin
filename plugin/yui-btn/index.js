import YuiBtn from './btn.vue'

const myPlugin = {    
    install(Vue) {
        Vue.component('YuiBtn', YuiBtn) 
    }
}

export default myPlugin