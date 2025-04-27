import determineContactAvailability from "../lib/determineContactAvailability"
import { Contact, ContactEditorUpdateCallbackFunction } from "../types"
import ContactListItem from "./ContactListItem"

interface IContactListProps {
  // The current date in the timezone to be shown
  time: Date
  // List of contacts to display
  contacts: Contact[]
  // Callback for if this contact is edited
  updateCallback: ContactEditorUpdateCallbackFunction
}

// A list of contacts as given by the props. Meant to be used only as a child of TimezoneDisplay
export default function ContactList(props: IContactListProps) {
  return (
    <ul className="contacts-list">
      {props.contacts.map((contact) => (
        <ContactListItem
          contact={contact}
          availability={determineContactAvailability(props.time)}
          updateCallback={props.updateCallback}
          key={`timezone-list-item-${contact.id}`}
        />
      ))}
    </ul>
  )
}
