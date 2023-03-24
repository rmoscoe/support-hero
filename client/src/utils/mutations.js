import { gql } from "@apollo/client";

export const CREATE_TICKET = gql`
    mutation createTicket($title: String!, $description: String!, $issueType: String!, $priority: String!) {
        createTicket(title: $title, description: $description, issueType: $issueType, priority: $priority) {
            _id
            title
            issueType
            priority
            status
            createdAt
            users {
                _id
                firstName
                lastName
                type
            }
            description
        }
    }
`;

export const UPDATE_TICKET_STATUS = gql`
    mutation updateTicketStatus($ticketId: ID!, $status: String!, $closedAt: String) {
        updateTicketStatus(ticketId: $ticketId, status: $status, closedAt: $closedAt) {
                _id
                title
                priority
                status
                createdAt
                users {
                    _id
                    firstName
                    lastName
                    type
                }
                description
                comments {
                    _id
                    createdAt
                    creator {
                        _id
                        firstName
                        type
                    }
                    message
                    note {
                        notes
                    }
                }
            
        }
    }
`;

export const CREATE_COMMENT = gql`
    mutation createComment($ticketId: ID!, $message: String!, $userId: ID!) {
        createComment(ticketId: $ticketId, message: $message, userId: $userId) {
            _id
            createdAt
            creator {
                _id
                firstName
                type
            }
            message
        }
    }
`;

export const CREATE_NOTE = gql`
    mutation createNote($commentId: ID!, $notes: String!) {
        createNote(commentId: $commentId, notes: $notes) {
            _id
            createdAt
            creator {
                _id
                firstName
                type
            }
            message
            note {
                notes
            }
        }
    }
`;

export const UPDATE_NOTE = gql`
    mutation updateNote($commentId: ID!, $notes: String!) {
        updateNote(commentId: $commentId, notes: $notes) {
            _id
            createdAt
            creator {
                _id
                firstName
                type
            }
            message
            note {
                notes
            }
        }
    }
`;

export const DELETE_NOTE = gql`
    mutation deleteNote($commentId: ID!, $notes: String!) {
        deleteNote(commentId: $commentId, notes: $notes) {
            _id
            createdAt
            creator {
                _id
                firstName
                type
            }
            message
        }
    }
`;

export const LOGIN = gql`
    mutation login($email: String!, $password: String!, $redirectUrl: String, $feedback: Boolean) {
        login(email: $email, password: $password, redirectUrl: $redirectUrl, feedback: $feedback) {
            token
            user {
                _id
                firstName
                lastName
                type
                email
            }
        }
    }
`;

export const CREATE_USER = gql`
    mutation createUser($firstName: String, $lastName: String, $email: String, $password: String) {
        createUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
            token
            user {
                _id
                firstName
                lastName
                type
                email
            }
        }
    }
`;

export const RESEND_EMAIL = gql`
    mutation resendEmail($emailId: ID!, $verificationToken: String) {
        resendEmail(emailId: $emailId, verificationToken: $verificationToken) {
            trigger
            sentTo
            sentToUser {
                firstName
                lastName
                type
            }
            accepted
            response
            messageId
            messageURL
            subject
            body
        }
    }
`;

export const CREATE_FEEDBACK = gql`
    mutation createFeedback($ticketId: ID!,  $rating: String!,  $feedbackText: String!) {
        createFeedback(ticketId: $ticketId, rating: $rating, feedbackText: $feedbackText) {
            _id
            feedbackText
            rating
            createdAt
            ticketId {
                _id
                
            }
            
        }
    }
`;