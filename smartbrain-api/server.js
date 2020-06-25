const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1", // localhost
    user: "abhishek",
    database: "smartbrain",
    password: "password",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

const app = express();

app.use(bodyParser.json());
app.use(cors());

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
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to retrieve user"));
      } else {
        throw err;
      }
    })
    .catch((err) => res.status(400).json("wrong credentials"));
});

// register
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);

  // create a transaction when you wanna do more than 2 things at once
  // and use the trx objects to do the db operations
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0],
            joined: new Date(),
          })
          .then((user) => res.json(user[0]))
          .catch((err) => res.status(400).json("unable to register"));
      })
      .then(trx.commit)
      // rollback just reverses the changes if its runs into an error
      .catch(trx.rollback);
  });
});

// profile/:userId
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length == 0) throw err;
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json("not found"));
});

// image
app.put("/image", (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0]))
    .catch((err) => res.status(400).json("unable to get entries"));
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
