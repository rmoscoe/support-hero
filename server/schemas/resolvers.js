const { AuthenticationError } = require('apollo-server-express');
const { User, Ticket, Comment, Feedback } = require('../models');
const Email = require("../models/Email");
const { signToken } = require('../utils/auth');
const dateFormat = require("../utils/helpers");
require('dotenv').config({ path: __dirname + '/../.env' });
const { sendEmail } = require('../config/transporter')

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

                }).populate('users').populate('feedback').populate({ path: "comments", populate: { path: "creator" } });
            else
                return await Ticket.find({
                    users: userId,
                }).populate('users').populate('feedback').populate({ path: "comments", populate: { path: "creator" } });

        },

        // get Email by ID
        getEmailById: async (parent, { emailId }) => {
            return await Email.findOne({ _id: emailId }).populate("sentToUser");
        },

        // get Emails by Trigger
        getEmailsByTrigger: async (parent, { trigger, start, end }) => {
            let pipeline = [];
            if (start && end) {
                pipeline = [
                    {
                        $match: {
                            trigger: trigger,
                            sentAt: {
                                $gte: new Date(start),
                                $lte: new Date(end)
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { userId: "$sentToUser" },
                            pipeline: [
                                { $match: { $expr: { $eq: [ "$_id", "$$userId" ] } } },
                                { $project: { _id: 1, firstName: 1, lastName: 1, type: 1 } }
                            ],
                            as: "sentToUser"
                        }
                    }
                ];
            } else if (start) {
                pipeline = [
                    {
                        $match: {
                            trigger: trigger,
                            sentAt: {
                                $gte: new Date(start)
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { userId: "$sentToUser" },
                            pipeline: [
                                { $match: { $expr: { $eq: [ "$_id", "$$userId" ] } } },
                                { $project: { _id: 1, firstName: 1, lastName: 1, type: 1 } }
                            ],
                            as: "sentToUser"
                        }
                    }
                ];
            } else if (end) {
                pipeline = [
                    {
                        $match: {
                            trigger: trigger,
                            sentAt: {
                                $lte: new Date(end)
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { userId: "$sentToUser" },
                            pipeline: [
                                { $match: { $expr: { $eq: [ "$_id", "$$userId" ] } } },
                                { $project: { _id: 1, firstName: 1, lastName: 1, type: 1 } }
                            ],
                            as: "sentToUser"
                        }
                    }
                ];
            } else {
                return await Email.find({
                    trigger: trigger
                }).populate("sentToUser");
            }
            const emailData = await Email.aggregate(pipeline);
            const emails = emailData.map(email => {
                email.sentAt = dateFormat(email.sentAt);
                if (email.sentToUser.length > 0) {
                    email.sentToUser = email.sentToUser[0];
                }
                return email;
            });
            return emails;
        },

        // get Emails by Date
        getEmailsByDate: async (parent, {start, end}) => {
            let pipeline = [];
            if (start && end) {
                pipeline = [
                    {
                        $match: {
                            sentAt: {
                                $gte: new Date(start),
                                $lte: new Date(end)
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { userId: "$sentToUser" },
                            pipeline: [
                                { $match: { $expr: { $eq: [ "$_id", "$$userId" ] } } },
                                { $project: { _id: 1, firstName: 1, lastName: 1, type: 1 } }
                            ],
                            as: "sentToUser"
                        }
                    }
                ];
            } else if (start) {
                pipeline = [
                    {
                        $match: {
                            sentAt: {
                                $gte: new Date(start)
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { userId: "$sentToUser" },
                            pipeline: [
                                { $match: { $expr: { $eq: [ "$_id", "$$userId" ] } } },
                                { $project: { _id: 1, firstName: 1, lastName: 1, type: 1 } }
                            ],
                            as: "sentToUser"
                        }
                    }
                ];
            } else if (end) {
                pipeline = [
                    {
                        $match: {
                            sentAt: {
                                $lte: new Date(end)
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { userId: "$sentToUser" },
                            pipeline: [
                                { $match: { $expr: { $eq: [ "$_id", "$$userId" ] } } },
                                { $project: { _id: 1, firstName: 1, lastName: 1, type: 1 } }
                            ],
                            as: "sentToUser"
                        }
                    }
                ];
            } else {
                return await Email.find().populate("sentToUser");
            }
            const emailData = await Email.aggregate(pipeline);
            const emails = emailData.map(email => {
                email.sentAt = dateFormat(email.sentAt);
                if (email.sentToUser.length > 0) {
                    email.sentToUser = email.sentToUser[0];
                }
                return email;
            });
            return emails;
        }
    },


    Mutation: {
        //create new ticket
        createTicket: async (parent, { title, description, issueType, priority }, context) => {

            const usersDb = await User.find({ type: "Agent" });

            const agentId = usersDb[Math.floor(Math.random() * usersDb.length)]._id;

            let customerId;
            if (context.user) {
                customerId = context.user._id;
            } else {
                customerId = process.env.CUSTOMER_ID;
            }

            const users = [agentId, customerId]

            const ticket = await (await Ticket.create({ title, description, issueType, priority, users })).populate("users");

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
        login: async (parent, { email, password, redirectUrl, feedback }) => {
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

            const token = signToken(user, redirectUrl);

            return { token, user, feedback };
        },

        createUser: async (parent, { firstName, lastName, password, email }) => {
            const user = await User.create({ firstName, lastName, password, email });
            const token = signToken(user);
            const html="/verifyUserEmail/" + email + "/" + token;
            sendEmail(email,"Verify Email by clicking this link",html)
            return { token, user };
        },

        //submit feedback
        createFeedback: async (parent, { ticketId, feedbackText, rating }) => {
            const feedback = await Feedback.create({ ticketId, feedbackText, rating });
            const ticket = await Ticket.findOneAndUpdate(
                { _id: ticketId },
                {
                    feedback: feedback._id
                })
            return feedback;
        },

        // create email
        createEmail: async (parent, { trigger, sentTo, sentToUser, accepted, response, messageId, messageURL, subject, body }) => {
            const email = await Email.create({
                trigger,
                sentTo,
                sentToUser,
                accepted,
                response,
                messageId,
                messageURL,
                subject, 
                body
            });
            return email;
        },

        // delete email
        deleteEmail: async (parent, { emailId }) => {
            const email = await Email.deleteOne({ _id: emailId });
            return email;
        }

    }
}


module.exports = resolvers;
