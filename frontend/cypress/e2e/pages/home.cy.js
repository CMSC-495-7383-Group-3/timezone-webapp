describe("Pages/Home", () => {
  it("loads", () => {
    cy.visit("/")
  })
  it("shows local time", () => {
    cy.visit("/")

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
