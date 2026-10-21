import axios from 'axios'
import { SERVER_HOST } from '../config/constants'

const api = axios.create({
    baseURL: SERVER_HOST,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export const apiRequest = async (method, url, data = null, config = {}) => {
    try {
        const response = await api({
            method,
            url,
            data,
            ...config
        })
        return { data: response.data, error: null }
    } catch (error) {
        console.error('API Request Error:', error)
        const errorMessage = error.response?.data?.errorMessage || 
                           error.response?.data?.message || 
                           error.message || 
                           'An unexpected error occurred'
        return { data: null, error: errorMessage }
    }
}

export const uploadFile = async (url, formData, onProgress = null) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        
        if (onProgress) {
            config.onUploadProgress = (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                )
                onProgress(percentCompleted)
            }
        }
        
        const response = await api.post(url, formData, config)
        return { data: response.data, error: null }
    } catch (error) {
        console.error('File Upload Error:', error)
        const errorMessage = error.response?.data?.errorMessage || 
                           error.response?.data?.message || 
                           error.message || 
                           'File upload failed'
        return { data: null, error: errorMessage }
    }
}

export default api
