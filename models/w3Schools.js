var mongoose = require("mongoose");

var w3SchoolsSchema = new mongoose.Schema({
    section: {
        type: String,
        required: true
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    link: {
        type: String,
        unique: true,
        required: true
    },
    note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note"
    }
});

var w3Schools = mongoose.model("w3Schools", w3SchoolsSchema);

module.exports = w3Schools;