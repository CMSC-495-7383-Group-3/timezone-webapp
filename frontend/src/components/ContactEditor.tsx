import { useState } from "react"
import { Contact, FormMessage } from "../types"
import updateContact from "../lib/api/updateContact"

interface IContactEditorProps {
  // The contact to edit. Writes back to this on save
  contact: Contact
  // Determine if new contact text should be shown
  newContact: boolean
  // Optional callback called when the editor wants to close
  closeEditorCallback?: () => void
  // Determine if the form should be kept open on save
  keepOpenOnSave?: boolean
}

// An editor for contacts. Provides a form for editing and saving.
export default function ContactEditor(props: IContactEditorProps) {
  const [contact, setContact] = useState({ ...props.contact })

  // Flag set once the first successful save of this contact happens.
  // Used to overwrite the newContact prop to show the proper text
  const [previouslySaved, setPreviouslySaved] = useState(false)

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
        setContact({ ...contact, timeZone: e.target.value })
        break
      case "contact.notes":
        setContact({ ...contact, notes: e.target.value })
        break
    }
  }

  const validateForm = (): boolean => {
    //TODO Validate timezone
    // Validates that the name is present
    return contact.name.length > 0
  }

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (validateForm()) {
      updateContact(contact.id, contact)

      setPreviouslySaved(true)
      setMessage({
        show: true,
        success: true,
        message: `"${contact.name}" saved.`,
      })

      // Update the existing contact if it is not a new contact. This will propagate the changes upwards.
      if (!props.newContact) {
        // Since the props is read-only, the fields are manually updated here
        props.contact.name = contact.name
        props.contact.timeZone = contact.timeZone
        props.contact.notes = contact.notes
      }

      // Attempt to close the form when is should not be kept open and a callback is specified
      if (!props.keepOpenOnSave && props.closeEditorCallback)
        props.closeEditorCallback()
    } else {
      // TODO be more specific with validation failures}
      setMessage({
        show: true,
        success: false,
        message: "Form Validation Failure.",
      })
    }
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
          value={contact.name}
          onChange={onFormChange}
        />
        <br />
        <label htmlFor="contact.timeZone">Time Zone</label>
        <input
          type="text"
          name="contact.timeZone"
          value={contact.timeZone}
          onChange={onFormChange}
        />
        <br />
        <label htmlFor="contact.notes">Notes</label>
        <input
          type="text"
          name="contact.notes"
          value={contact.notes}
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
    </div>
  )
}
