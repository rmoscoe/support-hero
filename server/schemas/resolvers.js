const { AuthenticationError } = require('apollo-server-express');
const { User, Ticket, Comment } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        // get Ticket by its ID
        getTicketById: async (parent, {ticketId}) => {
            const userData = User.findOne(
                {_id : context.user._id}
            )

            const userType = userData.type;

            if (userType == "Agent") {
                return Ticket.findOne({ticketId}).populate('comments');
            } else {
                // TODO : if customer is viewing the ticket, dont show notes section
            }
      },

      //get Tickets by userId
      getTicketsByUserId: async (parent, {userId}) => {
        return Ticket.find({
            users : userId
        }).populate('tickets');
      },

      // get Tickets by userId and Status
      getTicketsByStatus: async (parent, {userId , status}) => {
        return Ticket.find({
            users : userId,
            status : status
        }).populate('comments');
        //TODO : dont show notes for customer
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

        },

        //updateTicketStatus
        updateTicketStatus: async (parent, {ticketId,status} , context) => {
            if (context.user) {
                
                const ticket = await Ticket.findOneAndUpdate(
                    {_id : ticketId},
                    {
                        status : status
                    }
                )
                // if ticket status is closed, remove that ticket from user's queue
                if (ticket._id == "Closed") {
                    await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { tickets: ticket._id } }
                    )  
                }
                return ticket;
            }
            throw new AuthenticationError('You need to be logged in!');
        },


        //createComment
        createComment: async (parent, {ticketId,message, userId}, context) => {
            if (context.user) {
                const comment = await Comment.create(
                    {
                        message,
                        creator : userId
                    }
                )
                await Ticket.findOneAndUpdate(
                    { _id: ticketId },
                    { $addToSet: { comments: comment._id } }
                  );
          
                return comment;
            } 
            throw new AuthenticationError('You need to be logged in!');
        },


        //createNote
        createNote: async (parent, {commentId,notes}, context) => {
            if (context.user) {
                return await Comment.findOneAndUpdate(
                    { _id: commentId },
                    { 
                         note : {notes}
                    },
                    {
                        new: true,
                        runValidators: true,
                      }
                  );
            } 
            throw new AuthenticationError('You need to be logged in!');
        },

        //updateNote
        updateNote: async (parent,{commentId,notes}, context) => {
            if(context.user){
                return Comment.findOneAndUpdate(
                    {_id : commentId},
                    {note : {notes}},
                    {
                        new: true,
                        runValidators: true,
                    }
                )
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        //deleteNote
        deleteNote: async (parent,{commentId, notes}, context) => {
            if(context.user){
                return Comment.findOneAndUDelete(
                    {_id : commentId},
                    {note : {notes}},
                    {
                        new: true,
                    }
                )
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        //login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user found with this email address');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },

          //TODO : signup

    }
}


module.exports = resolvers;
