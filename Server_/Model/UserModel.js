const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    Fullname: {
        type: String,
        default: ""
    },

    Username: {
        type: String,
        require: true,
        unique: true
    },

    Email: {
        type: String,
        require: true,
        unique: true
    },

    Password: {
        type: String,
        require: true,
    },

    Image: {
        type: String,
        default: "https://res.cloudinary.com/dx5nhetqj/image/upload/v1748070595/n1elrqsvnxyr4po67pk9.png"
    },

    Bio: {
        type: String,
        default: ""
    },

    Followers: [{
        type: Schema.Types.ObjectId,
        ref: "UserModel"
    }],

    Following: [{
        type: Schema.Types.ObjectId,
        ref: "UserModel"
    }],

    Post: [{
        type: Schema.Types.ObjectId,
        ref: "PostModel"
    }],

    Saved: [{
        type: Schema.Types.ObjectId,
        ref: "PostModel"
    }],

    CreatedAt: {
        type: String,
        default: Date.now()
    }
}, { timestamps: true })

const UserModel = model("UserModel", UserSchema);
module.exports = UserModel;