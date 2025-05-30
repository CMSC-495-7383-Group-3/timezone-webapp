import api from "../../api"

// Retrieves timezone timing data by position
export default async function getTimezonePositioned(
  lat: number,
  lon: number
): Promise<any> {
  return api
    .get(`/timezones/time_info`, { params: { lat, lon } })
    .then((res) => res)
    .catch((err) => err.response)
}
