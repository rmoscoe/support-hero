const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/helpers');

const emailSchema = new Schema(
    {
        trigger: {
            type: String,
            required: true
        },
        sentAt: {
            type: Date,
            default: Date.now(),
            get: dateFormat
        },
        sentTo: {
            // email address the email was actually sent to, which may be different from the user's email address if the user's email address has changed
            type: String,
            required: true
        },
        sentToUser: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        accepted: {
            type: Boolean
        },
        response: {
            type: String
        },
        messageId: {
            type: String
        },
        messageURL: {
            type: String
        }
    },
    {
        toJSON: {
            getters: true
        }
    }
);

const Email = model("Email", emailSchema);

module.exports = Email;