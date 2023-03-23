import { gql } from "@apollo/client";

export const GET_TICKET_BY_ID = gql`
    query getTicketById($ticketId: ID!, $userType: String!) {
        getTicketById(ticketId: $ticketId, userType: $userType) {
            _id
            title
            issueType
            priority
            status
            createdAt
            closedAt
            feedback {
                _id
            }
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

export const GET_TICKETS_BY_USER_ID = gql`
    query getTicketsByUserId($userId: ID, $status: String) {
        getTicketsByUserId(userId: $userId, status: $status) {
                _id
                title
                issueType
                priority
                status
                createdAt
                closedAt
                feedback {
                    _id
                }
               
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