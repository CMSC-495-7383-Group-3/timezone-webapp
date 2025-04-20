import { LoginFormData, User } from "../../types"
import convertUserObject from "../convertUserObject"
import api from "../../api"

type loginSuccessResponse = {
  success: true
  data: User
  error: undefined
}

type loginErrorResponse = {
  success: false
  data: undefined
  error: string
}

type loginResponse = loginSuccessResponse | loginErrorResponse

// Logs in a user and sets the tokens in local storage on success
export default async function login(
  data: LoginFormData
): Promise<loginResponse> {
  return api
    .post("/users/login/", data)
    .then((res): loginResponse => {
      localStorage.setItem("refresh", res.data.refresh)
      localStorage.setItem("access", res.data.access)

      return {
        success: true,
        data: convertUserObject(res.data.user),
        error: undefined,
      }
    })
    .catch((err): loginResponse => {
      console.error(err)
      return {
        success: false,
        data: undefined,
        error: err.response?.data.error
          ? err.response.data.error
          : "Login Failure",
      }
    })
}
