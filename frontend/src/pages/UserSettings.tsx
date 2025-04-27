import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/authContext"
import allContacts from "../lib/api/allContacts"
import getContactById from "../lib/api/getContactById"
import getTimezonePositioned from "../lib/api/getTimezonePositioned"

export default function UserSettings() {
  const authData = useContext(AuthContext)
  const [contactsData, setContactsData] = useState("{}")

  useEffect(() => {
    const load = async () => {
      const contactData = await allContacts()
      console.log(contactData)
      setContactsData(JSON.stringify(contactData))
      console.log("Set contacts data")

      console.log(await getContactById("5"))
      console.log(await getTimezonePositioned(52.52, 13.405))
    }
    load()
  })

  return (
    <main id="user-settings">
      <h1>User Settings</h1>
      <div className="container">
        <p>Is authenticated: {authData.isAuthenticated ? "Yes" : "No"}</p>
      </div>
      <div className="container">
        <h2>User Data</h2>
        <code>{JSON.stringify(authData.user)}</code>
      </div>
      <div className="container">
        <h2>User Contacts</h2>
        <code>{contactsData}</code>
      </div>
    </main>
  )
}
