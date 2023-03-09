import faker from "@faker-js/faker";

function createRandomUser () {
    const email = faker.helpers.unique(faker.internet.email);
    const userTypes = ["Agent", "Customer"];
    const type = userTypes[Math.floor(Math.random() * userTypes.length)];

    return {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: email,
        password: faker.internet.password(8, false, /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,32})/),
        type: type
    }
}

module.exports = createRandomUser;