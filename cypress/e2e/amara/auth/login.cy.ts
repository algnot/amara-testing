describe('test login', () => {
  it('should redirect to login when accessing dashboard without auth', () => {
    cy.intercept('GET', '**/auth/me').as('getAuthMe')
    cy.visit(Cypress.env('UI_ENDPOINT') + '/dashboard')
    cy.wait('@getAuthMe').its('response.statusCode').should('eq', 403)
    cy.url().should('include', '/login')
  })

  it('should alert with not found user', () => {
    cy.visit(Cypress.env('UI_ENDPOINT') + '/login')
    cy.get('input[type="email"]').type('wrong@email.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.get('[role="alertdialog"]').should('be.visible').should('contain', 'user with email wrong@email.com not found')
  })

  it('should alert with wrong password', () => {
    cy.visit(Cypress.env('UI_ENDPOINT') + '/login')
    cy.get('input[type="email"]').type(Cypress.env('SUPER_ADMIN_EMAIL'))
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.get('[role="alertdialog"]').should('be.visible').should('contain', 'user with email and password incorrect')
  })

  it('should login with super admin', () => {
    cy.visit(Cypress.env('UI_ENDPOINT') + '/login')
    cy.get('input[type="email"]').type(Cypress.env('SUPER_ADMIN_EMAIL'))
    cy.get('input[type="password"]').type(Cypress.env('SUPER_ADMIN_PASSWORD'))
    cy.get('button[type="submit"]').click()
    cy.get('[role="alertdialog"]').should('be.visible').and('contain', 'ยินดีต้อนรับ Amutomate Test :)')
    cy.contains('button', 'ยืนยัน').click()
    cy.url().should('include', '/dashboard')
  })
})