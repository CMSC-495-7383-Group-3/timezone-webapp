import { ContactsMapping, TimezoneProfile } from "../../types"
import allContacts from "./allContacts"

// Batch retrieves a list of all contacts associated with some timezones
export default async function (
  timezones: TimezoneProfile[]
): Promise<ContactsMapping> {
  const allContactsData = await allContacts()

  // Extract the timezone profiles into a list of timezones
  const targets: string[] = timezones.map((tz) => tz.timezone)

  const result: ContactsMapping = {}

  for (const contact of allContactsData) {
    console.log(contact)

    if (targets.includes(contact.timezone)) {
      if (!result[contact.timezone]) result[contact.timezone] = [contact]
      else result[contact.timezone].push(contact)
    }
  }

  return result
}
