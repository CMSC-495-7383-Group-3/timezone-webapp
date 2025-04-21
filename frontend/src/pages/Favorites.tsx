import { useEffect, useMemo, useState } from "react"
import allFavoriteTimezones from "../lib/api/allFavoriteTimezones"
import { ContactsMapping, TimezoneProfile } from "../types"
import TimezoneDisplay from "../components/TimezoneDisplay"
import getTimezoneProfile from "../lib/api/getTimezoneProfile"
import TimezoneSearch from "../components/TimezoneSearch"
import getContactMapping from "../lib/api/getContactMapping"

export default function Favorites() {
  const [contacts, setContacts] = useState<ContactsMapping>({})
  const [favoriteTimezones, setFavoriteTimezones] = useState<TimezoneProfile[]>(
    []
  )

  // Retrieves a list of all favorite timezones and contacts on load
  useEffect(() => {
    const loadData = async () => {
      const favoriteTimezoneProfiles = (await allFavoriteTimezones()).map(
        (tz) => getTimezoneProfile(tz)
      )
      setFavoriteTimezones(favoriteTimezoneProfiles)

      setContacts(await getContactMapping(favoriteTimezoneProfiles))
    }

    loadData()
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
