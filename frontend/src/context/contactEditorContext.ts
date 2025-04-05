import { createContext } from "react"
import { Contact } from "../types"

export type contactEditorContextData = {
  openEditor: (contact: Contact) => void
  newContact: (base?: Contact) => void
}

export const ContactEditorContext = createContext<contactEditorContextData>({
  openEditor: (contact: Contact) => {
    console.error("Default Open Contact Editor Called!", contact)
  },
  newContact: (base?: Contact) => {
    console.error("Default Open Contact Editor Called!", base)
  },
})
