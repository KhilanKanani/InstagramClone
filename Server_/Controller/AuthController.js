const GenerateToken = require("../Config/GenerateToken");
const UserModel = require("../Model/UserModel");

const Signup = async (req, res) => {
    try {
        const { Username, Email, Password } = req.body;

        const CheckUserName = await UserModel.findOne({ Username });
        if (CheckUserName) {
            return res.status(500).json({
                message: "Username Already Exists..."
            });
        }

        const CheckEmail = await UserModel.findOne({ Email });
        if (CheckEmail) {
            return res.status(500).json({
                message: "Email Already Exists..."
            });
        }

        const NewUser = await UserModel.create({ Username, Email, Password });

        const token = await GenerateToken(NewUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true
        });

        return res.status(200).json({
            success: true,
            message: "Signup Sucessfulll...",
            user: NewUser
        });
    }

    catch (err) {
        console.log("Signup Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


const Login = async (req, res) => {
    try {
        const { Email, Password } = req.body;

        const CheckEmail = await UserModel.findOne({ Email });
        if (!CheckEmail) {
            return res.status(500).json({
                message: "This User Does Not Exists..."
            });
        }

        if (Password != CheckEmail.Password) {
            return res.status(500).json({
                message: "Incorrect Password..."
            });
        }

        const token = await GenerateToken(CheckEmail._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true
        });

        return res.status(200).json({
            success: true,
            message: "Login Sucessfulll...",
            user: CheckEmail
        });
    }

    catch (err) {
        console.log("Login Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const Logout = async (req, res) => {
    try {
        res.clearCookie("token");

        return res.status(200).json({
            success: true, 
            message: "Logout Successfull..."
        });
    }

    catch (err) {
        console.log("Logout Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

module.exports = { Signup, Login, Logout };