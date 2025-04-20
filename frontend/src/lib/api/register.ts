import { RegisterFormData, User } from "../../types"
import convertUserObject from "../convertUserObject"
import convertErrors from "../convertErrors"
import api from "../../api"

type registerSuccessResponse = {
  success: true
  data: User
  errors: undefined
}

type registerErrorResponse = {
  success: false
  data: undefined
  errors: string[]
}

type registerResponse = registerSuccessResponse | registerErrorResponse

// Registers a user
export default async function register(
  data: RegisterFormData
): Promise<registerResponse> {
  return api
    .post("/users/register/", data)
    .then((res): registerResponse => {
      return {
        success: true,
        data: convertUserObject(res.data),
        errors: undefined,
      }
    })
    .catch((err): registerResponse => {
      return {
        success: false,
        data: undefined,
        errors: convertErrors(err.response.data),
      }
    })
}
