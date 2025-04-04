export const loginAndGoToDashboard = async () => {
    cy.visit(Cypress.env('UI_ENDPOINT') + '/login')
    cy.get('input[type="email"]').type(Cypress.env('SUPER_ADMIN_EMAIL'))
    cy.get('input[type="password"]').type(Cypress.env('SUPER_ADMIN_PASSWORD'))
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
}