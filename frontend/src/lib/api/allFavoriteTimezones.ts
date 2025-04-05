// Gers all favorites for a given timezone
export default function allFavoriteTimezones(): string[] {
  const timezones = localStorage.getItem("favoriteTimezones")

  if (!timezones) return []

  return JSON.parse(timezones)
}
