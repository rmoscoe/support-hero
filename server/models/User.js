const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

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
        required: true,
        match: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,32})/
    },
    type: {
        type: String,
        enum: ['Agent', 'Customer'],
        default: 'Customer'
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
},
    {
        toJSON: {
            virtuals: true
        }
    });

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }
    
    const salt = 10;  // Alternatively: await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    
    user.password = hash;
    next();
});

// Create a virtual property `fullName` that gets user's full name
userSchema.virtual('fullName').get(function () {
    return `${this.first} ${this.last}`;
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    const user = this;

    return bcrypt.compare(candidatePassword, user.password);
};

const User = model('User', userSchema);

module.exports = User;
