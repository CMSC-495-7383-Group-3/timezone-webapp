import api from "../../api"

// Logs out a user and clears the tokens in local storage
export default async function logout(): Promise<boolean> {
  return api
    .post("/users/logout/")
    .then((_res) => {
      localStorage.removeItem("access")
      localStorage.removeItem("refresh")
      return true
    })
    .catch((_err) => {
      localStorage.removeItem("access")
      localStorage.removeItem("refresh")
      return false
    })
}
