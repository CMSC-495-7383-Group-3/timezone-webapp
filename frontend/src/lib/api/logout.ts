import api from "../../api"

export default function logout(): Promise<boolean> {
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
