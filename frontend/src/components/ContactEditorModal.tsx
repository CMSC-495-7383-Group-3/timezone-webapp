import "./contactEditorModal.scss"
import { ReactNode, useEffect, useRef, useState } from "react"
import { Contact } from "../types"
import { ContactEditorContext } from "../context/contactEditorContext"
import ContactEditor from "./ContactEditor"
import { v4 as uuidv4 } from "uuid"

interface IContactEditorModalProps {
  children?: ReactNode
}

export default function ContactEditorModal(props: IContactEditorModalProps) {
  const [editedContact, setEditedContact] = useState<Contact | undefined>(
    undefined
  )

  const openContactEditor = (contact: Contact) => {
    setEditedContact(contact)
  }

  const openNewContactEditor = (base?: Contact) => {
    const contact = base
      ? base
      : {
          id: "",
          name: "",
          timeZone: "",
          notes: "",
        }

    contact.id = uuidv4()

    openContactEditor(contact)
  }

  const onCloseContactEditor = () => {
    setEditedContact(undefined)
  }

  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (editedContact != undefined) {
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
            newContact={false}
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
