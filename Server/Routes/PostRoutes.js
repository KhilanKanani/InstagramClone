const express = require("express");
const FindCurrentUser = require("../Middleware/UserMiddleware");
const Upload = require("../Middleware/ImageMulter");
const { AddNewPost, AllPost, GetUserPost, GetOtherUserPost, LikePost, UnLikePost, DeletePost, SavePost, SelectPost, EditPost, UserSavePost } = require("../Controller/PostController");
const router = express.Router();

router.post("/createpost", FindCurrentUser, Upload, AddNewPost);
router.get("/allpost", AllPost);
router.get("/userpost", FindCurrentUser, GetUserPost);
router.get("/otheruserpost/:id", FindCurrentUser, GetOtherUserPost);
router.get("/likepost/:id", FindCurrentUser, LikePost);
router.get("/unlikepost/:id", FindCurrentUser, UnLikePost);
router.post("/deletepost/:id", FindCurrentUser, DeletePost);
router.post("/savepost/:id", FindCurrentUser, SavePost);
router.get("/selectPost/:id", FindCurrentUser, SelectPost);
router.get("/userSavedPost", FindCurrentUser, UserSavePost);
router.put("/editpost/:id", FindCurrentUser, EditPost);

module.exports = router;