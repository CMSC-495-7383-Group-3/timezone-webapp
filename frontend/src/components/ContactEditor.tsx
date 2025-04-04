import { useState } from "react"
import { Contact, formMessage } from "../types"
import updateContact from "../lib/api/updateContact"

interface IContactEditorProps {
  contact: Contact
  newContact: boolean
  closeEditorCallback?: () => void
}

export default function ContactEditor(props: IContactEditorProps) {
  const [contact, setContact] = useState({ ...props.contact })

  // Flag set once the first successful save of this contact happens.
  // Used to overwrite the newContact prop to show the proper text
  const [previouslySaved, setPreviouslySaved] = useState(false)

  const [message, setMessage] = useState<formMessage>({
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
    return contact.name.length > 0
  }

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (validateForm()) updateContact(contact.id, contact)
    else
      setMessage({
        show: true,
        success: false,
        message: "Form Validation Failure.",
      })

    // TODO be more specific with failures

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
