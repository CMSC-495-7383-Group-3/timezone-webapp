import "./contactEditorModal.scss"
import { ReactNode, useEffect, useRef, useState } from "react"
import { Contact } from "../types"
import { ContactEditorContext } from "../context/contactEditorContext"
import ContactEditor from "./ContactEditor"

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
    <ContactEditorContext value={{ openEditor: openContactEditor }}>
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
