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

    // Create agents
    console.log('Creating agents...');
    for (let i = 0; i < 5; i++) {
        const agent = await createUser('Agent');
        agents.push(agent);
    }
    console.log('Agents created!');
    
    // Create customers
    console.log('Creating customers...');
    for (let i = 0; i < 20; i++) {
        const customer = await createUser('Customer');
        customers.push(customer);
    }
    console.log('Customers created!');

    // For all customers, create tickets with comments and assign them to agents
    console.log('Creating ticket and Comment data...');
    for (let i = 0; i < customers.length; i++) {
        const customerId = customers[i]._id;
        const randomAgentId = agents[Math.floor(Math.random() * agents.length)]._id;

        userIds = [customerId, randomAgentId];
        await createTicket(userIds);
    }
    console.log('Ticket and Comment data created!');

    // Write agent data for reference and close db connection
    fs.writeFile('userData.json', JSON.stringify([...agents, ...customers], 4), (err) => {
        if (err) throw err;
        console.log('USer data written to file!');
        connection.close();
    });

};

seedData();
