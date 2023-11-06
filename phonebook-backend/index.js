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

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get(baseURL, (req, res) => {
  Person.find({}).then((notes) => {
    res.json(notes);
  });
});

app.get(`${baseURL}/:id`, (req, res) => {
  Person.findById(req.params.id).then((person) => res.json(person));
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

app.delete(`${baseURL}/:id`, (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => (result ? res.status(204).end : res.status(404).end()))
    .catch((err) => {
      console.log(err);
      res.status(400).send({ error: "malformatted id" });
    });
});

app.post(`${baseURL}`, (req, res) => {
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
  person.save().then((savedPerson) => res.json(savedPerson));
});

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
