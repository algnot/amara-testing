import { loginAndGoToDashboard } from "@/cypress/util/auth"
import { generateRandomStudentData } from "@/cypress/util/data"

const getStudentId = (): Promise<string> => {
    return new Promise((resolve) => {
        cy.contains('label', 'รหัสนักเรียน')
            .parent()
            .find('div.text-xl')
            .should('not.be.empty')
            .invoke('text')
            .then((text) => {
                resolve(text.trim());
            });
    });
};

describe('test student', () => {
    it('should alert with no sale person', () => {
        const studentData = generateRandomStudentData()

        cy.visit(Cypress.env('UI_ENDPOINT'))
        cy.get('input[placeholder="ชื่อนักเรียน (ภาษาไทย)"]').type(studentData.firstNameTH)
        cy.get('input[placeholder="นามสกุลนักเรียน (ภาษาไทย)"]').type(studentData.lastNameTH)
        cy.get('input[placeholder="ชื่อนักเรียน (ภาษาอังกฤษ)"]').type(studentData.firstNameEN)
        cy.get('input[placeholder="นามสกุลนักเรียน (ภาษาอังกฤษ)"]').type(studentData.lastNameEN)
        cy.get('input[placeholder="รหัส CS"]').type("auto888auto888auto888auto888auto888auto888")
        cy.get('button[type="submit"]').click()
        cy.get('[role="alertdialog"]').should('be.visible').and('contain', 'ไม่พบรหัส CS นี้ในระบบ')
    })

    it('should success with new student', async () => {
        const studentData = generateRandomStudentData();
        cy.visit(Cypress.env('UI_ENDPOINT'));
        cy.get('input[placeholder="ชื่อนักเรียน (ภาษาไทย)"]').type(studentData.firstNameTH);
        cy.get('input[placeholder="นามสกุลนักเรียน (ภาษาไทย)"]').type(studentData.lastNameTH);
        cy.get('input[placeholder="ชื่อนักเรียน (ภาษาอังกฤษ)"]').type(studentData.firstNameEN);
        cy.get('input[placeholder="นามสกุลนักเรียน (ภาษาอังกฤษ)"]').type(studentData.lastNameEN);
        cy.get('input[placeholder="รหัส CS"]').type("auto888");
        cy.get('button[type="submit"]').click();

        cy.get('[role="alertdialog"]').should('be.visible').and('contain', 'ระบบลงทะเบียนให้คุณเรียบร้อยแล้ว');
        cy.contains('button', 'ยืนยัน').click();
        cy.url().should('include', '/student/');

        const studentId = await getStudentId();

        Cypress.env('STUDENT_DATA', {
            ...studentData,
            id: studentId,
        });
    });

    it('should find student in dashboard using stored data', () => {
        loginAndGoToDashboard();
        const student = Cypress.env('STUDENT_DATA');
        expect(student).to.exist;
        expect(student.id, 'Student ID should be defined').to.exist;

        console.log(student);

        cy.get('input[placeholder="ค้นหา"]').type(student.id, { delay: 100 });
        cy.wait(1000);

        cy.contains('td', student.id)
            .should('be.visible')
            .parent('tr')
            .click();

        cy.contains('label', 'ชื่อ (ไทย)')
            .parent()
            .find('input')
            .should('have.value', student.firstNameTH);

        cy.contains('label', 'นามสกุล (ไทย)')
            .parent()
            .find('input')
            .should('have.value', student.lastNameTH);

        cy.contains('label', 'ชื่อ (อังกฤษ)')
            .parent()
            .find('input')
            .should('have.value', student.firstNameEN);

        cy.contains('label', 'นามสกุล (อังกฤษ)')
            .parent()
            .find('input')
            .should('have.value', student.lastNameEN);
    });
})