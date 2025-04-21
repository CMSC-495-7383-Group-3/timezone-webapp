import api from "../../api"
import { User } from "../../types"
import convertUserObject from "../convertUserObject"

export default async function updateUserSelf(
  data: User
): Promise<User | undefined> {
  return api
    .put("/users/profile", data)
    .then((res) => {
      return convertUserObject(res.data)
    })
    .catch((_err) => {
      return undefined
    })
}
