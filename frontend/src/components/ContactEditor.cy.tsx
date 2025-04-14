/// <reference types="cypress" />
import React from "react"
import ContactEditor from "./ContactEditor"
import "../index.scss"

const EXAMPLE_CONTACT = {
  id: "Example-ID",
  name: "Example Contact",
  timeZone: "Europe/Berlin",
  notes: "Example Note",
}

describe("<ContactEditor />", () => {
  it("Renders", () => {
    const contact = { ...EXAMPLE_CONTACT }

    // see: https://on.cypress.io/mounting-react
    cy.mount(<ContactEditor contact={contact} />)

    cy.contains("Editing: Example Contact")
    cy.contains("Save")
  })

  it("Renders For New Contacts", () => {
    const contact = { ...EXAMPLE_CONTACT }

    cy.mount(<ContactEditor contact={contact} newContact />)

    cy.contains("Editing: Example Contact")
    cy.contains("Add")
  })

  it("Calls coseEditorCallback", () => {
    const contact = { ...EXAMPLE_CONTACT }
    const closeEditorCallback = cy.stub().as("closeEditorCallbackStub")

    cy.mount(
      <ContactEditor
        contact={contact}
        closeEditorCallback={closeEditorCallback}
      />
    )

    cy.contains("Editing: Example Contact")
    cy.contains("Cancel").click()

    cy.get("@closeEditorCallbackStub").should("have.been.calledOnce")
  })

  //TODO Somehow test if the object gets updated
  it("Saves the contact", () => {
    const contact = { ...EXAMPLE_CONTACT }
    // const save = cy.stub().as("saveStub")

    cy.mount(<ContactEditor contact={contact} />)

    cy.get('[aria-label="Name"]').clear().type("Example Updated")
    cy.contains("Save").click()

    cy.contains('"Example Updated" saved.')
  })

  it("Calls coseEditorCallback On Save", () => {
    const contact = { ...EXAMPLE_CONTACT }
    const closeEditorCallback = cy.stub().as("closeEditorCallbackStub")

    cy.mount(
      <ContactEditor
        contact={contact}
        closeEditorCallback={closeEditorCallback}
      />
    )

    cy.contains("Editing: Example Contact")
    cy.contains("Save").click()

    cy.get("@closeEditorCallbackStub").should("have.been.calledOnce")
  })

  it("Does NOT call coseEditorCallback On Keep Open", () => {
    const contact = { ...EXAMPLE_CONTACT }
    const closeEditorCallback = cy.stub().as("closeEditorCallbackStub")

    cy.mount(
      <ContactEditor
        contact={contact}
        closeEditorCallback={closeEditorCallback}
        keepOpenOnSave
      />
    )

    cy.contains("Editing: Example Contact")
    cy.contains("Save").click()

    cy.get("@closeEditorCallbackStub").should("not.have.been.called")
  })
})
