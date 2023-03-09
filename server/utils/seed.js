const connection = require('../config/connection');
const { User, Ticket, Comment } = require('../models');
const faker = require('faker');


const createUser = async (type) => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const password = faker.internet.password(12);
    const email = faker.internet.email().toLowerCase();

    const user = new User({
        firstName,
        lastName,
        password,
        type,
        email
    });

    await user.save();

    return user;
};

const createTicket = async (users) => {
    const title = faker.lorem.words(3);
    const description = faker.lorem.paragraph();
    const priority = faker.random.arrayElement(['Low', 'Medium', 'High']);
    const status = faker.random.arrayElement(['Open', 'Pending Agent Response', 'Pending Customer Response', 'Closed']);
    const comments = [];

    for (let i = 0; i < 3; i++) {
        const comment = await createComment(users);
        comments.push(comment._id);
    }

    const ticket = new Ticket({
        title,
        description,
        priority,
        status,
        users,
        comments
    });

    await ticket.save();

    return ticket;
};

const createComment = async (users) => {
    const message = faker.lorem.sentences(2);
    const creator = users[Math.floor(Math.random() * users.length)]._id;
    const note = {
        notes: faker.lorem.sentences(1)
    };

    const comment = new Comment({
        message,
        creator,
        note
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
        const agent = await createUser('agent');
        agents.push(agent);
    }

    for (let i = 0; i < 20; i++) {
        const customer = await createUser('customer');
        customers.push(customer);
    }

    for (let i = 0; i < 50; i++) {
        const randomUsers = [agents[Math.floor(Math.random() * agents.length)]._id];
        const numCustomers = Math.floor(Math.random() * 4) + 1;

        for (let j = 0; j < numCustomers; j++) {
            const customer = customers[Math.floor(Math.random() * customers.length)];
            randomUsers.push(customer._id);
        }

        await createTicket(randomUsers);
  }

  connection.close();
};

seedData();
