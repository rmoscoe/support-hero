const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/helpers");

const chatRoomSchema = new Schema(
    {
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: "Ticket"
        },
        roomName: {
            type: String,
            required: true
        },
        users: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        }],
        createdAt: {
            type: Date,
            default: Date.now(),
            get: dateFormat
        },
        messages: [{
            type: Schema.Types.ObjectId,
            required: true,
            ref: "ChatMessage"
        }]
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const ChatRoom = model("ChatRoom", chatRoomSchema);

module.exports = ChatRoom;