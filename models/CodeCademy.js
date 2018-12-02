var mongoose = require("mongoose");

var codeCademySchema = new mongoose.Schema({
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

var CodeCademy = mongoose.model("CodeCademy", codeCademySchema);

module.exports = CodeCademy;