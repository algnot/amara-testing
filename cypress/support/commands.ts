import { generateRandomStudentData } from "../util/data"
import { getAndExpectContain, getAndType } from "../util/helper"

// TypeScript: add declaration merging so `cy.login()` is recognized.
declare global {
    namespace Cypress {
        interface Chainable {
            login(email: string, password: string): Chainable<void>
            createStudent(): Chainable<string>
        }
    }
}

export { }

Cypress.Commands.add('login', (email: string, password: string) => {
    cy.session([email, password], () => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.visit(Cypress.env('UI_ENDPOINT') + '/login')
        cy.get('input[type="email"], input[name="email"]').first().type(email)
        cy.get('input[type="password"], input[name="password"]').first().type(password)
        cy.get('button[type="submit"], button:contains("Log in"), [data-cy="login"]').first().click()
        cy.location('pathname', { timeout: 20000 }).should('not.match', /login|signin/i)
    })
})

Cypress.Commands.add('createStudent', () => {
    const studentData = generateRandomStudentData();
    cy.visit(Cypress.env('UI_ENDPOINT'))

    getAndType('input[placeholder="ชื่อนักเรียน (ภาษาไทย)"]', studentData.firstNameTH)
    getAndType('input[placeholder="นามสกุลนักเรียน (ภาษาไทย)"]', studentData.lastNameTH)
    getAndType('input[placeholder="ชื่อนักเรียน (ภาษาอังกฤษ)"]', studentData.firstNameEN)
    getAndType('input[placeholder="นามสกุลนักเรียน (ภาษาอังกฤษ)"]', studentData.lastNameEN)
    getAndType('input[placeholder="รหัส CS"]', "auto888")
    cy.get('button[type="submit"]').click()

    getAndExpectContain('[role="alertdialog"]', ['ลงทะเบียนสำเร็จ', 'ระบบลงทะเบียนให้คุณเรียบร้อยแล้ว'])
    cy.contains('button', 'ยืนยัน').click()
    cy.url().should('include', '/student/')

    return cy.contains('label', 'รหัสนักเรียน')
        .parent()
        .find('div.text-xl')
        .should('not.be.empty')
        .invoke('text')
        .then((text) => {
            const studentId = text.trim()
            Cypress.env('STUDENT_DATA', {
                ...studentData,
                id: studentId,
            })
            return studentId
        })
})
