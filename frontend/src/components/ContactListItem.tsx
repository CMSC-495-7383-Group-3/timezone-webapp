import "./contactListItem.scss"
import {
  Contact,
  ContactAvailability,
  ContactEditorUpdateCallbackFunction,
} from "../types"
import { ContactEditorContext } from "../context/contactEditorContext"
import { useContext } from "react"

interface IContactListProps {
  // Timezones to be displayed for this component
  availability: ContactAvailability
  // The contact this component will render
  contact: Contact
  // Callback for if this contact is edited
  updateCallback: ContactEditorUpdateCallbackFunction
}

// Displays a single contact item.
export default function ContactListItem(props: IContactListProps) {
  const editorContext = useContext(ContactEditorContext)
  return (
    <li
      className={`contact-list-item ${props.availability} ${
        typeof props.contact.id === "string" &&
        props.contact.id.includes("NEW") &&
        props.contact.name == ""
          ? "hidden"
          : ""
      }`}
    >
      <button
        onClick={() =>
          editorContext.openEditor(props.contact, props.updateCallback)
        }
      >
        {props.contact.name}
      </button>
    </li>
  )
}
