const express = require('express');
const { app, server } = require('./SocketIO/Socket');
// const app = express();
const ConnectDb = require('./Config/ConnectDb');

const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const cookieParser = require('cookie-parser');
const port = process.env.PORT;

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

const AuthRoutes = require("./Routes/AuthRoutes");
const UserRoutes = require("./Routes/UserRoutes");
const PostRoutes = require("./Routes/PostRoutes");
const MessageRoutes = require("./Routes/MessageRoutes");

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", AuthRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/post", PostRoutes);
app.use("/api/message", MessageRoutes);

server.listen(port, () => {
    ConnectDb();
    console.log(`Your Application Running In Port Number ${port}`);
});