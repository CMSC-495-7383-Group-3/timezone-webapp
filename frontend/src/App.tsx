import Test from "./pages/Test"
import Nav from "./components/Nav"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Timezone from "./pages/Timezone"
import UserSettings from "./pages/UserSettings"
import { AuthContext, AuthData } from "./context/authContext"
import { useEffect, useRef, useState } from "react"
import ContactEditorModal from "./components/ContactEditorModal"
import Favorites from "./pages/Favorites"
import Login from "./pages/Login"
import Register from "./pages/Register"
import { User } from "./types"
import Logout from "./pages/Logout"
import getUserSelf from "./lib/api/getUserSelf"
import refreshToken from "./lib/api/refreshToken"

// Root App component
function App() {
  // Updates the authenticated state. Null means that the user is logged out
  const setAuthenticated = (user: User | null) => {
    console.log("Updating authentication context")
    if (user)
      setAuthDataSource({
        isAuthenticated: true,
        user: user,
        setAuthenticated: setAuthenticated,
        isLoading: false,
      })
    else
      setAuthDataSource({
        isAuthenticated: false,
        user: null,
        setAuthenticated: setAuthenticated,
        isLoading: false,
      })
  }

  const [authDataSource, setAuthDataSource] = useState<AuthData>({
    isAuthenticated: false,
    user: null,
    setAuthenticated: setAuthenticated,
    isLoading: true,
  })

  // ONCE on the initial mount, attempt to get the current user's information
  const initialMount = useRef(false)
  const onInitialMount = async () => {
    const user = await getUserSelf()
    if (user) authDataSource.setAuthenticated(user)
    else authDataSource.setAuthenticated(null)
  }
  useEffect(() => {
    if (!initialMount.current) {
      onInitialMount()

      initialMount.current = true
    }
  }, [])

  // Re-fresh the token automatically every 10 minutes to avoid authentication errors
  // This is a complementary system to the one in api.ts
  const isRunningTokenRefresh = useRef(false)
  useEffect(() => {
    var intervalID: NodeJS.Timeout | null = null
    if (!isRunningTokenRefresh.current) {
      intervalID = setInterval(() => {
        console.log("Attempting access token...")
        if (authDataSource.isAuthenticated) refreshToken()
      }, 600000)

      isRunningTokenRefresh.current = true
    }

    return () => {
      if (intervalID) clearInterval(intervalID)
    }
  }, [])

  return (
    <AuthContext value={authDataSource}>
      <ContactEditorModal>
        <Nav />
        {/* All routes will be declared here */}
        <Routes>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Favorites />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="logout" element={<Logout />} />
          <Route path="timezone/:zone" element={<Timezone />} />
          <Route path="userSettings" element={<UserSettings />} />
          {/* Only show the test route in development */}
          {!process.env.NODE_ENV || process.env.NODE_ENV === "development" ? (
            <Route path="test" element={<Test />} />
          ) : (
            <></>
          )}
        </Routes>
      </ContactEditorModal>
    </AuthContext>
  )
}

export default App
