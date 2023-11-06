require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/personDB");

const baseURL = "/api/persons";
const requiredProperties = ["name", "number"];

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(reqLogger); // Request logger should be one of the first middlewares
app.use(express.static("dist"));

function reqLogger(req, res, next) {
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Body:", req.body);
  console.log("---");
  next();
}

function unknownEndpoint(req, res) {
  res.status(404).send({ error: "unknown endpoint" });
}

const errHandler = (err, req, res, next) => {
  console.log(err);

  if (err.name === "CastError")
    return res.status(400).send({ error: "malformatted id" });
  if (err.name === "ValidationError")
    return res.status(400).send({ error: err.message });

  next(err);
};

app.get(baseURL, (req, res, next) => {
  Person.find({})
    .then((notes) => res.json(notes))
    .catch((err) => next(err));
});

app.get(`${baseURL}/:id`, (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => res.json(person))
    .catch((err) => next(err));
});

// app.get("/info", (req, res) => {
//   const numOfPeople = persons.length;
//   const curTime = new Date().toString();

//   const htmlRes = `
// 	<p>Phonebook has info for ${numOfPeople}</p>
// 	<p>Current time is ${curTime}</p>
// 	`;

//   res.send(htmlRes);
// });

app.delete(`${baseURL}/:id`, (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => (result ? res.status(204).end() : res.status(404).end()))
    .catch((err) => next(err));
});

app.post(`${baseURL}`, (req, res, next) => {
  const body = req.body;

  const missingProperties = requiredProperties.filter(
    (prop) => !(prop in body)
  );

  if (missingProperties.length > 0)
    return res.status(400).json({
      error: `Missing required properties: ${missingProperties.join(", ")}`,
    });

  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => res.json(savedPerson))
    .catch((err) => next(err));
});

app.use(unknownEndpoint);
app.use(errHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
