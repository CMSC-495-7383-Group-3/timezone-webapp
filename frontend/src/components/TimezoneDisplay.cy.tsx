import React from "react"
import TimezoneDisplay from "./TimezoneDisplay"
import "../index.scss"
import "./timeZoneDisplay.scss"
import { MemoryRouter } from "react-router-dom"
import exampleContact from "../../cypress/fixtures/exampleContact.json"
import invalidTimezone from "../../cypress/fixtures/invalidTimezone.json"
import validTimezone from "../../cypress/fixtures/validTimezone.json"

describe("<TimezoneDisplay />", () => {
  it("Renders With an Invalid Timezone", () => {
    cy.mount(<TimezoneDisplay timezone={invalidTimezone} contacts={[]} />)
    cy.contains("Invalid Timezone")
  })

  it("Renders With a Valid Timezone", () => {
    cy.mount(
      <MemoryRouter>
        <TimezoneDisplay timezone={validTimezone} contacts={[]} />
      </MemoryRouter>
    )
    cy.contains("W. Europe Standard Time")

    const date = new Date()
    date.setSeconds(date.getSeconds() + 1)
    cy.contains(
      date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: false,
        minute: "numeric",
        timeZone: validTimezone.timezone,
      })
    )

    // TODO Check sunrise and set times
  })

  it("Renders With Contacts", () => {
    cy.mount(
      <MemoryRouter>
        <TimezoneDisplay timezone={validTimezone} contacts={[exampleContact]} />
      </MemoryRouter>
    )

    cy.contains("Example Contact")
  })

  it("Renders Child Components", () => {
    cy.mount(
      <MemoryRouter>
        <TimezoneDisplay
          timezone={validTimezone}
          contacts={[]}
          hideContactsList
        >
          <p>Child Component</p>
        </TimezoneDisplay>
      </MemoryRouter>
    )

    cy.contains("Child Component")
  })
})
