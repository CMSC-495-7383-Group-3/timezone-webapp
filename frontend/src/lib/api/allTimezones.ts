import timezones from "timezones.json"

// Gets all timezone names
export default function allTimezones(): string[] {
  return timezones.map((tz) => tz.utc).flat()
}
