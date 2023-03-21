const { Schema, model } = require('mongoose');
const dateFormat = require("../utils/helpers");

const ticketSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'Open',
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: dateFormat,
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        feedbackId: {
            type: Schema.Types.ObjectId,
            ref: 'Feedback',
        }
    },
    {
        toJSON: {
            getters: true,
        }
    }
);

const Ticket = model('Ticket', ticketSchema);

module.exports = Ticket;