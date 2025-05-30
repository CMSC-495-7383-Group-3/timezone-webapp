import LocalTimeDisplay from "./LocalTimeDisplay"
import "../index.scss"
import "./localTimeDisplay.scss"

describe("<LocalTimeDisplay />", () => {
  it("Renders", () => {
    cy.mount(<LocalTimeDisplay />)

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
})
