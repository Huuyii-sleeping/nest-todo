import router from "../router";
import axios, { type AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:3000',
    timeout: 3000,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data.code === 401) { // 未授权操作
            localStorage.removeItem('token')
            router.push('/login')
        }
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
)

export async function get(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await axiosInstance.get(url, { ...config, params: data })
    return response
}

export async function post(url: string, data?: any, config?: AxiosRequestConfig) {
    const response = await axiosInstance.post(url, data, config)
    return response
}
