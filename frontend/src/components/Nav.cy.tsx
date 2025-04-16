import React from "react"
import Nav from "./Nav"
import { MemoryRouter, useLocation } from "react-router-dom"
import "../index.scss"

const LocationDisplay = () => {
  const location = useLocation()
  return <div id="location-display">{location.pathname}</div>
}

describe("<Nav />", () => {
  it("Renders with a router context", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/"]}>
        <Nav />
      </MemoryRouter>
    )
  })

  it("Navigates to Home", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/"]}>
        <Nav />
        <LocationDisplay />
      </MemoryRouter>
    )

    cy.get('[href="/"]').click()
    cy.get("#location-display").should("have.text", "/")
  })

  it("Navigates to Dashboard", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/"]}>
        <Nav />
        <LocationDisplay />
      </MemoryRouter>
    )

    cy.get('[href="/dashboard"]').click()
    cy.get("#location-display").should("have.text", "/dashboard")
  })

  it("Navigates to Favorites", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/"]}>
        <Nav />
        <LocationDisplay />
      </MemoryRouter>
    )

    cy.get('[href="/favorites"]').click()
    cy.get("#location-display").should("have.text", "/favorites")
  })
})
