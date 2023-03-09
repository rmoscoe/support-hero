const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  tickets: [{
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  }]
});

const User = model('User', userSchema);

module.exports = User;
