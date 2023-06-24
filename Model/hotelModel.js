const mongoose = require("mongoose");
const Schema = mongoose.Schema

const regSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "firtName is required"],
    },
    lastName: {
        type: String,
        required: [true, "last is required"],
    },
    phoneNumber: {
        type: String,
        required: [true, "phoneNumber is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    token: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    }
    },{
        timestamps: true
    });
    
    const register = mongoose.model("register", regSchema)
    
    module.exports = register;
