const { Schema, model } = require('mongoose');
const dateFormat = require("../utils/helpers");

const feedbackSchema = new Schema(
    {
        feedbackText: {
            type: String,
            required: true,
        },
        rating: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: dateFormat,
        },
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: 'Ticket',
        }
    },
    {
        toJSON: {
            getters: true,
        }
    }
);

const Feedback = model('Feedback', feedbackSchema);

module.exports = Feedback;