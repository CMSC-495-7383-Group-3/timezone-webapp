import { createContext } from "react"
import { Contact, ContactEditorUpdateCallbackFunction } from "../types"

export type contactEditorContextData = {
  // Opens the contact editor for an existing contact. If the callback returns undefined, the contact should be deleted
  openEditor: (
    contact: Contact,
    callback: ContactEditorUpdateCallbackFunction
  ) => void
  // Opens a new contact. If the callback returns undefined, the operation should be canceled
  newContact: (
    callback: ContactEditorUpdateCallbackFunction,
    base?: Contact
  ) => void
}

export const ContactEditorContext = createContext<contactEditorContextData>({
  openEditor: (
    contact: Contact,
    _callback: ContactEditorUpdateCallbackFunction
  ) => {
    console.error("Default Open Contact Editor Called!", contact)
  },
  newContact: (
    _callback: ContactEditorUpdateCallbackFunction,
    base?: Contact
  ) => {
    console.error("Default Open Contact Editor Called!", base)
  },
})
