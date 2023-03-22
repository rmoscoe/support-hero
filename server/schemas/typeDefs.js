const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        firstName: String
        lastName: String
        password: String
        type: String
        email: String
    }
    type Ticket {
        _id: ID!
        title: String
        description: String
        priority: String
        status: String
        createdAt: String
        users: [User]
        comments: [Comment]
        feedback: Feedback
    }
    type Note {
        notes: String
        createdAt: String
    }
    type Comment {
        _id: ID!
        message: String
        createdAt: String
        creator: User
        note: Note
    }
    type Feedback {
        _id: ID!
        feedbackText: String
        createdAt: String
        rating: String
        ticketId: Ticket
    }
    type Auth {
        token: ID!
        user: User
    } 
    type Email {
        _id: ID!
        trigger: String
        sentAt: String
        sentTo: String
        sentToUser: User
        accepted: Boolean
        response: String
        messageId: String
        messageURL: String
    }
    type Query {
        getTicketById(ticketId: ID!, userType: String!): Ticket
        getTicketsByUserId(userId: ID, status: String): [Ticket]
        getEmailById(emailId: ID!): Email
        getEmailsByTrigger(trigger: String!, sentAt: String): [Email]
        getEmailsByDate(start: String, end: String): [Email]
    }
    type Mutation {
        createTicket(title: String!, description: String!, priority: String!): Ticket
        updateTicketStatus(ticketId: ID!, status: String!): Ticket
        createComment(ticketId: ID!, message: String!, userId: ID!): Comment
        createNote(commentId: ID!, notes: String!): Comment
        updateNote(commentId: ID!, notes: String!): Comment
        deleteNote(commentId: ID!, notes: String!): Comment
        login(email: String!, password: String!): Auth
        createUser(firstName: String, lastName: String, password: String, email: String): Auth

        createFeedback(ticketId: ID!,rating: String!,feedbackText: String!): Feedback

        createEmail(trigger: String!, sentTo: String!, sentToUser: ID!, accepted: Boolean!, response: String!, messageId: String!, messageURL: String!): Email
        deleteEmail(messageId: String!): Email
    }
`

module.exports = typeDefs;