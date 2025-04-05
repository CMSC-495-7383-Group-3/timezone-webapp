import TestComponent from "../components/TestComponent"

export default function Test() {
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
