import { createContext } from "react"
import { User } from "../types"

type Authenticated = {
  isAuthenticated: true
  user: User
}

type Unauthenticated = {
  isAuthenticated: false
  user?: null
}

export type AuthData = Authenticated | Unauthenticated

export const AuthContext = createContext<AuthData>({
  isAuthenticated: false,
  user: null,
})
