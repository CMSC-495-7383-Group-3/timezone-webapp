import { createContext } from "react"
import { User } from "../types"

type Authenticated = {
  isAuthenticated: true
  user: User
  setAuthenticated: (user: User | null) => void
}

type Unauthenticated = {
  isAuthenticated: false
  user: null
  setAuthenticated: (user: User | null) => void
}

export type AuthData = Authenticated | Unauthenticated

export const AuthContext = createContext<AuthData>({
  isAuthenticated: false,
  user: null,
  setAuthenticated: (_user: User | null) => {
    console.warn("Default setAuthenticated")
  },
})
