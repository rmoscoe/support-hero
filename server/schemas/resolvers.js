const { AuthenticationError } = require('apollo-server-express');
const { User, Ticket, Comment } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        // get Ticket by its ID
        getTicketById: async (parent, {ticketId}) => {
        return Ticket.findOne({ticketId}),populate(comments);
      },

      //get Tickets by userId
      getTicketsByUserId: async (parent, {userId}) => {
        return Ticket.find({
            users : userId
        });
      },

      // get Tickets by userId and Status
      getTicketsByStatus: async (parent, {userId , status}) => {
        return Ticket.find({
            users : userId,
            status : status
        });
      },



      me: async (parent, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id }).populate('thoughts');
        }
        throw new AuthenticationError('You need to be logged in!');
      },
    },


    Mutation : {
        //create new ticket
        createTicket: async (parent, {title, description,priority}, context) => {

            const usersDb = User.find({type : "Agent"});

            const agentId = usersDb[Math.floor(Math.random * users.length)]._id;

            const customerId = context.user._id ;

            const users = [agentId, customerId]

            if (context.user) {
             const ticket = Ticket.create({title, description,priority, users});

             await User.finOneAndUpdate(
                {_id: agentId},
                { $addToSet : { tickets : ticket._id}}
             )

             return ticket;
            }
            throw new AuthenticationError('You need to be logged in!');

        }

    }
}


module.exports = resolvers;
