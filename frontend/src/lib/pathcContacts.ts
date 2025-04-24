import { Contact, ContactEditorUpdateAction } from "../types"

// Given a list of contacts, it applies the action with the new contact
export default function patchContacts(
  contacts: Contact[],
  data: Contact,
  action: ContactEditorUpdateAction
): Contact[] {
  switch (action) {
    case ContactEditorUpdateAction.ADD:
      return [...contacts, data]
    case ContactEditorUpdateAction.UPDATE:
      return [...contacts.map((c) => (c.id === data.id ? data : c))]
    case ContactEditorUpdateAction.DELETE:
      return { ...contacts.filter((c) => c.id !== data.id) }
  }
}
