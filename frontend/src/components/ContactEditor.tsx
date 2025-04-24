import { RefObject, useState } from "react"
import {
  Contact,
  ContactEditorUpdateAction,
  ContactEditorUpdateCallbackFunction,
  FormMessage,
} from "../types"
import updateContact from "../lib/api/updateContact"
import validateTimezone from "../lib/validateTimezone"
import deleteContact from "../lib/api/deleteContact"

interface IContactEditorProps {
  // The contact to edit. Writes back to this on save
  contact: Contact
  // Determine if new contact text should be shown
  newContact?: boolean
  // Callback for when the contact gets updated. On DELETE, the argument is undefined
  updateCallback: RefObject<ContactEditorUpdateCallbackFunction | null>
  // Optional callback called when the editor wants to close
  closeEditorCallback?: () => void
  // Determine if the form should be kept open on save
  keepOpenOnSave?: boolean
  // Skips the backend call (for testing)
  skipBackend?: boolean
}

// An editor for contacts. Provides a form for editing and saving.
export default function ContactEditor(props: IContactEditorProps) {
  // The contact that is currently being edited
  // On creation of the component, is created from a shallow copy of the props
  const [contact, setContact] = useState({ ...props.contact })

  // Flag set once the first successful save of this contact happens.
  // Used to overwrite the newContact prop to show the proper text
  const [previouslySaved, setPreviouslySaved] = useState(false)

  // The current form message
  const [message, setMessage] = useState<FormMessage>({
    show: false,
    success: false,
    message: "",
  })

  const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "contact.name":
        setContact({ ...contact, name: e.target.value })
        break
      case "contact.timeZone":
        setContact({ ...contact, timezone: e.target.value })
        break
      case "contact.phone-number":
        setContact({ ...contact, phoneNumber: e.target.value })
        break
    }
  }

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate the form data
    if (contact.name.length <= 0 || !validateTimezone(contact.timezone)) {
      setMessage({
        show: true,
        success: false,
        message: `Invalid data."${contact.name}"`,
      })
      return
    }

    const result = !props.skipBackend
      ? await updateContact(contact.id, contact, props.newContact)
      : contact

    if (!result) {
      setMessage({
        show: true,
        success: false,
        message: `Failed to ${props.newContact ? "save" : "update"} "${
          contact.name
        }"`,
      })
      return
    }

    setPreviouslySaved(true)
    setMessage({
      show: true,
      success: true,
      message: `"${contact.name}" saved.`,
    })

    // Callback with the new contact data so that it can be updated in the parent's state
    if (props.updateCallback.current)
      props.updateCallback.current(
        contact,
        props.newContact && !previouslySaved
          ? ContactEditorUpdateAction.ADD
          : ContactEditorUpdateAction.UPDATE
      )

    // Attempt to close the form when is should not be kept open and a callback is specified
    if (!props.keepOpenOnSave && props.closeEditorCallback)
      props.closeEditorCallback()
  }

  const onDelete = async () => {
    const result = !props.skipBackend ? await deleteContact(contact.id) : true

    if (!result) {
      setMessage({
        show: true,
        success: false,
        message: `Failed to delete contact.`,
      })
      return
    }

    if (props.updateCallback.current)
      props.updateCallback.current(contact, ContactEditorUpdateAction.DELETE)

    if (props.closeEditorCallback) props.closeEditorCallback()
  }

  return (
    <div className="container modal contact-editor">
      {message.show ? (
        <p className={message.success ? "color-green" : "color-red"}>
          {message.message}
        </p>
      ) : (
        <></>
      )}

      <form onSubmit={onFormSubmit}>
        <h3>Editing: {contact.name}</h3>

        <label htmlFor="contact.name">Name</label>
        <input
          type="text"
          name="contact.name"
          aria-label="Name"
          value={contact.name}
          onChange={onFormChange}
        />
        <br />
        <label htmlFor="contact.timeZone">Time Zone</label>
        <input
          type="text"
          name="contact.timeZone"
          aria-label="Zone"
          value={contact.timezone}
          onChange={onFormChange}
        />
        <br />
        <label htmlFor="contact.phone-number">Phone Number</label>
        <input
          type="text"
          name="contact.phone-number"
          aria-label="Notes"
          value={contact.phoneNumber}
          onChange={onFormChange}
        />
        <br />
        <input
          type="submit"
          value={props.newContact && !previouslySaved ? "Add" : "Save"}
        />
        <br />
        <code>{contact.id}</code>
      </form>
      <button className="secondary" onClick={props.closeEditorCallback}>
        Cancel
      </button>
      <button className="secondary" onClick={onDelete}>
        Delete
      </button>
    </div>
  )
}
