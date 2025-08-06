const UploadCloudinary = require("../Config/UploadImageCloudinary");
const UserModel = require("../Model/UserModel");

const GetProfile = async (req, res) => {
    try {
        const userId = req.params.selectId;
        const user = await UserModel.findById({ _id: userId });

        return res.status(200).json({
            success: true,
            user: user
        });
    }

    catch (err) {
        console.log("GetProfile Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const EditProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { Fullname, Bio, Username } = req.body;
        let Image;

        if (req.file) {
            Image = await UploadCloudinary(req.file.path);
        }

        const user = await UserModel.findByIdAndUpdate({ _id: userId }, { Fullname, Bio, Image, Username }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Edit Profile Successfull....",
            user: user
        });
    }

    catch (err) {
        console.log("EditProfile Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const GetOtherUser = async (req, res) => {
    try {
        const otherUser = await UserModel.find({ _id: { $ne: req.userId } }).select("-Password");

        return res.status(200).json({
            success: true,
            otherUser: otherUser
        });

    }

    catch (err) {
        console.log("GetOtherUser Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const GetCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await UserModel.findById({ _id: userId });

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User Not Found..."
            });
        }

        return res.status(200).json({
            success: true,
            user: user
        });
    }

    catch (err) {
        console.log("GetCurrentUser Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const FollowAndUnfollow = async (req, res) => {
    try {
        const followKarneVala = req.userId;
        const jiskoFollowKarnaHai = req.params.id;

        const user = await UserModel.findById(followKarneVala);
        const targerUser = await UserModel.findById(jiskoFollowKarnaHai);

        if (!user || !targerUser) {
            return res.status(404).json({
                success: false,
                message: "User not found..."
            });
        }

        // Check Follow Karna Hai Ya UnFollow
        const isFollowing = user.Following.includes(jiskoFollowKarnaHai);

        if (isFollowing) {
            // Already Follow Kar Rakha Haii Isliye UnFollow Karne Ka Logic
            await Promise.all([
                UserModel.findByIdAndUpdate({ _id: followKarneVala }, { $pull: { Following: jiskoFollowKarnaHai } }, { new: true }),
                UserModel.findByIdAndUpdate({ _id: jiskoFollowKarnaHai }, { $pull: { Followers: followKarneVala } }, { new: true })
            ]);

            return res.status(200).json({
                success: true,
                message: "UnFollow Successfull...",
                user
            })

        }
        else {
            //  UnFollow Haii Isliye Follow Karne Ka Logic
            await Promise.all([
                UserModel.findByIdAndUpdate({ _id: followKarneVala }, { $push: { Following: jiskoFollowKarnaHai } }, { new: true }),
                UserModel.findByIdAndUpdate({ _id: jiskoFollowKarnaHai }, { $push: { Followers: followKarneVala } }, { new: true }),
            ]);

            return res.status(200).json({
                success: true,
                message: "Follow Successfull...",
                updatedUser: await UserModel.findById({ _id: followKarneVala }).populate('Following').populate('Followers'),
            })
        }
    }

    catch (err) {
        console.log("FollowAndUnfollow Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const FollowAndUnfollowData = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await UserModel.findById({ _id: id }).populate('Following').populate('Followers').select("Image Fullname Username Followers Following");

        return res.status(200).json({
            success: true,
            user: user
        });

    }
    catch (err) {
        console.log("FollowAndUnfollowData Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}
module.exports = { GetProfile, EditProfile, GetOtherUser, GetCurrentUser, FollowAndUnfollow, FollowAndUnfollowData };