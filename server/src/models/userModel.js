const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const { defaultImagePath } = require('../secret');
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'user name is required'],
        trim: true,
        maxlength: [31, 'user name can be max 31 characters'],
        minlength: [3, 'user name can be min 3 characters']
    },
    email: {
        type: String,
        required: [true, 'user name is required'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                // return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(v);
                return  /\S+@\S+\.\S+/.test(v);
            },
            message: 'please enter a valid email'
        }
    },
    password: {
        type: String,
        required: [true, 'user password is required'],
        trim: true,
        minlength: [6, 'user password can be min 6 characters'],
        set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10))
    },
    image: {
        type: String,
        default: defaultImagePath
    },
    address: {
        type: String,
        required: [true, 'user address is required']
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isBanned: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

const User = model('Users', userSchema);
module.exports = User;