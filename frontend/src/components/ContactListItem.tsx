import "./contactListItem.scss"
import { Contact, ContactAvailability } from "../types"
import { ContactEditorContext } from "../context/contactEditorContext"
import { useContext } from "react"

interface IContactListProps {
  // Timezones to be displayed for this component
  availability: ContactAvailability
  // The contact this component will render
  contact: Contact
}

// Displays a single contact item.
export default function ContactListItem(props: IContactListProps) {
  const editorContext = useContext(ContactEditorContext)

  return (
    <li className={`contact-list-item ${props.availability}`}>
      <button onClick={() => editorContext.openEditor(props.contact)}>
        {props.contact.name}
      </button>
    </li>
  )
}
