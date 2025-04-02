import "./contactListItem.scss"
import { Contact, ContactAvailability } from "../types"

interface IContactListProps {
  // Timezones to be displayed for this component
  availability: ContactAvailability
  // The contact this component will render
  contact: Contact
}

// Displays a single contact item.
export default function ContactListItem(props: IContactListProps) {
  return (
    <li className={`contact-list-item ${props.availability}`}>
      {props.contact.name}
    </li>
  )
}
