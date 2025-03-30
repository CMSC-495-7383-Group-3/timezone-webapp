import Test from "./pages/Test"
import Nav from "./components/Nav"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import LoginRegister from "./pages/LoginRegister"
import Timezone from "./pages/Timezone"
import UserSettings from "./pages/UserSettings"

function App() {
  // TODO fill in any global app information that we may need here. Potentially use contexts or an additional library.

  return (
    <>
      {/* TODO: Fill in any header that we will need here */}
      <Nav />
      {/* All routes will be declared here */}
      <Routes>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="login" element={<LoginRegister />} />
        <Route path="register" element={<LoginRegister />} />
        <Route path="timezone/:zone" element={<Timezone />} />
        <Route path="userSettings" element={<UserSettings />} />
        {/* TODO: Remove the test page once the project is further developed */}
        <Route path="test" element={<Test />} />
      </Routes>
      {/* TODO: Fill in any footer information here */}
    </>
  )
}

export default App
