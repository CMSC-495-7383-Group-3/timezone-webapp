import { useContext, useEffect, useState } from "react"
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
import { AuthContext } from "../context/authContext"
import { useNavigate } from "react-router-dom"

export default function Favorites() {
  // Reroute to login if not authenticated
  const authData = useContext(AuthContext)
  const navigate = useNavigate()
  if (!authData.isAuthenticated) navigate("/login?please_login", {})

  const [contacts, setContacts] = useState<ContactsMapping>({})
  const [favoriteTimezones, setFavoriteTimezones] = useState<TimezoneProfile[]>(
    []
  )

  // Retrieves a list of all favorite timezones and contacts
  const loadData = async () => {
    const favoriteTimezoneNames = await allFavoriteTimezones()
    const favoriteTimezoneProfiles = await Promise.all(
      favoriteTimezoneNames.map((tz) => getTimezoneProfile(tz))
    )
    setFavoriteTimezones(favoriteTimezoneProfiles)

    setContacts(await getContactMapping(favoriteTimezoneProfiles))
  }

  // Loads the required data when the component is mounted
  useEffect(() => {
    loadData()
  }, [])

  const onFavoriteUpdate = async (timezone: string, setTo: boolean) => {
    const result = await setFavorite(timezone, setTo)

    if (result === undefined) {
      console.error("Could not change favorite state!")
      return
    }

    // Update the favorite status for the selected timezone
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
      // 3. Re-create the object from key-value pairs
      Object.fromEntries(
        // 1. Split the object into key-value pairs and map over them
        Object.entries(contacts).map(([k, v]) => {
          // 2. If the object is in the target timezone
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
            onContactUpdate(timezone.timezone, data, action)
          }}
          key={`favorites-${timezone}-${i}`}
        />
      ))}
    </main>
  )
}
