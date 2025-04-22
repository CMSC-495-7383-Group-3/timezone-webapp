import api from "../../api"
import { Contact } from "../../types"
import convertContact from "../convertContact"

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
