const { AuthenticationError } = require('apollo-server-express');
const { User, Ticket, Comment } = require('../models');
const { signToken } = require('../utils/auth');
require('dotenv').config({ path: __dirname + '/../.env' });

const resolvers = {
    Query: {
        // get Ticket by its ID
        getTicketById: async (parent, { ticketId, userType }) => {

            if (userType == "Agent") {
                return await Ticket.findOne({ _id: ticketId }).populate('users').populate({ path: 'comments', populate: { path: 'creator' } });
            } else {
                // TODO : if customer is viewing the ticket, dont show notes section
                return await Ticket.findOne({ _id: ticketId }).populate('users').populate({ path: 'comments', select: ["message", "createdAt", "creator"], populate: { path: 'creator' } });
            }
        },

        // get Tickets by userId and Status
        getTicketsByUserId: async (parent, { userId, status }) => {
            console.log("in resolver")
            if (status)
                return await Ticket.find({
                    users: userId,
                    status: status

                }).populate('users').populate({ path: "comments", populate: { path: "creator" } });
            else
                return await Ticket.find({
                    users: userId,
                }).populate('users').populate({ path: "comments", populate: { path: "creator" } });

        },
    },


    Mutation: {
        //create new ticket
        createTicket: async (parent, { title, description, priority }, context) => {

            const usersDb = await User.find({ type: "Agent" });

            const agentId = usersDb[Math.floor(Math.random() * usersDb.length)]._id;

            let customerId;
            if (context.user) {
                customerId = context.user._id;
            } else {
                customerId = process.env.CUSTOMER_ID;
            }

            const users = [agentId, customerId]

            const ticket = await (await Ticket.create({ title, description, priority, users })).populate("users");

            return ticket;
            // return Ticket.create({title, description, priority, users});
            // }
            // throw new AuthenticationError('You need to be logged in!');

        },

        //updateTicketStatus
        updateTicketStatus: async (parent, { ticketId, status }, context) => {
            // if (context.user) {
            const ticket = await Ticket.findOneAndUpdate(
                { _id: ticketId },
                {
                    status: status
                },
                {
                    new: true,
                }
            ).populate("users").populate({ path: "comments", populate: { path: "creator" } });
            return ticket;
            // }
            // throw new AuthenticationError('You need to be logged in!');
        },


        //createComment
        createComment: async (parent, { ticketId, message, userId }, context) => {
            // if (context.user) {
            const comment = await Comment.create(
                {
                    message,
                    creator: userId
                }
            )
            await Ticket.findOneAndUpdate(
                { _id: ticketId },
                { $addToSet: { comments: comment._id } }
            );
            return comment;
            // } 
            // throw new AuthenticationError('You need to be logged in!');
        },


        //createNote
        createNote: async (parent, { commentId, notes }, context) => {
            // if (context.user) {
            return await Comment.findOneAndUpdate(
                { _id: commentId },
                {
                    note: { notes }
                },
                {
                    new: true,
                    runValidators: true,
                }
            );
            // } 
            // throw new AuthenticationError('You need to be logged in!');
        },

        //updateNote
        updateNote: async (parent, { commentId, notes }, context) => {
            // if(context.user){
            return await Comment.findOneAndUpdate(
                { _id: commentId },
                { note: { notes } },
                {
                    new: true,
                    runValidators: true,
                }
            )
            // }
            // throw new AuthenticationError('You need to be logged in!');
        },

        //deleteNote
        deleteNote: async (parent, { commentId, notes }, context) => {
            // if(context.user){
            return await Comment.findOneAndDelete(
                { _id: commentId },
                { note: { notes } },
            )
            // }
            // throw new AuthenticationError('You need to be logged in!');
        },

        //login
        login: async (parent, { email, password }) => {
            console.log("Email: ", email);
            const user = await User.findOne({ email });

            if (!user) {
                const token = 0;
                return { token, user };
                // throw new AuthenticationError('No user found with this email address');
            }

            const correctPw = await user.comparePassword(password);

            if (!correctPw) {
                const token = 0;
                return { token, user };
                // throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            console.log(token)

            return { token, user };
        },

        createUser: async (parent, { firstName, lastName, password, email }) => {
            const user = await User.create({ firstName, lastName, password, email });
            const token = signToken(user);
            return { token, user };
        }
    }
}


module.exports = resolvers;
