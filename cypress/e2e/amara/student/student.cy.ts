import { loginAndGoToDashboard } from "@/cypress/util/auth"
import { generateRandomStudentData } from "@/cypress/util/data"
import { getAndExpectContain, getAndType, getInputByLabelAndExpect } from "@/cypress/util/helper";

export const getStudentId = (): Promise<string> => {
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
    it('should error with no sale person', () => {
        const studentData = generateRandomStudentData()

        cy.visit(Cypress.env('UI_ENDPOINT'))
        getAndType('input[placeholder="ชื่อนักเรียน (ภาษาไทย)"]', studentData.firstNameTH)
        getAndType('input[placeholder="นามสกุลนักเรียน (ภาษาไทย)"]', studentData.lastNameTH)
        getAndType('input[placeholder="ชื่อนักเรียน (ภาษาอังกฤษ)"]', studentData.firstNameEN)
        getAndType('input[placeholder="นามสกุลนักเรียน (ภาษาอังกฤษ)"]', studentData.lastNameEN)
        getAndType('input[placeholder="รหัส CS"]', "auto888auto888auto888auto888auto888auto888")

        cy.get('button[type="submit"]').click()
        getAndExpectContain('[role="alertdialog"]', ['ผิดพลาด', 'ไม่พบรหัส CS นี้ในระบบ'])
    })

    it('should success with new student', async () => {
        const studentData = generateRandomStudentData();
        cy.visit(Cypress.env('UI_ENDPOINT'));

        getAndType('input[placeholder="ชื่อนักเรียน (ภาษาไทย)"]', studentData.firstNameTH);
        getAndType('input[placeholder="นามสกุลนักเรียน (ภาษาไทย)"]', studentData.lastNameTH);
        getAndType('input[placeholder="ชื่อนักเรียน (ภาษาอังกฤษ)"]', studentData.firstNameEN);
        getAndType('input[placeholder="นามสกุลนักเรียน (ภาษาอังกฤษ)"]', studentData.lastNameEN);
        getAndType('input[placeholder="รหัส CS"]', "auto888");
        cy.get('button[type="submit"]').click();

        getAndExpectContain('[role="alertdialog"]', ['ลงทะเบียนสำเร็จ', 'ระบบลงทะเบียนให้คุณเรียบร้อยแล้ว'])
        cy.contains('button', 'ยืนยัน').click();
        cy.url().should('include', '/student/');

        const studentId = await getStudentId();
        Cypress.env('STUDENT_DATA', {
            ...studentData,
            id: studentId,
        });
    });

    it('should error with duplicate student', async () => {
        cy.visit(Cypress.env('UI_ENDPOINT'));

        getAndType('input[placeholder="ชื่อนักเรียน (ภาษาไทย)"]', 'ศิริวรรณ');
        getAndType('input[placeholder="นามสกุลนักเรียน (ภาษาไทย)"]', 'หนอกค้างพลู');
        getAndType('input[placeholder="ชื่อนักเรียน (ภาษาอังกฤษ)"]', 'Sirivan');
        getAndType('input[placeholder="นามสกุลนักเรียน (ภาษาอังกฤษ)"]', 'Nuokkhangplu');
        getAndType('input[placeholder="รหัส CS"]', "auto888");
        cy.get('button[type="submit"]').click();

        getAndExpectContain('[role="alertdialog"]', ['ผิดพลาด', 'ข้อมูลนักเรียน ศิริวรรณ หนอกค้างพลู (Sirivan Nuokkhangplu) มีอยู่แล้วในระบบ รหัสนักเรียน 250400119 ไม่สามารถสร้างซ้ำได้'])
    });


    it('should find student in dashboard using stored data', () => {
        loginAndGoToDashboard();
        const student = Cypress.env('STUDENT_DATA');
        expect(student).to.exist;
        expect(student.id, 'Student ID should be defined').to.exist;

        getAndType('input[placeholder="ค้นหา"]', student.id);
        cy.wait(1000);

        cy.contains('td', student.id)
            .should('be.visible')
            .parent('tr')
            .click();
        getInputByLabelAndExpect('ชื่อ (ไทย)', student.firstNameTH);
        getInputByLabelAndExpect('นามสกุล (ไทย)', student.lastNameTH);
        getInputByLabelAndExpect('ชื่อ (อังกฤษ)', student.firstNameEN);
        getInputByLabelAndExpect('นามสกุล (อังกฤษ)', student.lastNameEN);
    });
})