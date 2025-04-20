import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import TimezoneDisplay from "../components/TimezoneDisplay"
import TimezoneSearch from "../components/TimezoneSearch"
import { ContactEditorContext } from "../context/contactEditorContext"
import contactsByTimezone from "../lib/api/contactsByTimezone"
import getTimezoneProfile from "../lib/api/getTimezoneProfile"
import setFavorite from "../lib/api/setFavorite"
import { Contact, TimezoneProfile } from "../types"

export default function Timezone() {
  const contactEditor = useContext(ContactEditorContext)

  // The the timezone from the parameters
  const { zone } = useParams<{ zone: string }>()

  // Attempt to get the timezone profile from the given parameter
  const [timezoneProfile, setTimezoneProfile] = useState<TimezoneProfile>(
    // TODO potentially move the replace function into lib/unescapeTimezone
    getTimezoneProfile(zone ? zone.replace("-", "/") : "")
  )

  // Loads the list of contacts from the given timezone
  const [contacts, setContacts] = useState<Contact[]>([])

  // This effect listens to a change in the page's route parameters, so that the page is "reloaded" when needed
  useEffect(() => {
    const newProfile = getTimezoneProfile(zone ? zone.replace("-", "/") : "")
    setTimezoneProfile(newProfile)
    loadContacts(newProfile)
  }, [zone])

  // This gets called on load to load data from the backend
  const loadContacts = async (profile: TimezoneProfile) => {
    setContacts(await contactsByTimezone(profile.timezone))
  }

  useEffect(() => {
    loadContacts(timezoneProfile)
  }, [])

  const onFavoriteButtonClick = () => {
    // TODO this function is slow to respond for some reason. Fix this is possible if this is still a problem when the proper API is implemented
    const result = setFavorite(
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

    contactEditor.newContact(newContact)

    // Adds the contact to the list of currently loaded contacts.
    // TODO see if there is a good way to hide this contact while it is blank. Potentially make all blank-name contacts hidden?
    setContacts([...contacts, newContact])
  }

  return (
    <main id="timezone">
      <h1>Timezone</h1>

      <div className="container primary">
        <TimezoneDisplay timezone={timezoneProfile} contacts={contacts} />

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
