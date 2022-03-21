const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    level: {
        type: String,
        default: "Newbie"
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    matchesCompleted: {
        type: Number,
        default: 0
    },
    averagePoints: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    }
})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);