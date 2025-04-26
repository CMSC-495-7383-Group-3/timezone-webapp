import axios from "axios"

// The base path prepended to all API calls. If the route is not local to the site, the domain needs to be included
const API_BASE_PATH = "/api/v1"

// These routes will be ignored for token refreshes
const IGNORE_REFRESH = ["/users/login/", "/users/register/", "/users/logout/"]

// Used for debugging. Last time the token was updated
var lastRefresh = new Date()

const api = axios.create({
  baseURL: API_BASE_PATH,
})

// Add the access token to all requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // In in development, calculate how long since the token was last updated
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    const now = new Date()
    const seconds = (now.getTime() - lastRefresh.getTime()) / 1000
    console.log("Last Refresh: ", seconds)
  }

  return config
})

// Intercept 401 errors to try and refresh the token
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    // Attempt a retry if the code is 401, the retry has not already happened, and the route is not on the no retry list
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

        console.log("Refreshed access token.")
        lastRefresh = new Date()
        return api(originalRequest)
      } catch (err) {
        console.log(err)
        // localStorage.removeItem("access")
        // localStorage.removeItem("refresh")
        console.error("Failed to refresh access token!")
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default api
