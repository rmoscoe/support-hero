const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/helpers");

const chatMessageSchema = new Schema(
    {
        message: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        roomId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "ChatRoom"
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: dateFormat
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const ChatMessage = model("ChatRoom", chatMessageSchema);

module.exports = ChatMessage;