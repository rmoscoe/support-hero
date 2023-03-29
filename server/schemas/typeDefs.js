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
        issueType: String
        priority: String
        status: String
        createdAt: String
        closedAt: String
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
        subject: String
        body: String
    }
    type ChatMessage {
        _id: ID!
        message: String
        userId: User
        createdAt: String
    }
    type ChatRoom {
        _id: ID!
        ticketId: Ticket
        roomName: String
        users: [User]
        createdAt: String
        messages: [ChatMessage]
    }
    
    type Query {
        getTicketById(ticketId: ID!, userType: String!): Ticket
        getTicketsByUserId(userId: ID, status: String): [Ticket]
        getEmailById(emailId: ID!): Email
        getEmailsByTrigger(trigger: String!, start: String, end: String): [Email]
        getEmailsByDate(start: String, end: String): [Email]
        getChatRoomByTicketId(ticketId: ID!): ChatRoom
    }

    type Mutation {
        createTicket(title: String!, description: String!, issueType: String!, priority: String!): Ticket
        updateTicketStatus(ticketId: ID!, status: String!, closedAt: String): Ticket
        createComment(ticketId: ID!, message: String!, userId: ID!): Comment
        createNote(commentId: ID!, notes: String!): Comment
        updateNote(commentId: ID!, notes: String!): Comment
        deleteNote(commentId: ID!, notes: String!): Comment
        login(email: String!, password: String!, redirectUrl: String, feedback: Boolean): Auth
        createUser(firstName: String, lastName: String, password: String, email: String): Auth
        createFeedback(ticketId: ID!,rating: String!,feedbackText: String!): Feedback
        createEmail(trigger: String!, sentTo: String!, sentToUser: ID!, accepted: Boolean!, response: String!, messageId: String!, messageURL: String!, subject: String!, body: String!): Email
        deleteEmail(emailId: String!): Email
        createChatMessage(roomId: ID!, userId: ID!, message: String!) : ChatMessage
    }
`

module.exports = typeDefs;