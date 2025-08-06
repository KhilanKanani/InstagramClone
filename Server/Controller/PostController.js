const UploadCloudinary = require("../Config/UploadImageCloudinary");
const PostModel = require("../Model/PostModel");
const UserModel = require("../Model/UserModel");
const { GetUserSocketId, io } = require("../SocketIO/Socket");

const AddNewPost = async (req, res) => {
    try {
        const Author = req.userId;
        const { Caption } = req.body;
        let Image;

        if (req.file) {
            Image = await UploadCloudinary(req.file.path);
        }

        const post = await PostModel.create({ Caption, Image, Author });

        // Add Post To User
        await UserModel.findByIdAndUpdate({ _id: Author }, { Post: post._id }, { new: true });

        return res.status(200).json({
            success: true,
            message: "New Post Added...",
            Post: post,
        });
    }

    catch (err) {
        console.log("AddNewPost Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const LikePost = async (req, res) => {
    try {
        const likeUser = req.userId;
        const postId = req.params.id;

        // Like Logic
        const post = await PostModel.findByIdAndUpdate({ _id: postId }, { $addToSet: { Likes: likeUser } }, { new: true });

        // Implement Socket.Io realTime Notification...
        const findUser = await UserModel.findById({ _id: likeUser }).select("Username Image Fullname");
        if (post.Author?._id?.toString() !== likeUser) {
            const notification = {
                type: "Like",
                userId: likeUser,
                user: findUser,
                message: `${findUser.Fullname} was liked your post...`,
                createdAt: new Date(),
            }

            const postOwnerSocketId = GetUserSocketId(post?.Author?._id?.toString());
            io.to(postOwnerSocketId).emit("notification", notification);
        }

        return res.status(200).json({
            success: true,
            message: "Like Post...",
            Post: post
        });
    }

    catch (err) {
        console.log("LikePost Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const UnLikePost = async (req, res) => {
    try {
        const likeUser = req.userId;
        const postId = req.params.id;

        // Like Logic
        const post = await PostModel.findByIdAndUpdate({ _id: postId }, { $pull: { Likes: likeUser } }, { new: true });

        // Implement Socket.IO realTime Notification...
        const findUser = await UserModel.findById({ _id: likeUser }).select("Username Image Fullname");
        if (post.Author?._id?.toString() !== likeUser) {
            const notification = {
                type: "DisLike",
                userId: likeUser,
                user: findUser,
                message: `${findUser.Fullname} was disLiked your post...`,
            }

            const postOwnerSocketId = GetUserSocketId(post?.Author?._id?.toString());
            io.to(postOwnerSocketId).emit("notification", notification);
        }

        return res.status(200).json({
            success: true,
            message: "DisLike Post...",
            Post: post
        });
    }

    catch (err) {
        console.log("UnLikePost Error :", err.message);
        return res.status(500).status({
            success: false,
            message: err.message
        });
    }
}

const AllPost = async (req, res) => {
    try {
        const allPost = await PostModel.find().sort({ createdAt: -1 }).populate({ path: "Author", select: "Username Image Fullname" });

        return res.status(200).json({
            success: true,
            message: "All Post...",
            Post: allPost
        });
    }

    catch (err) {
        console.log("AllPost Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const GetUserPost = async (req, res) => {
    try {
        const AuthorId = req.userId;
        const Post = await PostModel.find({ Author: AuthorId }).populate({ path: "Author", select: "Username Image" });

        return res.status(200).json({
            success: true,
            message: "User Post...",
            Post: Post
        });
    }

    catch (err) {
        console.log("GetUserPost Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const GetOtherUserPost = async (req, res) => {
    try {
        const AuthorId = req.params.id;
        const Post = await PostModel.find({ Author: AuthorId }).populate({ path: "Author", select: "Username Image" });

        return res.status(200).json({
            success: true,
            message: "Other User Post...",
            Post: Post
        });
    }

    catch (err) {
        console.log("GetOtherUserPost Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


const DeletePost = async (req, res) => {
    try {
        const AuthorId = req.userId;
        const postId = req.params.id;

        // Delete Post
        await PostModel.findByIdAndDelete({ _id: postId });
        // Find User
        const findUser = await UserModel.findById({ _id: AuthorId });
        // Delete Post And Update UserPost Data
        findUser.Post = findUser.Post.filter(id => id.toString() != postId);

        // Save UserData
        await findUser.save();

        return res.status(200).json({
            success: true,
            message: "Post Deleted...",
        });
    }

    catch (err) {
        console.log("DeletePost Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


const SavePost = async (req, res) => {
    try {
        const AuthorId = req.userId;
        const postId = req.params.id;

        const Post = await PostModel.findById({ _id: postId });
        const user = await UserModel.findById({ _id: AuthorId });

        if (user.Saved.includes(Post._id)) {
            // If Post Already Saved, Then UnSave It
            await user.updateOne({ $pull: { Saved: Post._id } }, { new: true });
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Post UnSaved",
                User: user
            });
        }
        else {
            // If Post Not Saved, Then Save It
            await user.updateOne({ $addToSet: { Saved: Post._id } }, { new: true });
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Post Saved",
                User: user
            });
        }
    }
    catch (err) {
        console.log("SavePost Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


const UserSavePost = async (req, res) => {
    try {
        const id = req.userId;

        const SavePost = await UserModel.findById({ _id: id }).populate({ path: "Saved", populate: { path: "Author", select: "Image" } });

        return res.status(200).json({
            success: true,
            savePost: SavePost
        });
    }

    catch (err) {
        console.log("UserSavePost Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const SelectPost = async (req, res) => {
    try {
        const postId = req.params.id;

        const Post = await PostModel.findById({ _id: postId }).populate({ path: "Author", select: "Username Image Fullname Followers" });

        return res.status(200).json({
            success: true,
            selectPost: Post
        });
    }

    catch (err) {
        console.log("SelectPost Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const EditPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { Caption } = req.body;

        const Post = await PostModel.findByIdAndUpdate({ _id: postId }, { Caption }, { new: true });

        return res.status(200).json({
            success: true,
            selectPost: Post
        });
    }

    catch (err) {
        console.log("EditPost Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


module.exports = { AddNewPost, LikePost, UnLikePost, AllPost, GetUserPost, GetOtherUserPost, DeletePost, SavePost, UserSavePost, SelectPost, EditPost };