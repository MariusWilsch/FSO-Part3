const express = require("express");
const app = express();
const baseURL = "/api/persons";
const requiredProperties = ["name", "number"];
const morgan = require("morgan");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(unkownEndpoint);
app.use(reqLogger);
app.use("dist");

function reqLogger(req, res, next) {
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Body:", req.body);
  console.log("---");
  next();
}

function unkownEndpoint(req, res) {
  res.status(404).send({ error: "unknown endpoint" });
}

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get(baseURL, (req, res) => res.json(persons));

app.get(`${baseURL}/:id`, (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  person ? res.json(person) : res.status(404).end();
});

app.get("/info", (req, res) => {
  const numOfPeople = persons.length;
  const curTime = new Date().toString();

  const htmlRes = `
	<p>Phonebook has info for ${numOfPeople}</p>
	<p>Current time is ${curTime}</p>
	`;

  res.send(htmlRes);
});

app.delete(`${baseURL}/:id`, (req, res) => {
  const id = Number(req.params.id);
  const prevLen = persons.length;
  persons = persons.filter((person) => person.id !== id);

  prevLen !== persons.length ? res.status(204).end() : res.status(404).end();
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

  if (persons.find((person) => person.name === body.name))
    return res.status(400).json({ error: "name must be unique" });

  const person = {
    id: uuidv4(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  console.log(persons);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
