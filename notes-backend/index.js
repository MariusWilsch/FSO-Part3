require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const Note = require("./models/note");
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError")
    return response.status(400).send({ error: "malformatted id" });
  else if (error.name === "ValidationError")
    return response.status(400).json({ error: error.message });

  next(error);
};

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(express.static("dist"));

app.get("/api/notes", (req, res) => {
  Note.find({}).then((notes) => {
    res.json(notes);
  });
});

app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note
    .save()
    .then((savedNote) => response.json(savedNote))
    .catch((err) => next(err));
});

app.put("/api/notes/:id", (req, res, next) => {
  const { content, important } = req.body;

  Note.findByIdAndUpdate(
    req.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((err) => next(err));
});

app.get("/api/notes/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => (note ? res.json(note) : res.status(404).end()))
    .catch((err) => next(err));
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then((result) => {
      // If the operation was successful, even if no document was found, result will be the deleted document (if found) or null
      if (result) {
        response.status(204).end(); // Successfully deleted
      } else {
        response.status(404).end(); // No document found with that ID
      }
    })
    .catch((error) => next(error));
});

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
