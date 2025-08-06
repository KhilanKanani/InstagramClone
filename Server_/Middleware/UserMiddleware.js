const jwt = require("jsonwebtoken");

const FindCurrentUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(500).json({
                success: false,
                message: "Token Not Found..."
            });
        }

        const verify = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("Verify Token :" , verify.userId);
        req.userId = verify.userId;

        next();
    }

    catch (err) {
        console.log("FindCurrentUser Error :", err.message);
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = FindCurrentUser