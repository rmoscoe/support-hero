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

const ChatMessage = model("ChatMessage", chatMessageSchema);

module.exports = ChatMessage;