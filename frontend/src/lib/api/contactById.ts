import api from "../../api"
import { Contact } from "../../types"
import convertContact from "../convertContact"

// Retrieves a single contact by ID
export default async function contactById(
  id: string
): Promise<Contact | undefined> {
  return api
    .get(`/contacts/${id}/`)
    .then((res) => {
      return convertContact(res.data)
    })
    .catch((_err) => {
      return undefined
    })
}
