import Test from "./pages/Test"
import Nav from "./components/Nav"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
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

function App() {
  const setAuthenticated = (user: User | null) => {
    console.log("Updating authentication context")
    if (user)
      setAuthDataSource({
        isAuthenticated: true,
        user: user,
        setAuthenticated: setAuthenticated,
      })
    else
      setAuthDataSource({
        isAuthenticated: false,
        user: null,
        setAuthenticated: setAuthenticated,
      })
  }

  const [authDataSource, setAuthDataSource] = useState<AuthData>({
    isAuthenticated: false,
    user: null,
    setAuthenticated: setAuthenticated,
  })

  const initialMount = useRef(false)
  const onInitialMount = async () => {
    const user = await getUserSelf()
    if (user) authDataSource.setAuthenticated(user)
  }
  useEffect(() => {
    if (!initialMount.current) {
      onInitialMount()

      initialMount.current = true
    }
  }, [])

  return (
    <AuthContext value={authDataSource}>
      <ContactEditorModal>
        {/* TODO: Fill in any header that we will need here */}
        <Nav />
        {/* All routes will be declared here */}
        <Routes>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="logout" element={<Logout />} />
          <Route path="timezone/:zone" element={<Timezone />} />
          <Route path="userSettings" element={<UserSettings />} />
          <Route path="favorites" element={<Favorites />} />
          {/* TODO: Remove the test page once the project is further developed */}
          <Route path="test" element={<Test />} />
        </Routes>
        {/* TODO: Fill in any footer information here */}
      </ContactEditorModal>
    </AuthContext>
  )
}

export default App
