const express = require("express");
const router = express.Router();
const { Signup, Login, Logout } = require("../Controller/AuthController");

router.post("/signup", Signup);
router.post("/login", Login);
router.get("/logout", Logout);

module.exports = router;