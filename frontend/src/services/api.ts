import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api"

console.log("API Configuration:", {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  API_BASE_URL,
  mode: import.meta.env.MODE
})

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30 seconds for Vercel cold starts
})

// Add token to requests
api.interceptors.request.use((config) => {
  console.log("Making API request:", {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`
  })
  
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("API response success:", {
      url: response.config.url,
      status: response.status,
      data: response.data
    })
    return response
  },
  (error) => {
    console.error("API response error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (email: string, password: string) => api.post("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) => api.post("/auth/register", { name, email, password }),

  getProfile: () => api.get("/auth/profile"),
}

export const userAPI = {
  saveLocation: (location: { name: string; lat: number; lon: number; country?: string }) => 
    api.post("/user/locations", location),

  removeLocation: (locationId: string) => api.delete(`/user/locations/${locationId}`),

  getSavedLocations: () => api.get("/user/locations"),
}

export const weatherAPI = {
  getCurrentWeather: (lat: number, lon: number) => api.get(`/weather/current?lat=${lat}&lon=${lon}`),

  getForecast: (lat: number, lon: number) => api.get(`/weather/forecast?lat=${lat}&lon=${lon}`),

  searchLocation: (query: string) => api.get(`/weather/search?q=${query}`),
}

export default api
