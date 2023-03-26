const MAX_DATE_RANGE = 30 * 24 * 60 * 60 * 1000;  // 30 days
const fs = require('fs');
const { faker } = require('@faker-js/faker');
const connection = require("../config/connection");
const { Comment, Ticket, User, Feedback } = require("../models");
const Email = require("../models/Email");
const dateFormat = require("./helpers");
const { customerSignupHtml, ticketCreatedHtml, commentAddedByAgentHtml, commentAddedByCustomerHtml, ticketClosedHtml } = require("./emailTemplates");
const { sendEmail } = require("../config/transporter");

const createAgent = async () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const password = 'Password1!';  //faker.internet.password(8, false, /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,32})/);
    const email = faker.internet.email(firstName, lastName, "supporthero.com").toLowerCase();

    // console.log(firstName, lastName, email, password);

    const user = new User({
        firstName,
        lastName,
        password,
        type: "Agent",
        email,
    });

    return await user.save();
}

const createCustomer = async () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const password = 'Password1!';  //faker.internet.password(8, false, /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,32})/);
    const email = faker.internet.email(firstName, lastName).toLowerCase();

    // console.log(firstName, lastName, email, password);

    const user = new User({
        firstName,
        lastName,
        password,
        type: "Customer",
        email,
    });

    // await user.save();

    // Get a copy of the saved user and return the raw password
    // this is only for the faker data for testing purposes
    // const encryptedUser = await user.findById(user._id);
    // const unencryptedUser = encryptedUser.toObject({ getters: true });
    // unencryptedUser.password = password;

    // return unencryptedUser;
    const customer = await user.save();

    const confirmationURL = `https://https://dry-fjord-88699.herokuapp.com/placeholder`;
    const html = customerSignupHtml(customer.firstName, confirmationURL);
    const emailInfo = await sendEmail(customer.email, "Welcome to Support Hero!", html);
    const response = emailInfo.info.response.split(" ")[0].concat(" ").concat(emailInfo.info.response.split(" ")[1]);

    const emailRecord = await Email.create({
        trigger: "Customer Signup",
        sentTo: customer.email,
        sentToUser: customer._id,
        accepted: emailInfo.info.accepted[0] ? true : false,
        response: response,
        messageId: emailInfo.info.messageId,
        messageURL: emailInfo.messageURL,
        subject: "Welcome to Support Hero!",
        body: html
    });
};

const createTicket = async (userIds) => {
    const title = faker.lorem.words(3);
    const description = faker.lorem.paragraph();
    const issueType = faker.helpers.arrayElement(['Technical', 'Account-related', 'Bug Report', 'Feature Request'], 1);
    const priority = faker.helpers.arrayElement(['Low', 'Medium', 'High'], 1);
    const status = faker.helpers.arrayElement(['Open', 'Pending Agent Response', 'Pending Customer Response', 'Closed'], 1);
    const comments = [];

    let minDate = new Date() - MAX_DATE_RANGE;
    for (let i = 0; i < 3; i++) {
        const comment = await createComment(userIds[i % 2], minDate);
        minDate = new Date(comment.createdAt);
        comments.push(comment);
    }

    // Find earliest comment date
    const latestDate = comments.reduce((maxDate, comment) => {
        const currentDate = new Date(comment.createdAt);
        return currentDate > maxDate ? currentDate : maxDate;
    }, new Date(comments[0].createdAt));

    const ticketCreateDate = faker.datatype.datetime({ max: latestDate, min: new Date() - MAX_DATE_RANGE });

    const closedAt = status === 'Closed' ? new Date(comments[2].createdAt) : undefined;


    const ticket = new Ticket({
        title,
        description,
        issueType,
        priority,
        status,
        createdAt: ticketCreateDate,
        closedAt,
        users: userIds,
        comments
    });

    await ticket.save();

    return ticket;
};

const createComment = async (userId, minDate) => {
    const currentDate = new Date();
    const message = faker.lorem.sentences(2);
    const creator = userId;
    const createdAt = faker.datatype.datetime({ max: currentDate, min: minDate });
    const note = {
        notes: faker.lorem.sentences(1),
    };

    const comment = new Comment({
        message,
        creator,
        createdAt,
        note
    });

    return await comment.save();
};

const createFeedback = async (ticketId, minDate) => {
    const currentDate = new Date();
    const feedbackText = faker.lorem.sentences(1);
    const rating = faker.helpers.arrayElement(['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'], 1);
    const createdAt = faker.datatype.datetime({ max: currentDate, min: minDate });

    const feedback = new Feedback({
        ticketId,
        feedbackText,
        rating,
        createdAt
    });

    return await feedback.save();
}

connection.once("open", async () => {
    try {
        console.log("\n--------------------\n\nConnected to MongoDB database...");

        console.log("Dropping existing data...");
        await User.deleteMany({});
        await Ticket.deleteMany({});
        await Comment.deleteMany({});
        await Feedback.deleteMany({});
        console.log("Existing data dropped.\n--------------------\n");

        const agents = [];
        const customers = [];
        const tickets = [];

        // Create agents
        console.log('Creating agents...');
        for (let i = 0; i < 5; i++) {
            const agent = await createAgent();
            agents.push(agent);
        }
        console.log('Agents created!\n--------------------\n');

        // Create customers
        console.log('Creating customers...');
        for (let i = 0; i < 20; i++) {
            const customer = await createCustomer();
            customers.push(customer);
        }
        console.log('Customers created!\n--------------------\n');

        // For all customers, create tickets with comments and assign them to agents
        // This adds two tickets per customer
        console.log('Creating ticket and Comment data...');
        for (let i = 0; i < customers.length; i++) {
            const customerId = customers[i]._id;

            for (let j = 0; j < 2; j++) {
                const randomAgentId = agents[Math.floor(Math.random() * agents.length)]._id;

                userIds = [customerId, randomAgentId];
                const ticket = await createTicket(userIds);
                tickets.push(ticket);
            }
        }
        console.log('Ticket and Comment data created!\n--------------------\n');

        console.log('Creating feedback data...');
        for (let i = 0; i < tickets.length; i++) {
            if (tickets[i].status === 'Closed' && Math.random() >= 0.5) {
                const earliestDate = tickets[i].comments.reduce((minDate, comment) => {
                    const currentDate = new Date(comment.createdAt);
                    return currentDate < minDate ? currentDate : minDate;
                }, new Date(tickets[i].comments[0].createdAt));

                const feedback = await createFeedback(tickets[i]._id, earliestDate);
                await Ticket.findByIdAndUpdate(tickets[i]._id, { $set: { feedback: feedback._id } });
            }
        }
        console.log('Feedback data created!\n--------------------\n');

        // Write agent data for reference and close db connection
        fs.writeFile('userData.json', JSON.stringify([...agents, ...customers], null, 4), (err) => {
            if (err) throw err;
            console.log('User data written to file!');
            connection.close();
            console.log('Connection closed.\n--------------------\n');
        });
    } catch (err) {
        console.error(err);
        connection.close();
        console.log('Connection closed on error.');
    }
});
