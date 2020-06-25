const handleProfile = (req, res, db) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then((user) => {
      if (user.length == 0) throw err;
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json("not found"));
};

module.exports = {
  handleProfile: handleProfile,
};
