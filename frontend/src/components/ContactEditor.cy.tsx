import { useRef } from "react"
import ContactEditor from "./ContactEditor"
import "../index.scss"
import exampleContact from "../../cypress/fixtures/exampleContact.json"
import { Contact } from "../types"

interface IContactEditorWrapperProps {
  contact: Contact
  newContact?: boolean
  closeEditorCallback?: () => void
  keepOpenOnSave?: boolean
  updateContactCallback: any
}

const ContactEditorWrapper = (props: IContactEditorWrapperProps) => {
  const callbackRef = useRef(props.updateContactCallback)

  return (
    <ContactEditor
      contact={props.contact}
      newContact={props.newContact}
      updateCallback={callbackRef}
      closeEditorCallback={props.closeEditorCallback}
      keepOpenOnSave={props.keepOpenOnSave}
      skipBackend
    />
  )
}

describe("<ContactEditor />", () => {
  it("Renders", () => {
    const contact = { ...exampleContact }
    const updateContactCallback = cy.stub().as("updateCallback")

    cy.mount(
      <ContactEditorWrapper
        contact={contact}
        updateContactCallback={updateContactCallback}
      />
    )

    cy.contains("Editing: Example Contact")
    cy.contains("Save")
  })

  it("Renders For New Contacts", () => {
    const contact = { ...exampleContact }
    const updateContactCallback = cy.stub().as("updateCallback")

    cy.mount(
      <ContactEditorWrapper
        contact={contact}
        updateContactCallback={updateContactCallback}
        newContact
      />
    )

    cy.contains("Editing: Example Contact")
    cy.contains("Add")
  })

  it("Calls coseEditorCallback", () => {
    const contact = { ...exampleContact }
    const closeEditorCallback = cy.stub().as("closeEditorCallbackStub")
    const updateContactCallback = cy.stub().as("updateCallback")

    cy.mount(
      <ContactEditorWrapper
        contact={contact}
        updateContactCallback={updateContactCallback}
        closeEditorCallback={closeEditorCallback}
      />
    )

    cy.contains("Editing: Example Contact")
    cy.contains("Cancel").click()

    cy.get("@closeEditorCallbackStub").should("have.been.calledOnce")
  })

  it("Saves the contact", () => {
    const contact = { ...exampleContact }
    const updateContactCallback = cy.stub().as("updateCallback")

    cy.mount(
      <ContactEditorWrapper
        contact={contact}
        updateContactCallback={updateContactCallback}
      />
    )

    cy.get('[aria-label="Name"]').clear().type("Example Updated")
    cy.contains("Save").click()

    cy.get("@updateCallback").should("have.been.calledOnce")
    cy.contains('"Example Updated" saved.')
  })

  it("Deletes a the contact", () => {
    const contact = { ...exampleContact }
    const closeEditorCallback = cy.stub().as("closeEditorCallbackStub")
    const updateContactCallback = cy.stub().as("updateCallback")

    cy.mount(
      <ContactEditorWrapper
        contact={contact}
        closeEditorCallback={closeEditorCallback}
        updateContactCallback={updateContactCallback}
      />
    )

    cy.get('[aria-label="Name"]').clear().type("Example Updated")
    cy.contains("Delete").click()

    cy.get("@updateCallback").should("have.been.calledOnce")
    cy.get("@closeEditorCallbackStub").should("have.been.calledOnce")
  })

  it("Calls coseEditorCallback On Save", () => {
    const contact = { ...exampleContact }
    const closeEditorCallback = cy.stub().as("closeEditorCallbackStub")
    const updateContactCallback = cy.stub().as("updateCallback")

    cy.mount(
      <ContactEditorWrapper
        contact={contact}
        closeEditorCallback={closeEditorCallback}
        updateContactCallback={updateContactCallback}
      />
    )

    cy.contains("Editing: Example Contact")
    cy.contains("Save").click()

    cy.get("@closeEditorCallbackStub").should("have.been.calledOnce")
  })

  it("Does NOT call coseEditorCallback On Keep Open", () => {
    const contact = { ...exampleContact }
    const closeEditorCallback = cy.stub().as("closeEditorCallbackStub")
    const updateContactCallback = cy.stub().as("updateCallback")

    cy.mount(
      <ContactEditorWrapper
        contact={contact}
        closeEditorCallback={closeEditorCallback}
        updateContactCallback={updateContactCallback}
        keepOpenOnSave
      />
    )

    cy.contains("Editing: Example Contact")
    cy.contains("Save").click()

    cy.get("@closeEditorCallbackStub").should("not.have.been.called")
  })
})
