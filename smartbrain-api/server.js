const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const { port } = require("./config");
const knex = require("knex");

const signin = require("./controllers/signin");
const register = require("./controllers/register");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1", // localhost
    user: "abhishek",
    database: "smartbrain",
    password: "password",
  },
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.get("/", (res, req) => {
  req.send(database.users);
});

// signin (post because we dont want the password to be visible)
app.post("/signin", signin.handleSignin(db, bcrypt));

// register
app.post("/register", register.handleRegister(db, bcrypt));

// profile/:userId
app.get("/profile/:id", (req, res) => {
  profile.handleProfile(req, res, db);
});

// image
app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

// image
app.post("/imageurl", image.handleApiCall);

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
