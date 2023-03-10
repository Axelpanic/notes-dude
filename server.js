const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid"); // use uuid to create the id automatically

const app = express();
var PORT = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// STATIC MIDDLEWARE
app.use(express.static("./Public"));


//GET API db.json
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./db/db.json"))
});

// Post function to add new notes to db.json
app.post("/api/notes", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const newNotes = req.body;
    newNotes.id = uuid.v4();
    notes.push(newNotes);
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    res.json(notes);
});

//used for deleting notes
app.delete("/api/notes/:id", (req, res) => {
    const notes = JSON.parse(fs.readFileSync("./db/db.json"));
    const delNote = notes.filter((rmvNote) => rmvNote.id !== req.params.id);
    fs.writeFileSync("./db/db.json", JSON.stringify(delNote));
    res.json(delNote);
})

//HTML calls
//calls home page
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./Public/index.html"));
});
//call for notes.html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./Public/notes.html"));
});

//Start listen
app.listen(PORT, function () {
    console.log("App listening on PORT: " + PORT);
});
