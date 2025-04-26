import { useContext, useEffect } from "react"
import { AuthContext } from "../context/authContext"
import { useNavigate } from "react-router-dom"

// Reroute to login if not authenticated
export default function useProtectedPage() {
  const authData = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authData.isAuthenticated) navigate("/login?please_login", {})
  }, [])
}
