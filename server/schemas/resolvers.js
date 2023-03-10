const { AuthenticationError } = require('apollo-server-express');
const { User, Ticket, Comment } = require('../models');
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {
        // get Ticket by its ID
        getTicketById: async (parent, {ticketId, userType}) => {

            if (userType == "Agent") {
                return Ticket.findOne({_id:ticketId}).populate('comments').populate('users');
            } else {
                return Ticket.findOne({_id:ticketId}).populate('comments', '-note').populate('users');
            }
      },

      // get Tickets by userId and Status
      getTicketsByUserId: async (parent, {userId , status}) => {
        if(status)
            return Ticket.find({
            users : userId,
            status : status
            }).populate('comments users');
        else 
            return Ticket.find({
            users : userId,
            }).populate('comments users');
      },
    },


    Mutation : {
        //create new ticket
        createTicket: async (parent, {title, description,priority}, context) => {

            const usersDb = User.find({type : "Agent"});

            const agentId = usersDb[Math.floor(Math.random * users.length)]._id;

            // const customerId = context.user._id ;
            const customerId = "640a46c9f2281cd4b39a5f2e"

            const users = [agentId, customerId]

            // if (context.user) {
            //  const ticket = Ticket.create({title, description,priority, users});
             const ticket = Ticket.create({title, description,priority});

             return Ticket.findOneAndUpdate(
                {_id : ticket._id},
                
                    { $addToSet: { users: users } },
                
                {
                    new: true,
                }
            )
            // }
            // throw new AuthenticationError('You need to be logged in!');

        },

        //updateTicketStatus
        updateTicketStatus: async (parent, {ticketId,status} , context) => {
            // if (context.user) {
                const ticket = await Ticket.findOneAndUpdate(
                    {_id : ticketId},
                    {
                        status : status
                    },
                    {
                        new: true,
                    }
                )
                return ticket;
            // }
            // throw new AuthenticationError('You need to be logged in!');
        },


        //createComment
        createComment: async (parent, {ticketId,message, userId}, context) => {
            // if (context.user) {
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
            // } 
            // throw new AuthenticationError('You need to be logged in!');
        },


        //createNote
        createNote: async (parent, {commentId,notes}, context) => {
            // if (context.user) {
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
            // } 
            // throw new AuthenticationError('You need to be logged in!');
        },

        //updateNote
        updateNote: async (parent,{commentId,notes}, context) => {
            // if(context.user){
                return Comment.findOneAndUpdate(
                    {_id : commentId},
                    {note : {notes}},
                    {
                        new: true,
                        runValidators: true,
                    }
                )
            // }
            // throw new AuthenticationError('You need to be logged in!');
        },

        //deleteNote
        deleteNote: async (parent,{commentId, notes}, context) => {
            // if(context.user){
                return Comment.findOneAndDelete(
                    {_id : commentId},
                    {note : {notes}},
                )
            // }
            // throw new AuthenticationError('You need to be logged in!');
        },

        //login
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user found with this email address');
            }
      
            const correctPw = await user.comparePassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },

          createUser: async (parent,{firstName, lastName, password, email}) => {
            const user = await User.create({ firstName, lastName, password, email});
            const token = signToken(user);
            return { token, user };
          }
    }
}


module.exports = resolvers;
