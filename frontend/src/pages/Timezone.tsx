import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import TimezoneDisplay from "../components/TimezoneDisplay"
import TimezoneSearch from "../components/TimezoneSearch"
import { ContactEditorContext } from "../context/contactEditorContext"
import getContactsByTimezone from "../lib/api/getContactsByTimezone"
import getTimezoneProfile from "../lib/api/getTimezoneProfile"
import setFavorite from "../lib/api/setFavorite"
import { Contact, ContactEditorUpdateAction, TimezoneProfile } from "../types"
import patchContacts from "../lib/patchContacts"

const FALLBACK_TIMEZONE_PROFILE = {
  id: "",
  label: "",
  city: "",
  timezone: "",
  sunriseTime: "",
  sunsetTime: "",
  isFavorite: false,
  valid: false,
}

export default function Timezone() {
  // Reroute to login if not authenticated
  // useProtectedPage()

  const contactEditor = useContext(ContactEditorContext)

  // Keep track of initial load to prevent an error from briefly showing
  const [loading, setLoading] = useState(true)

  // The the timezone from the parameters
  const { zone } = useParams<{ zone: string }>()

  // Attempt to get the timezone profile from the given parameter
  const [timezoneProfile, setTimezoneProfile] = useState<TimezoneProfile>(
    FALLBACK_TIMEZONE_PROFILE
  )

  // Loads the list of contacts from the given timezone
  const [contacts, setContacts] = useState<Contact[]>([])

  // This effect listens to a change in the page's route parameters, so that the page is "reloaded" when needed
  useEffect(() => {
    loadData(zone ? zone : "")
  }, [zone])

  // This gets called on load to load data from the backend
  const loadData = async (timezone: string) => {
    const profile = await getTimezoneProfile(timezone.replace("-", "/"))
    setTimezoneProfile(profile)
    setContacts(await getContactsByTimezone(profile.timezone))
    setLoading(false)
  }

  useEffect(() => {
    loadData(zone ? zone : "")
  }, [])

  const onAddContact = () => {
    const newContact = {
      id: "",
      name: "",
      timezone: timezoneProfile.timezone,
      phoneNumber: "",
    }

    contactEditor.newContact(onContactUpdate, newContact)

    // Adds the contact to the list of currently loaded contacts.
    setContacts([...contacts, newContact])
  }

  const onFavoriteUpdate = async (timezone: string, setTo: boolean) => {
    const result = await setFavorite(timezone, setTo)

    if (result === undefined) {
      alert("Could not change favorite state!")
      return
    }

    setTimezoneProfile({ ...timezoneProfile, isFavorite: result })
  }

  const onContactUpdate = (
    data: Contact,
    action: ContactEditorUpdateAction
  ) => {
    setContacts(patchContacts(contacts, data, action))
  }

  if (loading)
    return (
      <main id="timezone">
        <h1>Timezone</h1>
        <p>Loading...</p>
      </main>
    )

  return (
    <main id="timezone">
      <h1>Timezone</h1>

      <div className="container primary">
        <TimezoneDisplay
          timezone={timezoneProfile}
          contacts={contacts}
          favoriteUpdateCallback={onFavoriteUpdate}
          contactUpdateCallback={onContactUpdate}
        />

        <div className="container secondary">
          <p>
            Name: {timezoneProfile.timezone} | Label: {timezoneProfile.label} |
            ID: {timezoneProfile.id}
          </p>
        </div>
      </div>

      <div className="container accent flex">
        <button onClick={onAddContact}>Add Contact</button>
        <button
          onClick={() => {
            onFavoriteUpdate(
              timezoneProfile.timezone,
              !timezoneProfile.isFavorite
            )
          }}
        >
          {timezoneProfile.isFavorite ? "Unfavorite" : "Favorite"}
        </button>
      </div>
      <TimezoneSearch />
    </main>
  )
}
