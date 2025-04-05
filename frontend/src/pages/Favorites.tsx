import { useMemo } from "react"
import allFavoriteTimezones from "../lib/api/allFavoriteTimezones"
import { TimezoneProfile } from "../types"
import TimezoneDisplay from "../components/TimezoneDisplay"
import getTimezoneProfile from "../lib/api/getTimezoneProfile"
import contactsByTimezone from "../lib/api/contactsByTimezone"
import TimezoneSearch from "../components/TimezoneSearch"

export default function Favorites() {
  // Retrieves a list of all favorite timezones on load
  const favoriteTimezones = useMemo<TimezoneProfile[]>(() => {
    return allFavoriteTimezones().map((tz) => getTimezoneProfile(tz))
  }, [])

  return (
    <main id="favorites">
      <h1>Favorite Timezones</h1>
      <TimezoneSearch />
      {favoriteTimezones.map((timezone, i) => (
        <TimezoneDisplay
          timezone={timezone}
          contacts={contactsByTimezone(timezone.timezone)}
          key={`favorites-${timezone}-${i}`}
        />
      ))}
    </main>
  )
}
