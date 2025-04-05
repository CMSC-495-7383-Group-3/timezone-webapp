import { TimezoneProfile } from "../../types"
import timezones from "timezones.json"
import isTimezoneFavorite from "./isTimezoneFavorite"

// Retrieves a timezone profile.
export default function getTimezoneProfile(timezone: string): TimezoneProfile {
  const found = timezones.find((tz) => tz.utc.find((utc) => utc === timezone))

  if (!found)
    return {
      id: "",
      label: "",
      city: "",
      timezone: timezone,
      sunriseTime: "",
      sunsetTime: "",
      isFavorite: false,
      valid: false,
    }

  const favorite = isTimezoneFavorite(timezone)
  return {
    id: found.abbr,
    label: found.value,
    city: "",
    timezone: timezone,
    sunriseTime: "",
    sunsetTime: "",
    isFavorite: favorite ? favorite : false,
    valid: true,
  }
}
