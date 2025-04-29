import allFavoriteTimezoneRecords from "./allFavoriteTimezoneRecords"

// Gers all favorites for a given timezone
export default async function allFavoriteTimezones(): Promise<string[]> {
  return (await allFavoriteTimezoneRecords()).map((record) => record.timezone)
}
