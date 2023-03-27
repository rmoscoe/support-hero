const { AuthenticationError } = require('apollo-server-express');
const { User, Ticket, Comment, Feedback } = require('../models');
const Email = require("../models/Email");
const { signToken } = require('../utils/auth');
const dateFormat = require("../utils/helpers");
const { customerSignupHtml, ticketCreatedHtml, commentAddedByAgentHtml, commentAddedByCustomerHtml, ticketClosedHtml } = require("../utils/emailTemplates");
const { sendEmail } = require("../config/transporter");
require('dotenv').config({ path: __dirname + '/../.env' });
const { sendEmail } = require('../config/transporter')
const {customerSignupHtml} = require('../utils/emailTemplates')

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
                                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
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
                                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
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
                                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
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
        getEmailsByDate: async (parent, { start, end }) => {
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
                                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
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
                                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
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
                                { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
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
        },
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

            const html = ticketCreatedHtml(ticket.users[1].firstName, ticket._id, ticket.title, ticket.issueType, ticket.priority, ticket.description);
            const emailInfo = await sendEmail(ticket.users[1].email, `Ticket #${ticket._id}`, html);
            const response = emailInfo.info.response.split(" ")[0].concat(" ").concat(emailInfo.info.response.split(" ")[1]);

            const emailRecord = await Email.create({
                trigger: "Create Ticket",
                sentTo: ticket.users[1].email,
                sentToUser: ticket.users[1]._id,
                accepted: emailInfo.info.accepted[0] ? true : false,
                response: response,
                messageId: emailInfo.info.messageId,
                messageURL: emailInfo.messageURL,
                subject: `Ticket #${ticket._id}`,
                body: html
            });

            return ticket;
        },

        //updateTicketStatus
        updateTicketStatus: async (parent, { ticketId, status, closedAt }, context) => {
            const ticket = await Ticket.findOneAndUpdate(
                { _id: ticketId },
                {
                    status: status,
                    closedAt: closedAt
                },
                {
                    new: true,
                }
            ).populate("users").populate({ path: "comments", populate: { path: "creator" } });

            if (status === "Closed") {
                const html = ticketClosedHtml(ticket.users[0].firstName, ticket._id);
                const emailInfo = await sendEmail(ticket.users[0].email, `Ticket ${ticket._id} Closed`, html);
                const response = emailInfo.info.response.split(" ")[0].concat(" ").concat(emailInfo.info.response.split(" ")[1]);

                const emailRecord = await Email.create({
                    trigger: "Ticket Closed",
                    sentTo: ticket.users[0].email,
                    sentToUser: ticket.users[0]._id,
                    accepted: emailInfo.info.accepted[0] ? true : false,
                    response: response,
                    messageId: emailInfo.info.messageId,
                    messageURL: emailInfo.messageURL,
                    subject: `Ticket ${ticket._id} Closed`,
                    body: html
                });
            }
            return ticket;
        },

        // createComment
        createComment: async (parent, { ticketId, message, userId }, context) => {
            const comment = await Comment.create(
                {
                    message,
                    creator: userId
                }
            );

            const ticket = await Ticket.findOneAndUpdate(
                { _id: ticketId },
                { $addToSet: { comments: comment._id } }
            ).populate("users");

            const agent = ticket.users.find(user => user.type === "Agent");
            const customer = ticket.users.find(user => user.type === "Customer");

            if (context.user.type === "Agent") {
                const html = commentAddedByAgentHtml(customer.firstName, ticket._id, ticket.status, agent.firstName, comment.createdAt, comment.message);
                const emailInfo = await sendEmail(customer.email, `Update Regarding Ticket #${ticket._id}`, html);
                const response = emailInfo.info.response.split(" ")[0].concat(" ").concat(emailInfo.info.response.split(" ")[1]);

                const emailRecord = await Email.create({
                    trigger: "Comment Added by Agent",
                    sentTo: customer.email,
                    sentToUser: customer._id,
                    accepted: emailInfo.info.accepted[0] ? true : false,
                    response: response,
                    messageId: emailInfo.info.messageId,
                    messageURL: emailInfo.messageURL,
                    subject: `Update Regarding Ticket #${ticket._id}`,
                    body: html
                });
            } else if (context.user.type === "Customer") {
                const html = commentAddedByCustomerHtml(agent.firstName, ticket._id, ticket.status, customer.firstName, comment.createdAt, comment.message);
                const emailInfo = await sendEmail(agent.email, `Customer Commented on Ticket #${ticket._id}`, html);
                const response = emailInfo.info.response.split(" ")[0].concat(" ").concat(emailInfo.info.response.split(" ")[1]);

                const emailRecord = await Email.create({
                    trigger: "Comment Added by Customer",
                    sentTo: agent.email,
                    sentToUser: agent._id,
                    accepted: emailInfo.info.accepted[0] ? true : false,
                    response: response,
                    messageId: emailInfo.info.messageId,
                    messageURL: emailInfo.messageURL,
                    subject: `Customer Commented on Ticket #${ticket._id}`,
                    body: html
                });
            } else {
                console.error("Cannot Identify User Type of Comment Creator");
            }

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
            // const html="/verifyUserEmail/" + email + "/" + token;
            const link = "https://dry-fjord-88699.herokuapp.com/" + "verifyUserEmail" + firstName + "/" + token;
            const html = customerSignupHtml(firstName,link );
            sendEmail(email,"Verify Email",html);
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


        // delete email
        deleteEmail: async (parent, { emailId }) => {
            const email = await Email.deleteOne({ _id: emailId });
            return email;
        },

        //Email verification
        verifyEmail: async (parent, {email,token}) => {
            await User.findOne({email},function (err,result) {
                try {
                    const secret = process.env.JWT_SECRET;

                const decode = jwt.verify(token,secret);

                console.log(decode)

                User.updateOne({email},
                    {
                        $set : {
                            isVerified: true
                        }
                    })
                return true;

                } catch (err) 
                 { return false }

            })
        }

    }
}


module.exports = resolvers;
