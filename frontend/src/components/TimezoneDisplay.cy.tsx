import React from "react"
import TimezoneDisplay from "./TimezoneDisplay"
import "../index.scss"
import "./timeZoneDisplay.scss"
import { MemoryRouter } from "react-router-dom"

const INVALID_TIMEZONE = {
  id: "",
  label: "",
  city: "",
  timezone: "",
  sunriseTime: "",
  sunsetTime: "",
  isFavorite: false,
  valid: false,
}
const VALID_TIMEZONE = {
  id: "WEDT",
  label: "W. Europe Standard Time",
  city: "",
  timezone: "Europe/Berlin",
  sunriseTime: "",
  sunsetTime: "",
  isFavorite: true,
  valid: true,
}

const EXAMPLE_CONTACT = {
  id: "Example-ID",
  name: "Example Contact",
  timeZone: "Europe/Berlin",
  notes: "Example Note",
}

describe("<TimezoneDisplay />", () => {
  it("Renders With an Invalid Timezone", () => {
    cy.mount(<TimezoneDisplay timezone={INVALID_TIMEZONE} contacts={[]} />)
    cy.contains("Invalid Timezone")
  })

  it("Renders With a Valid Timezone", () => {
    cy.mount(
      <MemoryRouter>
        <TimezoneDisplay timezone={VALID_TIMEZONE} contacts={[]} />
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
        timeZone: VALID_TIMEZONE.timezone,
      })
    )

    // TODO Check sunrise and set times
  })

  it("Renders With Contacts", () => {
    cy.mount(
      <MemoryRouter>
        <TimezoneDisplay
          timezone={VALID_TIMEZONE}
          contacts={[EXAMPLE_CONTACT]}
        />
      </MemoryRouter>
    )

    cy.contains("Example Contact")
  })

  it("Renders Child Components", () => {
    cy.mount(
      <MemoryRouter>
        <TimezoneDisplay
          timezone={VALID_TIMEZONE}
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
