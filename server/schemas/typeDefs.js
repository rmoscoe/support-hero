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
    }
    type Note {
        notes: String
        createdAt: String
        _id: ID!
    }
    type Comment {
        _id: ID!
        message: String
        createdAt: String
        creator: User
        note: Note
    }
    type Auth {
        token: ID!
        user: User
    } 
    type Query {
        getTicketById(ticketId: ID!, userType: String!): Ticket
        getTicketsByUserId(userId: ID!, status: String): [Ticket]
    }
    type Mutation {
        createTicket(title: String!, description: String!, priority: String!): Ticket
        updateTicketStatus(ticketId: ID!, status: String!): Ticket
        createComment(ticketId: ID!, message: String!, userId: ID!): Comment
        createNote(commentId: ID!, notes: String!): Comment
        updateNote(commentId: ID!, notes: String!): Comment
        deleteNote(commentId: ID!, note: ID!): Comment
        login(email: String!, password: String!): Auth
        createUser(firstName: String, lastName: String, password: String, email: String): Auth
    }
`

module.exports = typeDefs;