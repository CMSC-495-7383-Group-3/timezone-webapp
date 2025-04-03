import Test from "./pages/Test"
import Nav from "./components/Nav"
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import LoginRegister from "./pages/LoginRegister"
import Timezone from "./pages/Timezone"
import UserSettings from "./pages/UserSettings"
import { AuthContext, AuthData } from "./context/authContext"
import { useState } from "react"
import { Contact } from "./types"
import { ContactEditorContext } from "./context/contactEditorContext"
import ContactEditor from "./components/ContactEditor"

function App() {
  const [editedContact, setEditedContact] = useState<Contact | undefined>(
    undefined
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authDataSource, setauthDataSource] = useState<AuthData>({
    isAuthenticated: false,
    user: null,
  })

  const openContactEditor = (contact: Contact) => {
    setEditedContact(contact)
  }

  const onCloseContactEditor = () => {
    setEditedContact(undefined)
  }

  return (
    <AuthContext value={authDataSource}>
      <ContactEditorContext value={{ openEditor: openContactEditor }}>
        {editedContact != undefined ? (
          <div className="modal">
            <ContactEditor
              contact={editedContact}
              newContact={false}
              closeEditorCallback={onCloseContactEditor}
            />
          </div>
        ) : (
          <></>
        )}
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
      </ContactEditorContext>
    </AuthContext>
  )
}

export default App
