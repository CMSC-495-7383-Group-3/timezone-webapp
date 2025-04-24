import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import TimezoneDisplay from "../components/TimezoneDisplay"
import TimezoneSearch from "../components/TimezoneSearch"
import { ContactEditorContext } from "../context/contactEditorContext"
import contactsByTimezone from "../lib/api/contactsByTimezone"
import getTimezoneProfile from "../lib/api/getTimezoneProfile"
import setFavorite from "../lib/api/setFavorite"
import { Contact, ContactEditorUpdateAction, TimezoneProfile } from "../types"
import patchContacts from "../lib/pathcContacts"

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
  const contactEditor = useContext(ContactEditorContext)

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
    setContacts(await contactsByTimezone(profile.timezone))
  }

  useEffect(() => {
    loadData(zone ? zone : "")
  }, [])

  const onFavoriteButtonClick = async () => {
    // TODO this function is slow to respond for some reason. Fix this is possible if this is still a problem when the proper API is implemented
    const result = await setFavorite(
      timezoneProfile.timezone,
      !timezoneProfile.isFavorite
    )

    if (result === undefined) alert("Could not change favorite state!") //TODO make some error response

    setTimezoneProfile({ ...timezoneProfile, isFavorite: result! })
  }

  const onAddContact = () => {
    const newContact = {
      id: "",
      name: "",
      timezone: timezoneProfile.timezone,
      phoneNumber: "",
    }

    contactEditor.newContact(onContactUpdate, newContact)

    // Adds the contact to the list of currently loaded contacts.
    // TODO see if there is a good way to hide this contact while it is blank. Potentially make all blank-name contacts hidden?
    setContacts([...contacts, newContact])
  }

  const onFavoriteUpdate = async (timezone: string, setTo: boolean) => {
    const result = await setFavorite(timezone, setTo)

    if (result === undefined) {
      //TODO make some error response}
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
            City: {timezoneProfile.city} / Label: {timezoneProfile.label} / Id:{" "}
            {timezoneProfile.id} and any other descriptive text.
          </p>
        </div>
      </div>

      <div className="container accent">
        <button onClick={onAddContact}>Add Contact</button>
        <button onClick={onFavoriteButtonClick}>
          {timezoneProfile.isFavorite ? "Unfavorite" : "Favorite"}
        </button>
      </div>
      <TimezoneSearch />
    </main>
  )
}
