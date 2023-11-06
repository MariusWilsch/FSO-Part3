const mongoose = require("mongoose");

let argc = process.argv.length;

if (argc < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://verdant:${password}@phonebook.ot1rgnw.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(() => console.log("connected to MongoDB"))
  .catch((error) => console.log("error connecting to MongoDB:", error.message));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("P", personSchema);

function listAll() {
  Person.find({}).then((res) => {
    console.log("phonebook entries:");
    res.forEach((person) => console.log(person.name, person.number));
    mongoose.connection.close();
  });
}

function addEntry(name, number) {
  const person = new Person({ name, number });

  person.save().then((res) => {
    console.log("Saved entry to notebook!");
    mongoose.connection.close();
  });
}

if (argc === 3) return listAll();
if (argc === 5) return addEntry(process.argv[3], process.argv[4]);

console.log("Please provide the correct number of arguments");
process.exit(1);
