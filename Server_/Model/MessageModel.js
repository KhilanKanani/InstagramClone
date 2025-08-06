const { Schema, model } = require("mongoose");

const MessageSchema = new Schema({

    sender: {
        type: Schema.Types.ObjectId,
        ref: "UserModel"
    },

    receiver: {
        type: Schema.Types.ObjectId,
        ref: "UserModel",
    },

    message: {
        type: String,
        require: true,
    },

    image: {
        type: String,
        default: "",
    },
}, { timestamps: true })

const MessageModel = model("MessageModel", MessageSchema);
module.exports = MessageModel;