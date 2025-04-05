import { ContactAvailability } from "../types"

// TODO determine universal hours or have each contact have their own assigned hours
const AVAILABILITY_START_TIME = 9
const AVAILABILITY_END_TIME = 17

// Determines if a contact is available depending on the date (assuming the date is in the contact's local timezone)
// TODO This is placeholder code for when the above is figured out
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
