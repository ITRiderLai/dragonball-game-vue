import axios from 'axios'
import utils from './utils'

const instance = axios.create({
    baseURL: process.env.VUE_APP_API,
    timeout: 10000
})

instance.interceptors.request.use(function (config) {
    const token = utils.getCookie('token') || ''
    config.headers.token = token
    return config
})

export default instance
