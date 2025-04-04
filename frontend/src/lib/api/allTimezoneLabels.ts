import timezones from "timezones.json"

export default function allTimezoneLabels(): string[] {
  return timezones.map((tz) => tz.utc).flat()
}
