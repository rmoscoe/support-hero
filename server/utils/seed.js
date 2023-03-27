const MAX_DATE_RANGE = 30 * 24 * 60 * 60 * 1000;  // 30 days
const fs = require('fs').promises;
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
    const password = 'Password1!'; 
    const email = faker.internet.email(firstName, lastName, "supporthero.com").toLowerCase();

    const agent = new User({
        firstName,
        lastName,
        password,
        type: "Agent",
        email,
    });

    return await agent.save();
}

const createCustomer = async () => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();
    const password = 'Password1!'; 
    const email = faker.internet.email(firstName, lastName).toLowerCase();

    const user = new User({
        firstName,
        lastName,
        password,
        type: "Customer",
        email,
    });

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

    return customer;
};

const createTicket = async (ticketUsers) => {
    const title = faker.lorem.words(3);
    const description = faker.lorem.paragraph();
    const issueType = faker.helpers.arrayElement(['Technical', 'Account-related', 'Bug Report', 'Feature Request'], 1);
    const priority = faker.helpers.arrayElement(['Low', 'Medium', 'High'], 1);
    const status = faker.helpers.arrayElement(['Open', 'Pending Agent Response', 'Pending Customer Response', 'Closed'], 1);
    const comments = [];

    let minDate = new Date() - MAX_DATE_RANGE;
    for (let i = 0; i < 3; i++) {
        const comment = await createComment(ticketUsers[i % 2]._id, minDate);
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
    const userIds = ticketUsers.map(user => user._id);

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

    const ticketData = await ticket.save();

    const html = ticketCreatedHtml(ticketUsers[0].firstName, ticket._id, ticket.title, ticket.issueType, ticket.priority, ticket.description);
    const emailInfo = await sendEmail(ticketUsers[0].email, `Ticket #${ticket._id}`, html);
    const response = emailInfo.info.response.split(" ")[0].concat(" ").concat(emailInfo.info.response.split(" ")[1]);

    const emailRecord = await Email.create({
        trigger: "Create Ticket",
        sentTo: ticketUsers[0].email,
        sentToUser: ticketUsers[0]._id,
        accepted: emailInfo.info.accepted[0] ? true : false,
        response: response,
        messageId: emailInfo.info.messageId,
        messageURL: emailInfo.messageURL,
        subject: `Ticket #${ticket._id}`,
        body: html
    });

    const ticketUsersObj = {};
    if (ticketUsers[0].type === "Agent") {
        ticketUsersObj.agent = ticketUsers[0];
        ticketUsersObj.customer = ticketUsers[1];
    } else {
        ticketUsersObj.customer = ticketUsers[0];
        ticketUsersObj.agent = ticketUsers[1];
    }

    comments.forEach(async (comment) => {
        if (comment.creator === ticketUsersObj.agent._id) {
            const html = commentAddedByAgentHtml(ticketUsersObj.customer.firstName, ticketData._id, ticketData.status, ticketUsersObj.agent.firstName, comment.createdAt, comment.message);
            const emailInfo = await sendEmail(ticketUsersObj.customer.email, `Update Regarding Ticket #${ticketData._id}`, html);
            const response = emailInfo.info.response.split(" ")[0].concat(" ").concat(emailInfo.info.response.split(" ")[1]);

            const emailRecord = await Email.create({
                trigger: "Comment Added by Agent",
                sentTo: ticketUsersObj.customer.email,
                sentToUser: ticketUsersObj.customer._id,
                accepted: emailInfo.info.accepted[0] ? true : false,
                response: response,
                messageId: emailInfo.info.messageId,
                messageURL: emailInfo.messageURL,
                subject: `Update Regarding Ticket #${ticketData._id}`,
                body: html
            });
        } else if (comment.creator === ticketUsersObj.customer._id) {
            const html = commentAddedByCustomerHtml(ticketUsersObj.agent.firstName, ticketData._id, ticketData.status, ticketUsersObj.customer.firstName, comment.createdAt, comment.message);
            const emailInfo = await sendEmail(ticketUsersObj.agent.email, `Customer Commented on Ticket #${ticketData._id}`, html);
            const response = emailInfo.info.response.split(" ")[0].concat(" ").concat(emailInfo.info.response.split(" ")[1]);

            const emailRecord = await Email.create({
                trigger: "Comment Added by Customer",
                sentTo: ticketUsersObj.agent.email,
                sentToUser: ticketUsersObj.agent._id,
                accepted: emailInfo.info.accepted[0] ? true : false,
                response: response,
                messageId: emailInfo.info.messageId,
                messageURL: emailInfo.messageURL,
                subject: `Customer Commented on Ticket #${ticketData._id}`,
                body: html
            });
        } else {
            console.error("Cannot Identify User Type of Comment Creator");
        }
    });

    if (ticket.status === "Closed") {
        const html = ticketClosedHtml(ticketUsersObj.customer.firstName, ticketData._id);
        const emailInfo = await sendEmail(ticketUsersObj.customer.email, `Ticket ${ticketData._id} Closed`, html);
        const response = emailInfo.info.response.split(" ")[0].concat(" ").concat(emailInfo.info.response.split(" ")[1]);

        const emailRecord = await Email.create({
            trigger: "Ticket Closed",
            sentTo: ticketUsersObj.customer.email,
            sentToUser: ticketUsersObj.customer._id,
            accepted: emailInfo.info.accepted[0] ? true : false,
            response: response,
            messageId: emailInfo.info.messageId,
            messageURL: emailInfo.messageURL,
            subject: `Ticket ${ticketData._id} Closed`,
            body: html
        });
    }

    return ticket;
};

const createComment = async (user, minDate) => {
    const currentDate = new Date();
    const message = faker.lorem.sentences(2);
    const creator = user._id;
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
        await Email.deleteMany({});
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
        console.log('Creating customers. This may take up to a minute...');
        for (let i = 0; i < 20; i++) {
            const customer = await createCustomer();
            customers.push(customer);
        }
        console.log('Customers created!\n--------------------\n');

        // For all customers, create tickets with comments and assign them to agents
        // This adds two tickets per customer
        console.log('Creating ticket and Comment data. This may take a few minutes...');
        for (let i = 0; i < customers.length; i++) {
            const customer = customers[i];

            for (let j = 0; j < 2; j++) {
                const randomAgent = agents[Math.floor(Math.random() * agents.length)];

                const ticketUsers = [customer, randomAgent];
                const ticket = await createTicket(ticketUsers);
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
        await fs.writeFile('userData.json', JSON.stringify([...agents, ...customers], null, 4), (err) => {
            if (err) throw err;
            console.log('User data written to file!');
        });
    } catch (err) {
        console.error(err);
        connection.close();
        console.log('Connection closed on error.');
    }
    process.exit(0);
});