const msgs = require("./msgs");
const templates = require("./templates");
const sendEmail = require("./send");

exports.collectEmail = (db) => (req, res) => {
  const { email } = req.body;

  db.select("id", "email", "verified")
    .from("users")
    .where("email", "=", email)
    .then((user) => {
      if (user.verified === false) {
        console.log("nah");
        sendEmail(user[0].email, templates.confirm(user[0].id)).then(() =>
          res.json({ msg: msgs.resend })
        );
      } else if (user.verified === true) {
        res.json({ msg: msgs.alreadyConfirmed });
      }
      return res.status(400).send("User not found!");
    })
    .catch((err) => res.status(400).send(err.detail));
};

exports.confirmEmail = (db) => (req, res) => {
  const { id } = req.params;
  db.select("id", "verified")
    .from("users")
    .where("id", "=", id)
    .then((user) => {
      if (user.verified === false) {
        db.table("users")
          .where({ id: id })
          .update({ verified: true }, ["id", "verified"])
          .then((updatedRows) => {
            updatedRows === [{ id: id, verified: true }];
          })
          .catch((err) => res.status(400).send(err.detail));
      } else if (user.verified === true) {
        res.json({ msg: msgs.alreadyConfirmed });
      }

      return res.json({ msg: msgs.couldNotFind });
    });
};
