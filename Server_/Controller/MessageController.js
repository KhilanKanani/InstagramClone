const UploadCloudinary = require("../Config/UploadImageCloudinary");
const ConversationModel = require("../Model/ConversationModel");
const MessageModel = require("../Model/MessageModel");
const { GetUserSocketId, io } = require("../SocketIO/Socket");

const SendMessage = async (req, res) => {
    try {
        const sender = req.userId;
        const reciever = req.params.id;
        const { message } = req.body;
        let image;

        if (req.file) {
            image = await UploadCloudinary(req.file.path);
        }

        // Find Conversation... Sender Ne Pehle Reciever Se Conversation Ki Haii Yaa Nahi...
        let conversation = await ConversationModel.findOne({ particiants: { $all: [sender, reciever] } });

        let newMessage = await MessageModel.create({ sender, reciever, message, image });

        // Jo Sender Pehli Bar Reciever Ke Sath Conversation Kar Raha Haii To Create Kar Do
        if (!conversation) {
            conversation = await ConversationModel.create({
                particiants: [sender, reciever],
                messages: [newMessage._id]
            });
        }
        else {
            // Pehle Conversation Ki Haii To Message Ko Push Karke Save Karo...
            conversation.messages.push(newMessage._id);
            await conversation.save();
        }

        const recieverSocketId = GetUserSocketId(reciever);
        if (recieverSocketId) {
            io.to(recieverSocketId).emit("newMessage", newMessage);
        }

        return res.status(200).json({
            success: true,
            messages: newMessage
        })
    }

    catch (err) {
        console.log("SendMessage Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

const GetMessage = async (req, res) => {
    try {
        const sender = req.userId;
        const reciever = req.params.id;

        // Find Sender And Reciever All Message...
        let conversation = await ConversationModel.findOne({ particiants: { $all: [sender, reciever] } }).populate("messages");

        return res.status(200).json({
            success: true,
            messages: conversation?.messages
        })
    }

    catch (err) {
        console.log("GetMessage Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

module.exports = { SendMessage, GetMessage };