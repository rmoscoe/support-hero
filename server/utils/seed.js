const fs = require('fs');
const faker = require('@faker-js/faker');
const connection = require("../config/connection");
const { Comment, Ticket, User } = require("../models");

const createUser = async (type) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const password = faker.internet.password(8, false, /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,32})/);
    const email = faker.internet.email().toLowerCase();

    const user = new User({
        firstName,
        lastName,
        password,
        type,
        email,
    });

    await user.save();

    // Get a copy of the saved user and return the raw password
    // this is only for the faker data for testing purposes
    const encryptedUser = await user.findById(user._id);
    const unencryptedUser = encryptedUser.toObject({ getters: true });
    unencryptedUser.password = password;

    return unencryptedUser;
};

const createTicket = async (userIds) => {
    const title = faker.lorem.words(3);
    const description = faker.lorem.paragraph();
    const priority = faker.random.arrayElement(['Low', 'Medium', 'High']);
    const status = faker.random.arrayElement(['Open', 'Pending Agent Response', 'Pending Customer Response', 'Closed']);
    const comments = [];

    for (let i = 0; i < 3; i++) {
        const comment = await createComment(userIds[ i % 2 ]);
        comments.push(comment._id);
    }

    const ticket = new Ticket({
        title,
        description,
        priority,
        status,
        users: userIds,
        comments
    });

    await ticket.save();

    return ticket;
};

const createComment = async (userId) => {
    const message = faker.lorem.sentences(2);
    const creator = userId;
    const note = {
        notes: faker.lorem.sentences(1),
    };

    const comment = new Comment({
        message,
        creator: userId,
        note,
    });

    return await comment.save();
};

const seedData = async () => {
    await connection();
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Comment.deleteMany({});

    const agents = [];
    const customers = [];

    for (let i = 0; i < 5; i++) {
        const agent = await createUser('Agent');
        agents.push(agent);
    }

    for (let i = 0; i < 20; i++) {
        const customer = await createUser('Customer');
        customers.push(customer);
    }

    for (let i = 0; i < customer.length; i++) {
        const customerId = customers[i]._id;
        const randomAgentId = agents[Math.floor(Math.random() * agents.length)]._id;

        userIds = [customerId, randomAgentId];
        await createTicket(userIds);
    }

    connection.close();
};

seedData();
