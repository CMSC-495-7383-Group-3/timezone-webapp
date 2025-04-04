import { useMemo } from "react"
import allFavoriteTimezones from "../lib/api/allFavoriteTimezones"
import { TimezoneProfile } from "../types"
import TimezoneDisplay from "../components/TimezoneDisplay"
import getTimezoneProfile from "../lib/api/getTimezoneProfile"
import contactsByTimezone from "../lib/api/contactsByTimezone"

export default function Favorites() {
  const favoriteTimeZones = useMemo<TimezoneProfile[]>(() => {
    return allFavoriteTimezones().map((tz) => getTimezoneProfile(tz))
  }, [])

  return (
    <main id="favorites">
      <h1>Favorite Timezones</h1>
      {favoriteTimeZones.map((timezone, i) => (
        <TimezoneDisplay
          timezone={timezone}
          contacts={contactsByTimezone(timezone.timeZone)}
          key={`favorites-${timezone}-${i}`}
        />
      ))}
    </main>
  )
}
