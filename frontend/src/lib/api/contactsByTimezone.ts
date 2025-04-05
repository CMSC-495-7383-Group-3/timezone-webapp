import { Contact } from "../../types"

// Gets akk contacts by a given timezone
export default function contactsByTimezone(timezone: string): Contact[] {
  const contactsStorageData = localStorage.getItem("contacts")
  const allContacts: Contact[] = JSON.parse(
    contactsStorageData ? contactsStorageData : "[]"
  )

  return allContacts.filter((contact) => contact.timeZone === timezone)
}
