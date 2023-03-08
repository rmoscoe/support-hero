const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID!
        firstName: String!
        lastName: String!
        username: String!
        type: String!
        email: String!
        ticketList: [Ticket]
    }

    type Ticket {
        _id: ID!
        title: String!
        description: String!
        priority: String!
        status: String!
        createdAt: Date! 
        userList: [User]!
        commentList: [Comment]
        noteList: [Note]
    }

    type Query {

    }

    type Mutation {

    }
`

module.exports = typeDefs;