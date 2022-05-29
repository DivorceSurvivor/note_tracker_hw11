const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4 } = require("uuid");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/notes", (req, res) => {
  const file = fs.readFileSync("./db/db.json");
  return res.status(200).json(JSON.parse(file));
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  const newNote = {
    id: v4(),
    title: title,
    text: text
  };

  const file = fs.readFileSync("./db/db.json");
  const fileData = JSON.parse(file);
  const dataTosave = JSON.stringify([newNote, ...fileData]);
  fs.writeFileSync("./db/db.json", dataTosave);
  return res.status(200).json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;

  const file = fs.readFileSync("./db/db.json");
  const fileData = JSON.parse(file);

  const dataTosave = JSON.stringify(
    fileData.filter((note) => note.id !== noteId)
  );

  fs.writeFileSync("./db/db.json", dataTosave);
  return res.status(200).json(true);
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.use("/assets", express.static(path.join(__dirname, "public", "assets")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
