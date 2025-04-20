import api from "../../api"
import { Contact } from "../../types"
import convertContact from "../convertContact"

function unConvertContact(contact: Contact): object {
  return {
    id: contact.id,
    name: contact.name,
    timezone: contact.timezone,
    phone_number: contact.phoneNumber,
  }
}

// Updates a contact by ID. Optionally also creates a new contact if it does not yet exist
export default async function updateContact(
  id: string,
  newData: Contact,
  createNew: boolean = true
): Promise<Contact | undefined> {
  if (createNew)
    return api
      .post("/contacts/", unConvertContact(newData))
      .then((res) => convertContact(res.data))
      .catch((err) => {
        console.error(err)
        return undefined
      })
  else
    return api
      .put(`/contacts/${id}/`, unConvertContact(newData))
      .then((res) => convertContact(res.data))
      .catch((err) => {
        console.error(err)
        return undefined
      })
}
