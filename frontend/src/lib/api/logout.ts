import api from "../../api"

export default function logout(): Promise<boolean> {
  return api
    .post("/users/logout/")
    .then((res) => {
      localStorage.removeItem("access")
      localStorage.removeItem("refresh")
      console.log(res)
      return true
    })
    .catch((err) => {
      localStorage.removeItem("access")
      localStorage.removeItem("refresh")
      console.error(err)
      return false
    })
}
