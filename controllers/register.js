const { registerValidation } = require("../validation");
const { generateAccessToken } = require("./login");
const jwt = require("jsonwebtoken");

const handleRegister = (db, bcrypt) => (req, res) => {
  //Register Form Validation
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //Create new user
  const { email, password, username } = req.body;
  const hash = bcrypt.hashSync(password);
  return db
    .transaction((trx) => {
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
              email: loginEmail[0],
              username: username,
              joined: new Date(),
              verified: false,
            })
            .then((user) => {
              const accessToken = generateAccessToken({ name: username });
              const refreshToken = jwt.sign(
                { name: username },
                process.env.REFRESH_TOKEN_SECRET
              );
              try {
                db.transaction((trx) => {
                  trx
                    .insert({
                      refreshtoken: refreshToken,
                    })
                    .into("refreshtokens")
                    .then(trx.commit)
                    .catch(trx.rollback);
                });
              } catch (err) {
                console.log(err);
              }
              res.json({
                accessToken: accessToken,
                refreshToken: refreshToken,
              });
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err) => res.status(400).send(err.detail));
};

module.exports = {
  handleRegister,
};
