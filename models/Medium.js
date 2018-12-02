var mongoose = require("mongoose");

var mediumSchema = new mongoose.Schema({
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
    blurb: {
        type: String,
        required: true
    },
    note: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note"
    }
});

var Medium = mongoose.model("Medium", mediumSchema);

module.exports = Medium;