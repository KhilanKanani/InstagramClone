const { Schema, model } = require("mongoose");

const ConversationSchema = new Schema({

    particiants: [{
        type: Schema.Types.ObjectId,
        ref: "UserModel"
    }],

    messages: [{
        type: Schema.Types.ObjectId,
        ref: "MessageModel"
    }],
}, { timestamps: true })

const ConversationModel = model("ConversationModel", ConversationSchema);
module.exports = ConversationModel;