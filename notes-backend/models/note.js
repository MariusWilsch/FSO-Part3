const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose
  .connect(url)
  .then((res) => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB", err.message));

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 5,
    required: true,
  },
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
