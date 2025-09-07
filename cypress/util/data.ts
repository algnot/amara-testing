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

export const getDateInputFormat = (date: Date): string => {
    return `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : date.getMonth() + 1}-${date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()}`
}