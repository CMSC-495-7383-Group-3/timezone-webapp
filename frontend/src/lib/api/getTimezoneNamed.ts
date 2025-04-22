import api from "../../api"
import { TimezoneTimingData } from "../../types"

const FALLBACK_TIME: TimezoneTimingData = {
  timezone_id: "",
  dst_offset: "",
  raw_offset: "",
  sunrise: "00:00",
  sunset: "00:00",
}

export default async function getTimezoneNamed(
  timezone: string
): Promise<TimezoneTimingData> {
  return api
    .get("/timezones/get_time_info_by_timezone", { params: { timezone } })
    .then((res) => {
      return res.data as TimezoneTimingData
    })
    .catch((_err) => {
      return { ...FALLBACK_TIME, timezone_id: timezone }
    })
}
