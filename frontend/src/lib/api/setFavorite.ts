import api from "../../api"
import allFavoriteTimezoneRecords from "./allFavoriteTimezoneRecords"

// Sets a timezone as favorite or not. Returns undefined on failure and the new favorite state on success
export default async function setFavorite(
  timezone: string,
  setTo: boolean
): Promise<boolean | undefined> {
  const currentFavorites = await allFavoriteTimezoneRecords()
  const matchingRecords = currentFavorites.filter(
    (record) => record.timezone == timezone
  )

  // Print an error in case there are multiple records
  if (matchingRecords.length > 1)
    console.error("There are multiple records for timezone " + timezone)

  // If the timezone is in the current favorites and it set to remove, remove it
  if (setTo === false && matchingRecords.length >= 1)
    return api
      .delete(`/favorites/${matchingRecords[0].id}/`)
      .then((_res) => setTo)
      .catch((_err) => undefined)
  // If the timezone is not in the current list and it is set to add, add it
  else if (setTo === true && matchingRecords.length === 0)
    return api
      .post(`/favorites/`, { timezone })
      .then((_res) => setTo)
      .catch((_err) => undefined)
  // Otherwise do nothing
  else return setTo
}
