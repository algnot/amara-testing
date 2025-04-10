import { getAndExpectContain, getAndType } from "@/cypress/util/helper"

describe('test login', () => {
  it('should redirect to login when accessing dashboard without auth', () => {
    cy.intercept('GET', '**/auth/me').as('getAuthMe')
    cy.visit(Cypress.env('UI_ENDPOINT') + '/dashboard')
    cy.wait('@getAuthMe').its('response.statusCode').should('eq', 403)
    cy.url().should('include', '/login')
  })

  it('should error with not found user', () => {
    cy.visit(Cypress.env('UI_ENDPOINT') + '/login')
    getAndType('input[placeholder="amara@amara.com"]', 'wrong@email.com')
    getAndType('input[type="password"]', 'wrongpassword')
    cy.get('button[type="submit"]').click()
    getAndExpectContain('[role="alertdialog"]', ['user with email wrong@email.com not found'])
  })

  it('should error with wrong password', () => {
    cy.visit(Cypress.env('UI_ENDPOINT') + '/login')
    getAndType('input[placeholder="amara@amara.com"]', Cypress.env('SUPER_ADMIN_EMAIL'))
    getAndType('input[type="password"]', 'wrongpassword')
    cy.get('button[type="submit"]').click()
    getAndExpectContain('[role="alertdialog"]', ['user with email and password incorrect'])
  })

  it('should login with super admin', () => {
    cy.visit(Cypress.env('UI_ENDPOINT') + '/login')
    getAndType('input[placeholder="amara@amara.com"]', Cypress.env('SUPER_ADMIN_EMAIL'))
    getAndType('input[type="password"]', Cypress.env('SUPER_ADMIN_PASSWORD'))
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
})