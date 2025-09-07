import { getDateInputFormat } from "@/cypress/util/data"
import { getAndExpectContain, getAndType } from "@/cypress/util/helper"

describe('test draft certificate no auth', () => {
    it('should error with no auth', () => {
        cy.visit(Cypress.env('UI_ENDPOINT') + '/certificate')
        getAndType('input[placeholder="รหัสนักเรียน"]', '200000000')
        cy.get('button[type="submit"]').click()
        getAndExpectContain('[role="alertdialog"]', ['Session expired. Please login again.'])
    })
})

describe('test draft certificate with auth', () => {
    beforeEach(() => {
        cy.createStudent().then(() => {
            cy.login(
                Cypress.env('SUPER_ADMIN_EMAIL'),
                Cypress.env('SUPER_ADMIN_PASSWORD')
            )
        })
    })

    it('should error with not found student', () => {
        cy.visit(Cypress.env('UI_ENDPOINT') + '/certificate')
        getAndType('input[placeholder="รหัสนักเรียน"]', '200000000')
        cy.get('button[type="submit"]').click()
        getAndExpectContain('[role="alertdialog"]', ['ไม่พบข้อมูลนักเรียนดังกล่าวในระบบ'])
    })

    it('should error with no start date and end date', () => {
        const student = Cypress.env('STUDENT_DATA');
        cy.visit(Cypress.env('UI_ENDPOINT') + '/certificate')
        getAndType('input[placeholder="รหัสนักเรียน"]', student.id)

        cy.get('button[type="submit"]').click()
        cy.url().should('include', `/certificate/${student.id}`)

        cy.contains('button', 'ขอใบประกาศ').click()
        getAndExpectContain('[role="alertdialog"]', ['กรุณาใส่ข้อมูลต่อไปนี้ student_id, start_date, end_date'])
    })

    it('should create draft certificate', () => {
        const student = Cypress.env('STUDENT_DATA');

        cy.visit(Cypress.env('UI_ENDPOINT') + '/certificate')
        getAndType('input[placeholder="รหัสนักเรียน"]', student.id)

        cy.intercept('GET', `**/student/get/${student.id}`).as('studentData')
        cy.get('button[type="submit"]').click()
        cy.wait('@studentData').its('response.statusCode').should('eq', 200)
        cy.url().should('include', `/certificate/${student.id}`)

        cy.get('input[placeholder="รหัสนักเรียน"]').should('have.value', student.id)
        cy.get('input[placeholder="ชื่อนักเรียน (ไทย)"]').should('have.value', `${student.firstNameTH} ${student.lastNameTH}`)
        cy.get('input[placeholder="ชื่อนักเรียน (อังกฤษ)"]').should('have.value', `${student.firstNameEN} ${student.lastNameEN}`)

        cy.contains('button', 'เลือก').click()
        cy.get('div[role="menuitem"]:visible').should('have.length.greaterThan', 0).then(($items) => {
            const index = Cypress._.random(0, $items.length - 1)
            cy.wrap($items.eq(index)).click()
        })

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 14);

        cy.get('input[placeholder="วันที่เริ่มเรียน"]').click()
        getAndType('input[placeholder="วันที่เริ่มเรียน"]', getDateInputFormat(today))

        cy.get('input[placeholder="วันที่เรียนจบ"]').click()
        getAndType('input[placeholder="วันที่เรียนจบ"]', getDateInputFormat(tomorrow))

        cy.contains('button', 'ขอใบประกาศ').click()
        getAndExpectContain('[role="alertdialog"]', ['ส่งคำขอสำเร็จ', 'ระบบได้ส่งคำขอสร้างใบประกาศเรียบร้อยแล้ว'])
    })
})