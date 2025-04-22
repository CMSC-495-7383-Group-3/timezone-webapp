import axios from "axios"

const API_BASE_PATH = "/api/v1"

const IGNORE_REFRESH = ["/users/login/", "/users/register/", "/users/logout/"]

var lastRefresh = new Date()

const api = axios.create({
  baseURL: API_BASE_PATH,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const now = new Date()
  const seconds = (now.getTime() - lastRefresh.getTime()) / 1000
  console.log("Last Refresh: ", seconds)

  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !IGNORE_REFRESH.includes(originalRequest.url)
    ) {
      originalRequest._retry = true

      try {
        const refresh = localStorage.getItem("refresh")
        const response = await axios.post(
          API_BASE_PATH + "/users/token/refresh/",
          { refresh }
        )

        const newAccess = response.data.access
        localStorage.setItem("access", newAccess)

        api.defaults.headers.Authorization = `Bearer ${newAccess}`
        originalRequest.headers.Authorization = `Bearer ${newAccess}`

        return api(originalRequest)
      } catch (err) {
        localStorage.removeItem("access")
        localStorage.removeItem("refresh")
        console.error("Failed to refresh access token!")
        return Promise.reject(err)
      }

      lastRefresh = new Date()
    }

    return Promise.reject(error)
  }
)

export default api
