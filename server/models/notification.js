const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    Date : {
        type:Date,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model("notification", notificationSchema);
