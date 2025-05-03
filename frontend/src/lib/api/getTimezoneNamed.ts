import api from "../../api"
import { TimezoneTimingData } from "../../types"
import { getSunrise, getSunset } from "sunrise-sunset-js"

// Retrieves timezone timing data by timezone name
export default async function getTimezoneNamed(
  timezone: string
): Promise<TimezoneTimingData | undefined> {
  return api
    .get("/timezones/get_time_info_by_timezone", { params: { timezone } })
    .then((res) => {
      // TODO remove explicit fallbacks as this route is better tested
      return {
        timezone_id: res.data.timezone_id ? res.data.timezone_id : "",
        dst_offset: res.data.dst_offset ? res.data.dst_offset : "",
        raw_offset: res.data.raw_offset ? res.data.raw_offset : "",
        sunrise: res.data.sunrise ? res.data.sunrise : "00:00",
        sunset: res.data.sunset ? res.data.sunset : "00:00",
      }
    })
    .catch((err) => {
      if (err.status == 422) return manualTimings(err.response.data)
      else return undefined
    })
}

function manualTimings({
  lat,
  lon,
}: {
  lat: string
  lon: string
}): TimezoneTimingData | undefined {
  if (lat !== undefined && lon !== undefined) {
    console.log(lat, lon, getSunrise(parseInt(lat, 10), parseInt(lon, 10)))
    return {
      timezone_id: "(manual)",
      dst_offset: "",
      raw_offset: "",
      sunrise: getSunrise(
        parseInt(lat, 10),
        parseInt(lon, 10)
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Berlin",
      }),
      sunset: getSunset(
        parseInt(lat, 10),
        parseInt(lon, 10)
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Berlin",
      }),
    }
  } else return undefined
}
