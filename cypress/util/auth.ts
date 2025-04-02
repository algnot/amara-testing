export const loginAndGoToDashboard = async () => {
    cy.visit(Cypress.env('UI_ENDPOINT') + '/login')
    cy.get('input[type="email"]').type(Cypress.env('SUPER_ADMIN_EMAIL'))
    cy.get('input[type="password"]').type(Cypress.env('SUPER_ADMIN_PASSWORD'))
    cy.get('button[type="submit"]').click()
    cy.get('[role="alertdialog"]').should('be.visible').and('contain', 'ยินดีต้อนรับ Amutomate Test :)')
    cy.contains('button', 'ยืนยัน').click()
    cy.url().should('include', '/dashboard')
}