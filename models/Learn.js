var mongoose = require("mongoose");

var learnSchema = new mongoose.Schema({
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

var Learn = mongoose.model("Learn", learnSchema);

module.exports = Learn;