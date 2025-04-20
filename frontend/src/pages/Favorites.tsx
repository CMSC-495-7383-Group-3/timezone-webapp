import { useEffect, useMemo, useState } from "react"
import allFavoriteTimezones from "../lib/api/allFavoriteTimezones"
import { ContactsMapping, TimezoneProfile } from "../types"
import TimezoneDisplay from "../components/TimezoneDisplay"
import getTimezoneProfile from "../lib/api/getTimezoneProfile"
import TimezoneSearch from "../components/TimezoneSearch"
import getContactMapping from "../lib/api/getContactMapping"

export default function Favorites() {
  // Retrieves a list of all favorite timezones on load
  const favoriteTimezones = useMemo<TimezoneProfile[]>(() => {
    return allFavoriteTimezones().map((tz) => getTimezoneProfile(tz))
  }, [])

  const [contacts, setContacts] = useState<ContactsMapping>({})

  useEffect(() => {
    const loadContacts = async () => {
      setContacts(await getContactMapping(favoriteTimezones))
    }

    loadContacts()
  }, [])

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
          key={`favorites-${timezone}-${i}`}
        />
      ))}
    </main>
  )
}
