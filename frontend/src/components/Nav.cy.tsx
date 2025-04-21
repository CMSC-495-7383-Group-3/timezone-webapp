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

    cy.get('[href="/"]').click({ force: true })
    cy.get("#location-display").should("have.text", "/")
  })

  it("Navigates to Dashboard", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/"]}>
        <Nav />
        <LocationDisplay />
      </MemoryRouter>
    )

    cy.get('[href="/dashboard"]').click({ force: true })
    cy.get("#location-display").should("have.text", "/dashboard")
  })

  it("Navigates to Favorites", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/"]}>
        <Nav />
        <LocationDisplay />
      </MemoryRouter>
    )

    cy.get('[href="/favorites"]').click({ force: true })
    cy.get("#location-display").should("have.text", "/favorites")
  })

  it("Can be toggled on mobile", () => {
    cy.mount(
      <MemoryRouter initialEntries={["/"]}>
        <Nav />
      </MemoryRouter>
    )

    cy.get("#toggle-nav").click()
    cy.get("#nav").should("have.class", "expanded")
  })
})
