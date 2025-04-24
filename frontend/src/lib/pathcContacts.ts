import { Contact, ContactEditorUpdateAction } from "../types"

// Given a list of contacts, it applies the action with the new contact. Returns a new array
export default function patchContacts(
  contacts: Contact[],
  data: Contact,
  action: ContactEditorUpdateAction
): Contact[] {
  switch (action) {
    case ContactEditorUpdateAction.ADD:
      // To add, simply create a new array from the previous plus the new contact
      return [...contacts, data]
    case ContactEditorUpdateAction.UPDATE:
      // To update, map over all contacts, returning the updated contact for the matching ID or the old data for anything else
      return [...contacts.map((c) => (c.id === data.id ? data : c))]
    case ContactEditorUpdateAction.DELETE:
      // To delete, filter the array
      return [...contacts.filter((c) => c.id !== data.id)]
  }
}
