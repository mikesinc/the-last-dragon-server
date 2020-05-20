const msgs = require("./msgs");
const templates = require("./templates");
const sendEmail = require("./send");

exports.collectEmail = (db) => (req, res) => {
  const { email } = req.body;

  db.select("id", "email", "verified")
    .from("users")
    .where("email", "=", email)
    .then((user) => {
        console.log(user)
      if (user[0].verified === false) {
        console.log("nah");
        sendEmail(user[0].email, templates.confirm(user[0].id)).then(() =>
          res.json({ msg: msgs.resend })
        );
      } else if (user[0].verified === true) {
        console.log("yea");
        res.json({ msg: msgs.alreadyConfirmed });
      } else {
      res.status(400).send("User not found!");
    }
    })
    .catch((err) => res.status(400).send(err.detail));
};

exports.confirmEmail = (db) => (req, res) => {
  const { id } = req.params;
  db.select("id", "verified")
    .from("users")
    .where("id", "=", id)
    .then((user) => {
      if (user[0].verified === false) {
        db.table("users")
          .where({ id: id })
          .update({ verified: true }, ["id", "verified"])
          .then((updatedRows) => {
            updatedRows === [{ id: id, verified: true }];
          })
          .catch((err) => res.status(400).send(err.detail));
      } else if (user[0].verified === true) {
        res.json({ msg: msgs.alreadyConfirmed });
      } else {
          res.json({ msg: msgs.couldNotFind });
      }
    });
};
