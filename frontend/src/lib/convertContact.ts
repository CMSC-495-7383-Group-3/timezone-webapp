import { Contact } from "../types"

export default function convertContact(contact: any): Contact {
  return {
    id: contact.id,
    name: contact.name,
    timezone: contact.timezone,
    phoneNumber: contact.phone_number,
  }
}
