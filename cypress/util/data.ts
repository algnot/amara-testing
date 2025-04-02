import * as fakerTH from '@faker-js/faker/locale/th';
import * as fakerEN from '@faker-js/faker/locale/en';

export const generateRandomStudentData = () => {
    return {
        firstNameTH: fakerTH.faker.person.firstName(),
        lastNameTH: fakerTH.faker.person.lastName(),
        firstNameEN: fakerEN.faker.person.firstName(),
        lastNameEN: fakerEN.faker.person.lastName(),
    };
};