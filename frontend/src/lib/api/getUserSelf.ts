import api from "../../api"
import { User } from "../../types"
import convertUserObject from "../convertUserObject"

// Attempts to revile the user's own profile information when they are logged in
export default async function getUserSelf(): Promise<User | undefined> {
  return api
    .get("/users/profile")
    .then((res) => {
      return convertUserObject(res.data)
    })
    .catch((_err) => {
      return undefined
    })
}
