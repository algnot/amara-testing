export const getAndType = (selector: string, text: string) => {
    cy.get(selector)
        .type(text, { delay: 50 })
        .should('have.value', text);
}


export const getAndExpectContain = (selector: string, texts: string[]) => {
    cy.get(selector).then(($el) => {
        texts.forEach((text) => {
            expect($el.text()).to.contain(text)
        })
        expect($el.text()).to.not.be.empty
    })
}

export const getAndExpectEqual = (selector: string, texts: string[]) => {
    cy.get(selector).then(($el) => {
        texts.forEach((text) => {
            expect($el.text()).to.equal(text)
        })
        expect($el.text()).to.not.be.empty
    })
}

export const getInputByLabelAndExpect = (labelText: string, text: string) => {
    cy.contains('label', labelText)
        .parent()
        .find('input')
        .should('be.visible')
        .and('have.value', text)
        .then(($input) => {
            const actualValue = $input.val()
            expect(actualValue).to.equal(text)
            expect(actualValue).to.not.be.empty
        })
}

