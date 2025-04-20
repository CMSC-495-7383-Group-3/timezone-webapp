import { useState } from "react"
import { Contact, FormMessage } from "../types"
import updateContact from "../lib/api/updateContact"

interface IContactEditorProps {
  // The contact to edit. Writes back to this on save
  contact: Contact
  // Determine if new contact text should be shown
  newContact?: boolean
  // Optional callback called when the editor wants to close
  closeEditorCallback?: () => void
  // Determine if the form should be kept open on save
  keepOpenOnSave?: boolean
}

//TODO when a new contact is added and it is canceled, it will do a visual bug. Fix this by adding a callback

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
        setContact({ ...contact, timezone: e.target.value })
        break
      case "contact.phone-number":
        setContact({ ...contact, phoneNumber: e.target.value })
        break
    }
  }

  const validateForm = (): boolean => {
    //TODO Validate timezone
    // Validates that the name is present
    return contact.name.length > 0
  }

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (validateForm()) {
      const result = await updateContact(contact.id, contact, props.newContact)

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

      // Since the props is read-only, the fields are manually updated here
      props.contact.name = contact.name
      props.contact.timezone = contact.timezone
      props.contact.phoneNumber = contact.phoneNumber

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
    </div>
  )
}
