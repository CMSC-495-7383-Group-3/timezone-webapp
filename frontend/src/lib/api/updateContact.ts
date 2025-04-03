import { Contact } from "../../types"
import contactById from "./contactById"

// Updates a contact by ID. Optionally also creates a new contact if it does not yet exist
export default function updateContact(
  id: string,
  newData: Contact,
  createNew: boolean = true
): Contact | undefined {
  const contactsStorageData = localStorage.getItem("contacts")
  let allContacts: Contact[] = JSON.parse(
    contactsStorageData ? contactsStorageData : "[]"
  )

  const contactExists =
    allContacts.find((contact) => contact.id === id) != undefined
  if (contactExists)
    allContacts = allContacts.map((contact) =>
      contact.id === id ? newData : contact
    )
  else if (createNew) allContacts.push(newData)

  console.log(id, newData, allContacts)

  localStorage.setItem("contacts", JSON.stringify(allContacts))

  return contactById(id)
}
