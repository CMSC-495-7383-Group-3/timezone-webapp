import React from "react"
import LocalTimeDisplay from "./LocalTimeDisplay"
import "../index.scss"
import "./localTimeDisplay.scss"

describe("<LocalTimeDisplay />", () => {
  it("Renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LocalTimeDisplay seconds />)

    const date = new Date()
    date.setSeconds(date.getSeconds() + 1)

    cy.contains(
      date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: false,
        minute: "numeric",
      })
    )
  })

  it("Renders With Seconds", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<LocalTimeDisplay seconds />)

    const date = new Date()
    date.setSeconds(date.getSeconds() + 1)

    cy.contains(
      date.toLocaleString("en-US", {
        hour: "numeric",
        hour12: false,
        minute: "numeric",
        second: "numeric",
      })
    )
  })

  it("Renders With Children", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(
      <LocalTimeDisplay>
        <p>Child Component</p>
      </LocalTimeDisplay>
    )

    cy.contains("Child Component")
  })
})
