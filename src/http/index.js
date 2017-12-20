import axios from 'axios'
import store from '../sotre/index'
import * as types from '../sotre/types'
import router from '../router/index'

// axios 配置
axios.defaults.timeout = 5000 // 5秒超时
axios.defaults.baseURL = "http://wxtest.qurenjia.com/api"
// http request 拦截器
// api 认证

axios.interceptors.request.use(config => {
        var {auth} = store.state
        if (auth.token) {
            config.headers['X-Authorization'] = `token ${auth.token}`
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

// http response 连接器
axios.interceptors.response.use(response => {
        return response
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 401 授权状态并跳转到登录页面
                    // 要求该用户使用微信再次认证
                    store.commit(types.LOGOUT)
                    router.replace({
                        path: 'login',
                        query: { redirect: router.currentRoute.fullPath }
                    })
            }
        }
        return Promise.reject(error)
    }
)

export default axios
