import api from "../../api"

// Attempts to refresh the access token if a refresh token in in local storage
export default async function refreshToken(): Promise<void> {
  const refresh = localStorage.getItem("refresh")
  if (refresh)
    api
      .post("/users/token/refresh/")
      .then((res) => {
        const newAccess = res.data.access
        localStorage.setItem("access", newAccess)
      })
      .catch((_err) => {})
}
