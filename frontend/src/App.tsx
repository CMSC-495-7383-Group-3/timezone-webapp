import Test from "./pages/Test"
import Nav from "./components/Nav"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"

function App() {
  // TODO fill in any global app information that we may need here. Potentially use contexts or an additional library.

  return (
    <>
      {/* TODO: Fill in any header that we will need here */}
      <Nav />
      {/* All routes will be declared here */}
      <Routes>
        <Route index element={<Home />} />
        <Route path="test" element={<Test />} />
      </Routes>
      {/* TODO: Fill in any footer information here */}
    </>
  )
}

export default App
