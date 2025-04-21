import getUserSelf from "./getUserSelf"

// Gers all favorites for a given timezone
export default async function allFavoriteTimezones(): Promise<string[]> {
  const userData = await getUserSelf()

  if (!userData) return []

  const timezones = userData.lastName

  try {
    return JSON.parse(timezones)
  } catch {
    return []
  }
}
