import { useContext, useEffect, useState } from "react"
import allContacts from "../lib/api/allContacts"
import useProtectedPage from "../hooks/useProtectedPage"
import { AuthContext } from "../context/authContext"
import { Contact } from "../types"
import "./userSettings.scss"

export default function UserSettings() {
  // Reroute to login if not authenticated
  useProtectedPage()

  const authData = useContext(AuthContext)

  const [contactsData, setContactsData] = useState<Contact[]>([])

  useEffect(() => {
    const load = async () => {
      const contactData = await allContacts()
      setContactsData(contactData)
    }
    load()
  }, [])

  if (!authData.user) return <main id="user-settings">No Data</main>

  return (
    <main id="user-settings">
      <h1>User</h1>
      <div className="container primary">
        <h2>User Data</h2>
        <table>
          <tbody>
            <tr>
              <td>Email</td>
              <td>{authData.user.email}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{authData.user.username}</td>
            </tr>
            <tr>
              <td>Name</td>
              <td>{authData.user.firstName}</td>
            </tr>
            <tr>
              <td>Registration Date</td>
              <td>{authData.user.registrationDate.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Registration Timezone</td>
              <td>{authData.user.timezone}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="container">
        <h2>User Contacts</h2>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Timezone</td>
              <td>Phone Number</td>
            </tr>
          </thead>
          <tbody>
            {contactsData.map((contact) => (
              <tr key={`user-settings-contact-${contact.id}`}>
                <td>{contact.name}</td>
                <td>{contact.timezone}</td>
                <td>{contact.phoneNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
