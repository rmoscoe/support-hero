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
                feedbackText
                rating
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
                feedbackText
                rating
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

export const GET_CHATROOM_BY_TICKET_ID = gql`
    query getChatRoomByTicketId($ticketId: ID!) {
        getChatRoomByTicketId(ticketId: $ticketId) {
            _id
            ticketId {
                title
            }
            roomName
            users {
                _id
                firstName
                lastName
                type
            }
            createdAt
            messages {
                _id
                message
                createdAt
                userId {
                    _id
                    firstName
                    type
                }
            }
        }
    }
`;