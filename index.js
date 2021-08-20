require('dotenv').config();
const Express = require("express");
const mongoose = require("mongoose");
const mongo = require('mongodb');
const cors = require('cors');

const connectionstring = process.env.MONGO_URI

mongoose.connect(connectionstring, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, () => {console.log("Database Connected")});

const connection = mongoose.connection;

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  }
})

const Note = mongoose.model('Notes', NoteSchema)






const app = Express();

app.use(Express.json());
app.use(cors());

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running...");
});

app.get("/", (req, res) => {
  res.send("XD");
});

app.get("/notes", async (req, res) => {   
  try {
    const Notes = await Note.find()
    res.json(Notes)
  } catch (err) {
      res.status(500).json({message: err.message})
  }
});

app.post("/notes", async (req, res) => {
  const note = new Note({title: req.body.title})
  try {
    const newNote = await note.save()
    res.sendStatus(201).json({message: "succsessfully created"})
  } catch (err) {
    console.log(err.message)
  }
});

app.delete("/notes/:id", getNote,async(req, res) => {
  try {
   await res.note.remove()
   res.json({message: "deleted"})
  } catch (err){
    console.log(err.message)
  }
});

app.patch('/Notes/:id', getNote, async(req, res) => {
  if (req.body.title != null) {
    res.note.title = req.body.title
  }
  try {
    const updatedNote = await res.note.save()
    res.json({message: "updated"})
  } catch (err) {console.log(err.message)} 
})

async function getNote(req, res, next) {
  let note
  try {
    note = await Note.findById(req.params.id)
  }catch (err){console.log(err.message)}
  res.note = note
  next()
}
