import { Contact } from "../types"

// Converts the field namings of a backend contact to better fit the frontend naming conventions
export default function convertContact(contact: any): Contact {
  return {
    id: contact.id,
    name: contact.name,
    timezone: contact.timezone,
    phoneNumber: contact.phone_number,
  }
}
