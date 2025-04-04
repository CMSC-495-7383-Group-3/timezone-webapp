import { useParams } from "react-router-dom"
import TimezoneDisplay from "../components/TimezoneDisplay"
import contactsByTimezone from "../lib/api/contactsByTimezone"
import { useContext, useEffect, useState } from "react"
import { Contact, TimezoneProfile } from "../types"
import getTimezoneProfile from "../lib/api/getTimezoneProfile"
import setFavorite from "../lib/api/setFavorite"
import { ContactEditorContext } from "../context/contactEditorContext"
import TimeZoneSearch from "../components/TimeZoneSearch"

export default function Timezone() {
  const { zone } = useParams<{ zone: string }>()
  const [timezoneProfile, setTimezoneProfile] = useState<TimezoneProfile>(
    getTimezoneProfile(zone ? zone.replace("-", "/") : "")
  )
  const [contacts, setContacts] = useState<Contact[]>(
    contactsByTimezone(timezoneProfile.timeZone)
  )
  const contactEditor = useContext(ContactEditorContext)

  // This effect listens to a change in the page's route parameters, so that the page is "reloaded" when needed
  useEffect(() => {
    const newProfile = getTimezoneProfile(zone ? zone.replace("-", "/") : "")
    setTimezoneProfile(newProfile)
    setContacts(contactsByTimezone(newProfile.timeZone))
  }, [zone])

  const onFavoriteButtonClick = () => {
    // TODO this function is slow to respond for some reason. Fix this is possible if this is still a problem when the proper API is implemented
    const result = setFavorite(
      timezoneProfile.timeZone,
      !timezoneProfile.isFavorite
    )

    if (result === undefined) alert("Could not change favorite state!") //TODO make some error response

    setTimezoneProfile({ ...timezoneProfile, isFavorite: result! })
  }

  const onAddContact = () => {
    const newContact = {
      id: "",
      name: "",
      timeZone: timezoneProfile.timeZone,
      notes: "",
    }
    contactEditor.newContact(newContact)
    setContacts([...contacts, newContact])
  }

  return (
    <main id="timezone">
      <h1>Timezone</h1>

      <div className="container primary">
        <TimezoneDisplay
          timezone={timezoneProfile}
          contacts={contacts}
        ></TimezoneDisplay>

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
      <TimeZoneSearch />
    </main>
  )
}
