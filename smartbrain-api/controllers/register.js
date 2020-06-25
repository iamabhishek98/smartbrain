const handleRegister = (db, bcrypt) => (req, res) => {
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
};

module.exports = {
  handleRegister: handleRegister,
};
