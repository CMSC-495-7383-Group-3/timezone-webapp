import { TimezoneProfile } from "../../types"
import timezones from "timezones.json"
import isTimezoneFavorite from "./isTimezoneFavorite"
import getTimezoneNamed from "./getTimezoneNamed"

// Retrieves a timezone profile.
export default async function getTimezoneProfile(
  timezone: string
): Promise<TimezoneProfile> {
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
      hasTimingData: false,
    }

  // Await both the query for if the timezone is favorite and for getting the timezone timing
  const [favorite, timingData] = await Promise.all([
    isTimezoneFavorite(timezone),
    getTimezoneNamed(timezone),
  ])

  return {
    id: found.abbr,
    label: found.value,
    city: "",
    timezone: timezone,
    sunriseTime: timingData ? timingData.sunrise : "00:00",
    sunsetTime: timingData ? timingData.sunset : "00:00",
    isFavorite: favorite ? favorite : false,
    valid: true,
    hasTimingData: timingData !== undefined,
  }
}

// Retrieves a timezone profile without a backend request. Favorite will ALWAYS be false
export function getTimezoneProfileSync(timezone: string): TimezoneProfile {
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
      hasTimingData: false,
    }

  return {
    id: found.abbr,
    label: found.value,
    city: "",
    timezone: timezone,
    sunriseTime: "",
    sunsetTime: "",
    isFavorite: false,
    valid: true,
    hasTimingData: false,
  }
}
