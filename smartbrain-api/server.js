const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "13",
      name: "Sally",
      email: "Sally@gmail.com",
      password: "cream",
      entries: 0,
      joined: new Date(),
    },
  ],
};

const port = 3001;

app.listen(port, () => {
  console.log("Listening on port", port);
});

app.get("/", (res, req) => {
  req.send(database.users);
});

// signin (post because we dont want the password to be visible)
app.post("/signin", (req, res) => {
  //   res.json("signing");
  const email = req.body.email;
  const password = req.body.password;
  if (
    email == database.users[0].email &&
    password === database.users[0].password
  ) {
    console.log("success");
    res.json(database.users[0]);
  } else {
    console.log("failure");
    res.status(400).json("error logging in");
  }
});

// register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });

  res.json(database.users[database.users.length - 1]);
  console.log(database.users);
  //   res.json("success");
});

// profile/:userId
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) res.status(400).json("no such user");
});

// image
app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      console.log(user.entries);
      return res.json(user.entries);
    }
  });
  if (!found) res.status(400).json("no such user");
});

/*
let i = "apples";
let j = "";
bcrypt.hash(i, null, null, function (err, hash) {
  j += hash;
  console.log(j);
});

bcrypt.compare(
  i,
  "$2a$10$9O7gSjDz5fSK5jXjF8g3yeQS2ijgnpoFC6HUFpNye7an6KVaoAwFa",
  function (err, res) {
    console.log(res);
  }
);
*/
