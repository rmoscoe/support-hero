import { gql } from "@apollo/client";

export const CREATE_TICKET = gql`
    mutation createTicket($title: String!, $description: String!, $priority: String!) {
        createTicket(title: $title, description: $description, priority: $priority) {
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
        }
    }
`;

export const UPDATE_TICKET_STATUS = gql`
    mutation updateTicketStatus($ticketId: ID!, $status: String!) {
        updateTicketStatus(ticketId: $ticketId, status: $status) {
            _id
            title
            priority
            status
            createdAt
            users {
                _id
                firstName
                lastName
            }
            description
            comments {
                message
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
            comment {
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

export const UPDATE_NOTE = gql`
    mutation updateNote($commendId: ID!, $notes: String!) {
        updateNote(commendId: $commendId, notes: $notes) {
            comment {
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

export const DELETE_NOTE = gql`
    mutation deleteNote($commendId: ID!, $notes: String!) {
        deleteNote(commendId: $commendId, notes: $notes) {
            comment {
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
    }
`;

export const LOGIN = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
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