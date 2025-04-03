import { Contact } from "../../types"

export default function contactById(id: string): Contact | undefined {
  const contactsStorageData = localStorage.getItem("contacts")
  const allContacts: Contact[] = JSON.parse(
    contactsStorageData ? contactsStorageData : "[]"
  )
  return allContacts.find((contact) => contact.id === id)
}
