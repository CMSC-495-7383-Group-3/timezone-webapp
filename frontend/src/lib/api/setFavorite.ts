import api from "../../api"
import allFavoriteTimezones from "./allFavoriteTimezones"

// Sets a timezone as favorite or not. Returns undefined on failure and the new favorite state on success
export default async function setFavorite(
  timezone: string,
  setTo: boolean
): Promise<boolean | undefined> {
  var currentFavorites = await allFavoriteTimezones()

  // If the timezone is in the current favorites and it set to remove, remove it
  if (setTo === false && currentFavorites.includes(timezone))
    currentFavorites = currentFavorites.filter((f) => f !== timezone)
  // If the timezone is not in the current list and it is set to add, add it
  else if (setTo === true && !currentFavorites.includes(timezone))
    currentFavorites.push(timezone)
  // Otherwise do nothing

  // Write the new data
  return api
    .patch("/users/profile/", {
      last_name: JSON.stringify(currentFavorites),
    })
    .then((_res) => {
      return setTo
    })
    .catch((_err) => {
      return undefined
    })
}
