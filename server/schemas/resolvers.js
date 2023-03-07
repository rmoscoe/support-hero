const { AuthenticationError } = require('apollo-server-express');
const { User, Ticket, Comment } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        // get Ticket by its ID
        getTicketbyId: async (parent, {ticketId}) => {
        return Ticket.findOne({ticketId}),populate(comments);
      },
      //get Tickets by userId


      // get Tickets by userId and Status


      me: async (parent, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id }).populate('thoughts');
        }
        throw new AuthenticationError('You need to be logged in!');
      },
    },


    Mutation : {
        createTicket

    }
}


module.exports = resolvers;
