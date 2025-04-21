import allFavoriteTimezones from "./allFavoriteTimezones"

// Returns if a timezone if in the favorites
export default async function isTimezoneFavorite(
  timezone: string
): Promise<boolean | undefined> {
  const favoriteTimezones = await allFavoriteTimezones()

  if (!favoriteTimezones) return undefined

  return favoriteTimezones.includes(timezone)
}
