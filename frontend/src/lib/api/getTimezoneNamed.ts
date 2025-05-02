import api from "../../api"
import { TimezoneTimingData } from "../../types"

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
    .catch((_err) => undefined)
}
