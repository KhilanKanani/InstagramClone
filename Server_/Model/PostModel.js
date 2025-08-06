const { Schema, model } = require("mongoose");

const PostSchema = new Schema({

    Image: {
        type: String,
        default: ""
    },
    
    Caption: {
        type: String,
        default: ""
    },

    Author: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        require: true
    },

    Likes: [{
        type: Schema.Types.ObjectId,
        ref: "Like"
    }],
}, { timestamps: true })

const PostModel = model("PostModel", PostSchema);
module.exports = PostModel;