import axios from 'axios'
import { Form, FormResponse, ApiResponse } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    // Only log non-GET requests to reduce noise
    if (config.method?.toUpperCase() !== 'GET') {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Only log errors for non-404 responses to reduce noise
    if (error.response?.status !== 404) {
      console.error('❌ API Error:', error.response?.data || error.message)
    }
    return Promise.reject(error)
  }
)

// Form API functions
export const formApi = {
  // Create a new form
  create: async (formData: Partial<Form>): Promise<ApiResponse<Form>> => {
    const response = await api.post('/forms', formData)
    return response.data
  },

  // Get a form by ID
  getById: async (id: string): Promise<ApiResponse<Form>> => {
    const response = await api.get(`/forms/${id}`)
    return response.data
  },

  // Update a form
  update: async (id: string, formData: Partial<Form>): Promise<ApiResponse<Form>> => {
    const response = await api.put(`/forms/${id}`, formData)
    return response.data
  },

  // Get all forms (for dashboard)
  getAll: async (): Promise<ApiResponse<Form[]>> => {
    const response = await api.get('/forms')
    return response.data
  },
}

// Response API functions
export const responseApi = {
  // Submit a form response
  submit: async (formId: string, answers: any[]): Promise<ApiResponse<FormResponse>> => {
    const response = await api.post('/responses', { formId, answers })
    return response.data
  },

  // Get all responses for a form
  getByFormId: async (formId: string): Promise<ApiResponse<FormResponse[]>> => {
    const response = await api.get(`/responses/${formId}`)
    return response.data
  },
}

// Upload API functions
export const uploadApi = {
  // Upload image
  uploadImage: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

// Health check
export const healthCheck = async (): Promise<ApiResponse<any>> => {
  const response = await api.get('/health')
  return response.data
}

export default api 