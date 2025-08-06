const express = require("express");
const { GetProfile, EditProfile, GetCurrentUser, FollowAndUnfollow, GetOtherUser, FollowAndUnfollowData } = require("../Controller/UserController");
const FindCurrentUser = require("../Middleware/UserMiddleware");
const Upload = require("../Middleware/ImageMulter");
const router = express.Router();

router.get("/getProfile/:selectId", FindCurrentUser, GetProfile);
router.post("/followOrUnfollow/:id", FindCurrentUser, FollowAndUnfollow);
router.get("/currentUser", FindCurrentUser, GetCurrentUser);
router.get("/otherUser", FindCurrentUser, GetOtherUser);
router.put("/editProfile", FindCurrentUser, Upload, EditProfile);
router.get("/userprofiledata/:id", FindCurrentUser, FollowAndUnfollowData);

module.exports = router;