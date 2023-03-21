const { AuthenticationError } = require('apollo-server-express');
const { User, Ticket, Comment, Feedback } = require('../models');
const { signToken } = require('../utils/auth');
require('dotenv').config({ path: __dirname + '/../.env' });

const resolvers = {
    Query: {
        // get Ticket by its ID
        getTicketById: async (parent, { ticketId, userType }) => {

            if (userType == "Agent") {
                return await Ticket.findOne({ _id: ticketId }).populate('users').populate({ path: 'comments', populate: { path: 'creator' } });
            } else {
                return await Ticket.findOne({ _id: ticketId }).populate('users').populate({ path: 'comments', select: ["message", "createdAt", "creator"], populate: { path: 'creator' } });
            }
        },

        // get Tickets by userId and Status
        getTicketsByUserId: async (parent, { userId, status }) => {
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
        },

        //updateTicketStatus
        updateTicketStatus: async (parent, { ticketId, status }, context) => {
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
        },


        // createComment
        createComment: async (parent, { ticketId, message, userId }, context) => {
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
        },


        //createNote
        createNote: async (parent, { commentId, notes }) => {
            return await Comment.findOneAndUpdate(
                { _id: commentId },
                {
                    note: { notes }
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).populate("creator");
        },

        //updateNote
        updateNote: async (parent, { commentId, notes }, context) => {
            return await Comment.findOneAndUpdate(
                { _id: commentId },
                { note: { notes } },
                {
                    new: true,
                    runValidators: true,
                }
            ).populate("creator");
        },

        //deleteNote
        deleteNote: async (parent, { commentId, notes }, context) => {
            try {
                const comment = await Comment.findById(commentId).populate("creator");

                if (!comment) {
                    throw new Error("Comment not found");
                }
                comment.note = undefined;
                await comment.save();
                return comment;
            } catch (err) {
            }
        },

        //login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                const token = 0;
                return { token, user };
            }

            const correctPw = await user.comparePassword(password);

            if (!correctPw) {
                const token = 0;
                return { token, user };
            }

            const token = signToken(user);

            return { token, user };
        },

        createUser: async (parent, { firstName, lastName, password, email }) => {
            const user = await User.create({ firstName, lastName, password, email });
            const token = signToken(user);
            return { token, user };
        },

        //submit feedback
        createFeedback: async (parent, { ticketId , feedbackText, rating })  => {
            const responseStatus = "Submitted";
            const feedback = await Feedback.create({ticketId , feedbackText, rating, responseStatus })
            return feedback;
        }

    }
}


module.exports = resolvers;
