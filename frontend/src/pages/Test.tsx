import { useContext } from "react"
import TestComponent from "../components/TestComponent"
import { AuthContext } from "../context/authContext"

export default function Test() {
  const authContext = useContext(AuthContext)

  //! Debug function. Remove when external API is added
  const onSetLocalDebugData = () => {
    localStorage.clear()

    // Set example timezones
    localStorage.setItem(
      "favoriteTimezones",
      JSON.stringify(["Europe/Berlin", "America/Los_Angeles"])
    )

    // Set example contacts
    localStorage.setItem(
      "contacts",
      JSON.stringify([
        {
          id: "1",
          name: "Contact 1",
          timeZone: "Europe/Berlin",
          notes: "A Note",
        },
        {
          id: "2",
          name: "Contact 2",
          timeZone: "Europe/Berlin",
          notes: "A Note",
        },
        {
          id: "3",
          name: "Contact 3",
          timeZone: "America/Los_Angeles",
          notes: "A Note",
        },
        {
          id: "4",
          name: "Contact 4",
          timeZone: "America/Los_Angeles",
          notes: "A Note",
        },
        {
          id: "5",
          name: "Contact 5",
          timeZone: "America/Los_Angeles",
          notes: "A Note",
        },
      ])
    )

    alert("Data set.")
  }

  return (
    <main id="test">
      <h1>Test Page</h1>
      <div className="container accent">
        {authContext.isAuthenticated
          ? `You are authenticated as ${authContext.user.firstName}`
          : "You are not authenticated"}
      </div>
      <TestComponent />
      <div className="container primary">
        <h2>Set Debug Local Data</h2>
        <button onClick={onSetLocalDebugData} className="accent">
          Set
        </button>
      </div>
    </main>
  )
}
