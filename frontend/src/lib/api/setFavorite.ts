// Sets a timezone as favorite or not. Returns undefined on failure and the new favorite state on success
export default function setFavorite(
  timezone: string,
  setTo: boolean
): boolean | undefined {
  let timezones = localStorage.getItem("favoriteTimezones");
  let timezonesList: string[];

  // Initialize if missing
  if (!timezones) {
    timezonesList = [];
    localStorage.setItem("favoriteTimezones", JSON.stringify(timezonesList));
  } else {
    try {
      timezonesList = JSON.parse(timezones);
      if (!Array.isArray(timezonesList)) throw new Error("Invalid data");
    } catch (e) {
      console.error("Failed to parse favoriteTimezones:", e);
      return undefined; // Fail gracefully
    }
  }

  // Update list
  if (setTo === true) {
    if (!timezonesList.includes(timezone)) timezonesList.push(timezone);
  } else {
    timezonesList = timezonesList.filter((tz) => tz !== timezone);
  }

  localStorage.setItem("favoriteTimezones", JSON.stringify(timezonesList));
  return setTo;
}