const mongoose = require("mongoose");

const ConnectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected...");
    }

    catch (err) {
        console.log("DataBase Error : ", err.message);
    }
}

module.exports = ConnectDb