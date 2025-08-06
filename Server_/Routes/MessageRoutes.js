const express = require("express");
const FindCurrentUser = require("../Middleware/UserMiddleware");
const Upload = require("../Middleware/ImageMulter");
const { SendMessage, GetMessage } = require("../Controller/MessageController");
const router = express.Router();

router.post("/sendmsg/:id", FindCurrentUser, Upload, SendMessage);
router.get("/getmsg/:id", FindCurrentUser, GetMessage);

module.exports = router;