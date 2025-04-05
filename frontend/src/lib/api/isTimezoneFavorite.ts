// Returns if a timezone if in the favorites
export default function isTimezoneFavorite(
  timezone: string
): boolean | undefined {
  const timezones = localStorage.getItem("favoriteTimezones")

  if (!timezones) return undefined

  return (
    (JSON.parse(timezones) as string[]).find((tz) => tz == timezone) !==
    undefined
  )
}
