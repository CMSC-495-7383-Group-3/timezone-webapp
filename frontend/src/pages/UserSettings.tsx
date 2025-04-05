import { useContext } from "react"
import { AuthContext } from "../context/authContext"

export default function UserSettings() {
  const authData = useContext(AuthContext)

  return (
    <main id="user-settings">
      <h1>User Settings</h1>
      <p>Is authenticated: {authData.isAuthenticated ? "Yes" : "No"}</p>
    </main>
  )
}
