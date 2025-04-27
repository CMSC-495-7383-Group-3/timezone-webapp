import api from "../../api"
import { Contact } from "../../types"
import convertContact from "../convertContact"

// Retrieves all the current user's contacts from the API. Returns an empty array on error
export default async function allContacts(): Promise<Contact[]> {
  return api
    .get("/contacts/")
    .then((res) => {
      return res.data.map(convertContact)
    })
    .catch((_err) => {
      return []
    })
}
