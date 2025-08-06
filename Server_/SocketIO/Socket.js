const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io")
const dotenv = require("dotenv");
dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {

        origin: process.env.CLIENT_URL,
        credentials: true
    }
});

const userSocketMap = {}; // Login User SocketId Store In This userSocketMap, Strore : userId -> SocketId

const GetUserSocketId = (userId) => {
    return userSocketMap[userId];
}

io.on("connection", (socket) => {
    const userId = socket?.handshake?.query?.userId;

    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User :- ${userId} connected with socket ID :- ${socket.id}`);
    }

    io.emit("onlineUser", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("onlineUser", Object.keys(userSocketMap));
    })
})

module.exports = { io, app, server, GetUserSocketId };