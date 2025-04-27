describe("Pages/Timezone", () => {
  it("loads american", () => {
    cy.visit("/timezone/America-Los_Angeles")
    cy.contains("Pacific Daylight Time")
  })
  it("loads asian", () => {
    cy.visit("/timezone/Asia-Tokyo")
    cy.contains("Japan Standard Time")
  })
  it("loads european", () => {
    cy.visit("/timezone/Europe-Berlin")
    cy.contains("W. Europe Standard Time")
  })
})
