const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { createTransporter } = require("./config/transporter");
const socketio = require('socket.io');
require("dotenv").config();

const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const IOPORT = process.env.IOPORT || 3002;

const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

async function verifyTransporter() {
    let transporter = await createTransporter();
    transporter.verify(function (error, success) {
        if (error) {
            console.error(error);
        } else {
            console.log('Server is ready to transport messages');
        }
    });
}

verifyTransporter();

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
    await server.start();
    server.applyMiddleware({ app });

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}!`);
            console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
        })
    })
};

// const ioServer = app.listen(IOPORT, () => {
//     console.log(`IO Server listening on port ${IOPORT}`);
// });

// const io = socketio(ioServer);

// io.on('connection', (socket) => {
//     console.log('Connected to SocketIO server');

//     socket.on('joinRoom', (roomId) => {
//         socket.join(roomId);
//         console.log(`User joined room ${roomId}`);
//     });

//     socket.on('leaveRoom', (roomId) => {
//         socket.leave(roomId);
//         console.log(`User left room ${roomId}`);
//     });

//     socket.on('sendMessage', (message) => {
//         io.to(message.roomId).emit('message', message);
//     });
// });

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
