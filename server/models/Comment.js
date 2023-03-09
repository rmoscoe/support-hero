const { Schema, model } = require("mongoose");
const { dateFormat } = require("../utils/helpers");

const commentSchema = new Schema(
    {
        message: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: (date) => dateFormat(date)
        },
        creator: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        note: new Schema({
            notes: {
                type: String,
                required: true
            }, createdAt: {
                type: Date,
                default: Date.now(),
                get: (date) => dateFormat(date)
            }
        }, {
            toJSON: {
                getters: true
            }
        })
    },
    {
        toJSON: {
            getters: true,
        },
        id: false,
    }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;