var mongoose = require("mongoose");

var courseraSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
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

var Coursera = mongoose.model("Coursera", courseraSchema);

module.exports = Coursera;