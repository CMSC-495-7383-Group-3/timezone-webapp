import api from "../../api"

// Updates a contact by ID. Optionally also creates a new contact if it does not yet exist
export default async function deleteContact(id: string): Promise<boolean> {
  return api
    .delete(`/contacts/${id}/`)
    .then((_res) => true)
    .catch((_err) => false)
}
