import { useEffect, useState } from "react"
import allFavoriteTimezones from "../lib/api/allFavoriteTimezones"
import {
  Contact,
  ContactEditorUpdateAction,
  ContactsMapping,
  TimezoneProfile,
} from "../types"
import TimezoneDisplay from "../components/TimezoneDisplay"
import getTimezoneProfile from "../lib/api/getTimezoneProfile"
import TimezoneSearch from "../components/TimezoneSearch"
import getContactMapping from "../lib/api/getContactMapping"
import patchContacts from "../lib/pathcContacts"
import setFavorite from "../lib/api/setFavorite"

export default function Favorites() {
  const [contacts, setContacts] = useState<ContactsMapping>({})
  const [favoriteTimezones, setFavoriteTimezones] = useState<TimezoneProfile[]>(
    []
  )

  // Retrieves a list of all favorite timezones and contacts on load
  useEffect(() => {
    const loadData = async () => {
      const favoriteTimezoneNames = await allFavoriteTimezones()
      const favoriteTimezoneProfiles = await Promise.all(
        favoriteTimezoneNames.map((tz) => getTimezoneProfile(tz))
      )
      setFavoriteTimezones(favoriteTimezoneProfiles)

      setContacts(await getContactMapping(favoriteTimezoneProfiles))
    }

    loadData()
  }, [])

  const onFavoriteUpdate = async (timezone: string, setTo: boolean) => {
    const result = await setFavorite(timezone, setTo)

    if (result === undefined) {
      //TODO make some error response}
      alert("Could not change favorite state!")
      return
    }

    setFavoriteTimezones([
      ...favoriteTimezones.map((tzp) =>
        tzp.timezone === timezone ? { ...tzp, isFavorite: result } : tzp
      ),
    ])
  }

  const onContactUpdate = (
    timezone: string,
    data: Contact,
    action: ContactEditorUpdateAction
  ) => {
    setContacts(
      // Re-create the object from key-value pairs
      Object.fromEntries(
        // Split the object into key-value pairs and map over them
        Object.entries(contacts).map(([k, v]) => {
          // If the object is in the target timezone
          if (k == timezone) {
            return [k, patchContacts(v, data, action)]
          }
          // Else, do nothing
          else return [k, v]
        })
      )
    )
  }

  return (
    <main id="favorites">
      <h1>Favorite Timezones</h1>
      <TimezoneSearch />
      {favoriteTimezones.map((timezone, i) => (
        <TimezoneDisplay
          timezone={timezone}
          contacts={
            contacts[timezone.timezone] ? contacts[timezone.timezone] : []
          }
          favoriteUpdateCallback={onFavoriteUpdate}
          contactUpdateCallback={(data, action) => {
            console.log("Callback")
            onContactUpdate(timezone.timezone, data, action)
          }}
          key={`favorites-${timezone}-${i}`}
        />
      ))}
    </main>
  )
}
