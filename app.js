const express = require("express");
const app = express();

// Show data in DOM, 2nd Use public folder. 3rd Add asynchronous data to DOM
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// Serve ejs files
app.set("view engine", "ejs");

// Set connectionString for database connection
let db;
let port = process.env.PORT;
if (port == null || port == "") {
  port == 3030;
}

const mongodb = require("mongodb");
let connectionString =
  "mongodb+srv://romson:Welcome2020@cluster0-tesing123-ni6rz.mongodb.net/todoejs?retryWrites=true&w=majority";

// Monogdb connect()
mongodb.connect(
  connectionString,
  { useUnifiedTopology: true },
  (err, client) => {
    db = client.db();
    app.listen(3030, () => {
      console.log("Server running");
    });
  }
);

// Root path
app.get("/", (req, res) => {
  db.collection("todoejs")
    .find()
    .toArray((err, todoejs) => {
      res.render("todo", { todoejs: todoejs });
    });
});

// Post data
app.post("/create-item", (req, res) => {
  console.log(req.body);
  db.collection("todoejs").insertOne({ todo: req.body.todo }, (err, info) => {
    res.json(info.ops[0]);
  });
});

// Edit todo
app.post("/update-item", (req, res) => {
  console.log(req.body.todo);
  db.collection("todoejs").findOneAndUpdate(
    { _id: new mongodb.ObjectID(req.body.id) },
    { $set: { todo: req.body.todo } },
    () => {
      res.send("Success!");
    }
  );
});

// Delete route
app.post("/delete-item", (req, res) => {
  db.collection("todoejs").deleteOne(
    { _id: new mongodb.ObjectID(req.body.id) },
    () => {
      res.send("Success");
    }
  );
});
