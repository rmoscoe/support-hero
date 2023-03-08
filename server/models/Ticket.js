const { Schema, model } = require('mongoose');
const { dateFormat } = require("../utils/helpers");

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
            required: true,
            default: 'Open',
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: (date) => dateFormat(date),
        },
        users: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }],
        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    },
    {
        toJSON: {
            getters: true,
        }
    }
);

const Ticket = model('Ticket', ticketSchema);

module.exports = Ticket;