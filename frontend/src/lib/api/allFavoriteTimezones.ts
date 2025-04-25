import getUserSelf from "./getUserSelf"

// Gers all favorites for a given timezone
export default async function allFavoriteTimezones(): Promise<string[]> {
  const userData = await getUserSelf()

  if (!userData) return []

  //TODO For now, the userdata is stored in the last name, since there is still no filed for me to actually put the data
  const timezones = userData.lastName

  try {
    return JSON.parse(timezones)
  } catch {
    return []
  }
}
