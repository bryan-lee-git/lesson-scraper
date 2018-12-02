var mongoose = require("mongoose");

var codeVideos = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoId: {
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

var CodeVideos = mongoose.model("CodeVideos", codeVideos);

module.exports = CodeVideos;