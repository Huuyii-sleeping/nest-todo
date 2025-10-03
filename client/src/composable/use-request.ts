import router from "../router";
import axios, { type AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:3000',
    timeout: 3000,
})

axiosInstance.interceptors.request.use(
    (config) => {
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data.code === 401) {
            router.push('/login')
        }
        if (response.data.code === 200) {

        }
        return response
    },
    (error) => {
        return error
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
