var mongoose = require("mongoose");

var NoteSchema = new mongoose.Schema({
    title: String,
    body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;