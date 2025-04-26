import "./contactEditorModal.scss"
import { ReactNode, useEffect, useRef, useState } from "react"
import { Contact, ContactEditorUpdateCallbackFunction } from "../types"
import { ContactEditorContext } from "../context/contactEditorContext"
import ContactEditor from "./ContactEditor"
import { v4 as uuidv4 } from "uuid"

interface IContactEditorModalProps {
  children?: ReactNode
}

// Wrapper to provide the ContactEditorContext
export default function ContactEditorModal(props: IContactEditorModalProps) {
  // The current contact that is being edited. A value of undefined hides the modal
  const [editedContact, setEditedContact] = useState<Contact | undefined>(
    undefined
  )

  // Wether the contact is a new contact. Mainly used to adjust text.
  const [newContact, setNewContact] = useState(false)

  // The current callback function
  const currentUpdateCallback =
    useRef<ContactEditorUpdateCallbackFunction>(null)

  // Opens the contact editor for an existing contact.
  const openContactEditor = (
    contact: Contact,
    callback: ContactEditorUpdateCallbackFunction
  ) => {
    setNewContact(false)
    setEditedContact(contact)
    currentUpdateCallback.current = callback
  }

  // Opens a new contact.
  const openNewContactEditor = (
    callback: ContactEditorUpdateCallbackFunction,
    base?: Contact
  ) => {
    const contact = base
      ? base
      : {
          id: "",
          name: "",
          timezone: "",
          phoneNumber: "",
        }

    //! This generates a temporary uuidv4 that should be overwritten by the API
    contact.id = "NEW-" + uuidv4()

    setNewContact(true)
    setEditedContact(contact)
    currentUpdateCallback.current = callback
  }

  const onCloseContactEditor = () => {
    setEditedContact(undefined)
    currentUpdateCallback.current = null
  }

  // Reference to the dialog element that handles the overlay
  const dialog = useRef<HTMLDialogElement>(null)

  // Hide the modal once the edited contact becomes undefined
  useEffect(() => {
    if (editedContact !== undefined) {
      dialog.current?.showModal()
    }
  }, [editedContact])

  return (
    <ContactEditorContext
      value={{
        openEditor: openContactEditor,
        newContact: openNewContactEditor,
      }}
    >
      {editedContact != undefined ? (
        <dialog ref={dialog} className="container">
          <ContactEditor
            contact={editedContact}
            newContact={newContact}
            updateCallback={currentUpdateCallback}
            closeEditorCallback={onCloseContactEditor}
          />
        </dialog>
      ) : (
        <></>
      )}
      {props.children}
    </ContactEditorContext>
  )
}
