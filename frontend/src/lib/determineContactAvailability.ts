import { ContactAvailability } from "../types"

// TODO document the horus in the user guide
const AVAILABILITY_START_TIME = 9
const AVAILABILITY_END_TIME = 17

// Determines if a contact is available depending on the date (assuming the date is in the contact's local timezone)
export default function determineContactAvailability(
  date: Date
): ContactAvailability {
  const hour = date.getHours()

  if (hour >= AVAILABILITY_START_TIME && hour < AVAILABILITY_END_TIME)
    return "available"
  else if (
    hour === AVAILABILITY_START_TIME - 1 ||
    hour === AVAILABILITY_END_TIME
  )
    return "maybe-available"
  else return "not-available"
}
