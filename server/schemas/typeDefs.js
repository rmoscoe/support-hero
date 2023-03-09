const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        password: String!
        type: String
        email: String!
        tickets: [Ticket]
    }

    type Ticket {
        _id: ID!
        title: String!
        description: String!
        priority: String!
        status: String
        createdAt: Date!
        users: [User]
        comments: [Comment]
    }

    type Note {
        _id: ID!
        notes: String!
        createdAt: Date
    }

    type Comment {
        _id: ID!
        message: String!
        createdAt: Date
        creator: User!
        note: Note
    }

    type Query {
        getTicketById: Ticket
        getTicketsByUserId(userId: ID!): [Ticket]
        getTicketsByStatus(userId: ID!, status: String!): [Ticket]
        me: User
    }

    type Mutation {
        createTicket(ticket: String!, description: String!, priority: String!): Ticket
        updateTicketStatus(ticketId: ID!, status: String!): Ticket
        createComment(ticketId: ID!, message: String!, userId: ID!): Comment
        createNote(commentId: ID!, notes: String!): Comment
        updateNote(commentId: ID!, notes: String!): Comment
        deleteNote(commentId: ID!, notes: String!): Comment
        login(email: String!, password: String!): Auth
        createUser(firstName: String!, lastName: String!, password: String!, email: String!): Auth
    }
`

module.exports = typeDefs;