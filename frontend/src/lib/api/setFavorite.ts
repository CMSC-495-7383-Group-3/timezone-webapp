// Sets a timezone as favorite or not. Returns undefined on failure and the new favorite state on success
export default function setFavorite(
  timezone: string,
  setTo: boolean
): boolean | undefined {
  const timezones = localStorage.getItem("favoriteTimezones")

  if (!timezones) return undefined

  let timezonesList: string[] = JSON.parse(timezones)

  if (setTo === true) timezonesList.push(timezone)
  else timezonesList = timezonesList.filter((tz) => tz != timezone)

  localStorage.setItem("favoriteTimezones", JSON.stringify(timezonesList))
  return setTo
}
