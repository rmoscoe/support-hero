const connection = require("../config/connection");
const { Comment, Ticket, User } = require("../models");
const { createRandomUser } = require("./userData");

connection.on("error", (err) => err);

connection.once("open", async () => {
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Comment.deleteMany({});

    const users = [];

    for (let i = 0; i < 20; i++) {
        const user = createRandomUser();
        users.push(user);
    }

    const userResults = await User.collection.insertMany(users);
    userResults[0] ? users.forEach(user => console.log(user.email, user.password)) : console.error("Failed to seed users.");

    // TODO: Write functionality to seed Tickets
    // TODO: Write functionality to iterate through seeded Tickets and add each ticket to the tickets array for each user
    // TODO: Write functionality to seed Comments

    process.exit(0);
});