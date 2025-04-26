import { Contact } from "../../types"
import allContacts from "./allContacts"

// Gets akk contacts by a given timezone
// TODO this can be improved by a search route in the backend
export default async function getContactsByTimezone(
  timezone: string
): Promise<Contact[]> {
  const allContactsData = await allContacts()

  return allContactsData.filter((contact) => contact.timezone === timezone)
}
