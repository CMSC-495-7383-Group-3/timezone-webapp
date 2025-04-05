import determineContactAvailability from "../lib/determineContactAvailability"
import { Contact } from "../types"
import ContactListItem from "./ContactListItem"

interface IContactListProps {
  time: Date

  // List of contacts to display
  contacts: Contact[]
}

export default function ContactList(props: IContactListProps) {
  return (
    <ul className="contacts-list">
      {props.contacts.map((contact) => (
        <ContactListItem
          contact={contact}
          // TODO: Find a better way to call this, depending on how to final timezone resolution will work
          availability={determineContactAvailability(props.time)}
          key={`timezone-list-item-${contact.id}`}
        />
      ))}
    </ul>
  )
}
