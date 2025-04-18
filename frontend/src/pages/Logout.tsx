import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/authContext"
import { useNavigate } from "react-router-dom"
import logout from "../lib/api/logout"

export default function Logout() {
  const authContext = useContext(AuthContext)
  const navigate = useNavigate()

  // Navigate to login is not already logged in
  useState(() => {
    if (!authContext.isAuthenticated) navigate("/login")
  })

  const onLogout = async () => {
    const success = await logout()

    if (!success) alert("Logout Failure. Clear site data and try again.")

    authContext.setAuthenticated(null)
    navigate("/")
  }

  useEffect(() => {
    onLogout()
  }, [])

  // TODO remove debug logout
  return (
    <main id="logout">
      <p>Logging out...</p>
      <button onClick={onLogout}>Debug Logout</button>
    </main>
  )
}
